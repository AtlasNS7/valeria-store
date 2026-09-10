import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OrderItem } from "@/lib/types";

// A InfinitePay chama esta URL quando o status de um pagamento muda
// (configurado como `webhook_url` na criação do link, em src/lib/infinitepay.ts).
// Como a documentação pública deles não detalha um esquema de assinatura,
// tratamos o corpo com cautela: só marcamos como pago um pedido que já existe
// e está pendente, e sempre respondemos 200 rápido pra evitar retries.
export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "corpo inválido" }, { status: 400 });
  }

  // Ajuste estes nomes de campo conforme o payload real que a InfinitePay
  // enviar na sua conta (confira em produção — o formato exato não está
  // 100% documentado publicamente). order_nsu é o id do pedido que nós
  // mesmos definimos ao criar o link em src/lib/infinitepay.ts.
  const orderNsu =
    (payload.order_nsu as string) ??
    (payload.orderNsu as string) ??
    (payload.nsu as string);
  const status = (payload.status as string) ?? (payload.paid ? "paid" : undefined);

  if (!orderNsu) {
    return NextResponse.json({ ok: false, error: "order_nsu ausente" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const isPaid = status === "paid" || status === "approved" || status === "success";
  // Mesma ressalva do campo `status` acima: ajuste esses valores conforme o
  // payload real da InfinitePay assim que a conta estiver ativa.
  const isFailed =
    status === "failed" ||
    status === "canceled" ||
    status === "cancelled" ||
    status === "refused" ||
    status === "expired";

  if (isFailed) {
    // O checkout já reserva (decrementa) o estoque na criação do pedido.
    // Se o pagamento não vai pra frente, devolvemos essas unidades ao
    // catálogo. O `.eq("status", "pending")` garante que isso só roda uma
    // vez por pedido, mesmo se a InfinitePay reenviar o mesmo webhook.
    const { data: canceledOrder, error: cancelError } = await supabase
      .from("orders")
      .update({
        status: "canceled",
        infinitepay_order_nsu: orderNsu,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderNsu)
      .eq("status", "pending")
      .select("items, coupon_code")
      .single();

    if (cancelError && cancelError.code !== "PGRST116") {
      // PGRST116 = nenhuma linha encontrada (pedido já não estava mais
      // pendente) — nesse caso não há estoque a devolver, e tudo bem.
      console.error("Erro ao cancelar pedido via webhook:", cancelError);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    if (canceledOrder) {
      const items = canceledOrder.items as OrderItem[];
      const { error: restoreError } = await supabase.rpc("restore_stock", {
        items: items.map((i) => ({ product_id: i.product_id, qty: i.qty })),
      });
      if (restoreError) {
        console.error("Erro ao repor estoque via webhook:", restoreError);
      }

      // Pagamento não foi pra frente — libera o cupom pra ele poder tentar
      // de novo (o desconto tinha sido "reivindicado" no checkout).
      const canceledCouponCode = (canceledOrder as { coupon_code?: string | null })
        .coupon_code;
      if (canceledCouponCode) {
        const { error: couponError } = await supabase
          .from("leads")
          .update({ used: false, used_at: null })
          .eq("coupon_code", canceledCouponCode);
        if (couponError) {
          console.error("Erro ao liberar cupom via webhook:", couponError);
        }
      }
    }

    return NextResponse.json({ ok: true });
  }

  const { error } = await supabase
    .from("orders")
    .update({
      status: isPaid ? "paid" : "pending",
      infinitepay_order_nsu: orderNsu,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderNsu);

  if (error) {
    console.error("Erro ao atualizar pedido via webhook:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
