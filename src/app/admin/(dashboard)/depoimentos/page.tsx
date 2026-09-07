import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/types";
import { TestimonialsManager } from "./TestimonialsManager";

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  const items = (data ?? []) as Testimonial[];

  return (
    <div>
      <h1 className="font-display italic text-2xl mb-2">Depoimentos</h1>
      <p className="text-sm text-[var(--ink-soft)] mb-6">
        Cole aqui mensagens reais de clientes (WhatsApp, Instagram, etc). Eles
        aparecem na loja só quando marcados como &quot;Visível&quot;.
      </p>
      <TestimonialsManager initial={items} />
    </div>
  );
}
