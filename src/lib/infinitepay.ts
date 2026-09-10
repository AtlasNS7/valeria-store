import type { OrderItem } from "./types";

const CHECKOUT_API = "https://api.checkout.infinitepay.io";

type CreateLinkParams = {
  orderId: string;
  items: OrderItem[];
  totalCents: number;
  customerName: string;
  couponCode?: string | null;
  discountCents?: number;
};

type CreateLinkResult = {
  url: string;
  order_nsu?: string;
};

/**
 * Cria um link de pagamento InfinitePay (Checkout Integrado) para um pedido.
 * O cliente é redirecionado para esse link (página hospedada pela InfinitePay)
 * para pagar via Pix ou cartão. Documentação:
 * https://www.infinitepay.io/checkout-documentacao
 */
export async function createInfinitePayLink({
  orderId,
  items,
  totalCents,
  customerName,
  couponCode,
  discountCents = 0,
}: CreateLinkParams): Promise<CreateLinkResult> {
  const handle = process.env.INFINITEPAY_HANDLE;
  if (!handle) {
    throw new Error("INFINITEPAY_HANDLE não configurado no .env.local");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const computedTotal = items.reduce((sum, i) => sum + i.price_cents * i.qty, 0);
  if (computedTotal - discountCents !== totalCents) {
    // Proteção contra inconsistência entre o total calculado no checkout
    // e a soma real dos itens (já descontado o cupom, se houver) — evita
    // mandar um valor errado pra cobrança.
    throw new Error(
      `Total do pedido não bate com a soma dos itens (esperado ${totalCents}, calculado ${computedTotal - discountCents}).`,
    );
  }

  // A API de Checkout Integrado não tem um campo de "desconto" separado —
  // representamos o cupom como uma linha de valor negativo, o que faz a
  // soma dos itens bater com o total já descontado. Confirme esse
  // comportamento contra a conta real da InfinitePay antes de usar em
  // produção (a doc pública não documenta preço negativo explicitamente).
  const lineItems = items.map((item) => ({
    name: item.name,
    price: item.price_cents, // em centavos
    quantity: item.qty,
  }));
  if (discountCents > 0) {
    lineItems.push({
      name: couponCode ? `Cupom ${couponCode}` : "Desconto",
      price: -discountCents,
      quantity: 1,
    });
  }

  const body = {
    handle,
    order_nsu: orderId, // usamos o id do pedido como referência única
    items: lineItems,
    customer: {
      name: customerName,
    },
    redirect_url: `${siteUrl}/pedido/sucesso?order=${orderId}`,
    webhook_url: `${siteUrl}/api/webhook/infinitepay`,
  };

  const res = await fetch(`${CHECKOUT_API}/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Falha ao criar link de pagamento InfinitePay (${res.status}): ${text}`,
    );
  }

  const data = await res.json();

  // O formato exato de resposta pode variar — ajuste o campo abaixo
  // conforme o retorno real da sua conta (confira no painel/documentação).
  const url = data.url ?? data.payment_url ?? data.link;
  if (!url) {
    throw new Error(
      "Resposta da InfinitePay não trouxe um link de pagamento. Verifique supabase/schema.sql e src/lib/infinitepay.ts contra a doc atual da InfinitePay.",
    );
  }

  return { url, order_nsu: data.order_nsu ?? orderId };
}

/**
 * Confere manualmente o status de um pagamento (fallback caso o webhook
 * não chegue). Ver: POST /payment_check na doc da InfinitePay.
 */
export async function checkInfinitePayPayment(orderNsu: string) {
  const handle = process.env.INFINITEPAY_HANDLE;
  const res = await fetch(`${CHECKOUT_API}/payment_check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ handle, order_nsu: orderNsu }),
  });
  if (!res.ok) return { paid: false };
  const data = await res.json();
  return { paid: Boolean(data.paid ?? data.status === "paid"), raw: data };
}
