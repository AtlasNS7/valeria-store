import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateCouponCode, LEAD_COUPON_DISCOUNT_PERCENT } from "@/lib/coupon";

type LeadBody = {
  name: string;
  whatsapp: string;
};

const MAX_CODE_ATTEMPTS = 5;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadBody;

    if (!body.name?.trim() || !body.whatsapp?.trim()) {
      return NextResponse.json(
        { error: "Preenche nome e WhatsApp pra receber o cupom." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    // Tenta gerar um código único algumas vezes — colisão é rara (4
    // caracteres alfanuméricos), mas o INSERT pode falhar por unique_violation.
    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
      const couponCode = generateCouponCode();
      const { data: lead, error } = await supabase
        .from("leads")
        .insert({
          name: body.name.trim(),
          whatsapp: body.whatsapp.trim(),
          coupon_code: couponCode,
          discount_percent: LEAD_COUPON_DISCOUNT_PERCENT,
        })
        .select("coupon_code, discount_percent")
        .single();

      if (!error && lead) {
        return NextResponse.json({
          coupon_code: lead.coupon_code,
          discount_percent: lead.discount_percent,
        });
      }

      // 23505 = unique_violation (código já existe) — tenta de novo com um
      // código novo. Qualquer outro erro interrompe o loop.
      if (error?.code !== "23505") {
        console.error("Erro ao criar lead:", error);
        break;
      }
    }

    return NextResponse.json(
      { error: "Não consegui gerar seu cupom agora. Tenta de novo." },
      { status: 500 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro inesperado ao gerar o cupom." },
      { status: 500 },
    );
  }
}
