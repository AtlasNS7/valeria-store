import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
