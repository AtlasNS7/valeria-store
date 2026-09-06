import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createInfinitePayLink } from "@/lib/infinitepay";
import type { CartItem, OrderItem } from "@/lib/types";

type CheckoutBody = {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: CartItem[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;

    if (
      !body.customer_name?.trim() ||
      !body.customer_phone?.trim() ||
      !body.customer_address?.trim() ||
      !body.items?.length
    ) {
      return NextResponse.json(
        { error: "Dados incompletos para fechar o pedido." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    // Confere o preço real dos produtos no banco (nunca confia no preço
    // mandado pelo navegador) e monta os itens do pedido.
    const productIds = body.items.map((i) => i.product_id);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, price_cents, active, stock")
      .in("id", productIds);

    if (productsError || !products) {
      return NextResponse.json(
        { error: "Não consegui validar os produtos do carrinho." },
        { status: 500 },
      );
    }

    const orderItems: OrderItem[] = [];
    let totalCents = 0;

    for (const cartItem of body.items) {
      const product = products.find((p) => p.id === cartItem.product_id);
      if (!product || !product.active) {
        return NextResponse.json(
          { error: `Produto "${cartItem.name}" não está mais disponível.` },
          { status: 400 },
        );
      }
      const qty = Math.max(1, Math.floor(cartItem.qty));
      if (qty > product.stock) {
        return NextResponse.json(
          {
            error: `Só temos ${product.stock} unidade(s) de "${product.name}" em estoque.`,
          },
          { status: 409 },
        );
      }
      orderItems.push({
        product_id: product.id,
        name: product.name,
        price_cents: product.price_cents,
        qty,
      });
      totalCents += product.price_cents * qty;
    }

    // Confere e baixa o estoque em uma única transação no banco (função
    // decrement_stock em supabase/schema.sql). Isso fecha a corrida em que
    // dois clientes compram o último frasco ao mesmo tempo: quem chegar
    // primeiro reserva o estoque, o segundo recebe o erro abaixo.
    const stockPayload = orderItems.map((i) => ({
      product_id: i.product_id,
      qty: i.qty,
    }));
    const { error: stockError } = await supabase.rpc("decrement_stock", {
      items: stockPayload,
    });

    if (stockError) {
      const message = stockError.message?.startsWith("Estoque insuficiente")
        ? stockError.message
        : "Um dos produtos ficou sem estoque suficiente. Atualiza o carrinho e tenta de novo.";
      return NextResponse.json({ error: message }, { status: 409 });
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: body.customer_name.trim(),
        customer_phone: body.customer_phone.trim(),
        customer_address: body.customer_address.trim(),
        items: orderItems,
        total_cents: totalCents,
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      // O estoque já tinha sido reservado para este pedido — como ele não
      // foi criado, devolve as unidades pro catálogo.
      await supabase.rpc("restore_stock", { items: stockPayload });
      return NextResponse.json(
        { error: "Não consegui criar o pedido. Tenta de novo." },
        { status: 500 },
      );
    }

    try {
      const { url } = await createInfinitePayLink({
        orderId: order.id,
        items: orderItems,
        totalCents,
        customerName: body.customer_name.trim(),
      });

      await supabase
        .from("orders")
        .update({ infinitepay_link: url })
        .eq("id", order.id);

      return NextResponse.json({ payment_url: url, order_id: order.id });
    } catch (payErr) {
      // Pedido já existe no banco (status "pending") mesmo se o link falhar,
      // então nada se perde — dá pra tentar de novo ou atender manualmente.
      // O estoque continua reservado de propósito (o pedido pode ainda ser
      // pago); se ele nunca for pago, o webhook restaura o estoque quando a
      // InfinitePay avisar que o pagamento falhou/expirou.
      console.error("Erro ao criar link InfinitePay:", payErr);
      return NextResponse.json(
        {
          error:
            "Pedido registrado, mas não consegui gerar o link de pagamento agora. Fale com a gente pelo WhatsApp.",
        },
        { status: 502 },
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro inesperado ao processar o pedido." },
      { status: 500 },
    );
  }
}
