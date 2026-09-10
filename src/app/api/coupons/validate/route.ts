import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type ValidateBody = {
  code?: string;
};

// Só confere e mostra o desconto no carrinho — NÃO marca o cupom como
// usado. A validação real (e a marcação de uso, atômica) acontece de novo
// em /api/checkout, que nunca confia nesse preview.
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ValidateBody;
    const code = body.code?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        { error: "Informe um código de cupom." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();
    const { data: lead, error } = await supabase
      .from("leads")
      .select("discount_percent, used, expires_at")
      .eq("coupon_code", code)
      .maybeSingle();

    if (error || !lead) {
      return NextResponse.json({ error: "Cupom não encontrado." }, { status: 404 });
    }
    if (lead.used) {
      return NextResponse.json(
        { error: "Esse cupom já foi utilizado." },
        { status: 409 },
      );
    }
    if (new Date(lead.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: "Esse cupom expirou." }, { status: 410 });
    }

    return NextResponse.json({ discount_percent: lead.discount_percent });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro inesperado ao validar o cupom." },
      { status: 500 },
    );
  }
}
