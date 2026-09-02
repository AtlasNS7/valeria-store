import type { OrderItem } from "./types";

const CHECKOUT_API = "https://api.checkout.infinitepay.io";

type CreateLinkParams = {
  orderId: string;
  items: OrderItem[];
  totalCents: number;
  customerName: string;
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
}: CreateLinkParams): Promise<CreateLinkResult> {
  const handle = process.env.INFINITEPAY_HANDLE;
  if (!handle) {
    throw new Error("INFINITEPAY_HANDLE não configurado no .env.local");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const computedTotal = items.reduce((sum, i) => sum + i.price_cents * i.qty, 0);
  if (computedTotal !== totalCents) {
    // Proteção contra inconsistência entre o total calculado no checkout
    // e a soma real dos itens — evita mandar um valor errado pra cobrança.
    throw new Error(
      `Total do pedido não bate com a soma dos itens (esperado ${totalCents}, calculado ${computedTotal}).`,
    );
  }

  const body = {
    handle,
    order_nsu: orderId, // usamos o id do pedido como referência única
    items: items.map((item) => ({
      name: item.name,
      price: item.price_cents, // em centavos
      quantity: item.qty,
    })),
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
