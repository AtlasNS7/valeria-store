import { createClient } from "@/lib/supabase/server";
import { GiftQuiz } from "@/components/GiftQuiz";
import { sortByProductLine, type Product } from "@/lib/types";

export const metadata = {
  title: "Presente pra namorada | Valéria Gift & Essence",
  description:
    "Não sabe o que ela vai gostar? Responda 2 perguntas rápidas e a gente monta o presente certo, embalado e pronto pra entregar.",
};

export default async function GiftForGirlfriendPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  const items = sortByProductLine((products ?? []) as Product[]);

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
      <p className="text-xs uppercase tracking-[0.3em] font-semibold text-[var(--plum)] mb-3">
        Presente pra namorada
      </p>
      <h1 className="font-display italic text-3xl sm:text-4xl text-[var(--ink)] mb-4 max-w-xl text-balance">
        Não sabe o que ela vai gostar? A gente te ajuda a acertar.
      </h1>
      <p className="text-[var(--ink-soft)] max-w-lg mb-10">
        Responde 2 perguntas rápidas e a gente mostra as melhores opções pro seu
        orçamento e pra ocasião — já embalado pra presente, sem enrolação.
      </p>

      <GiftQuiz products={items} />

      <ul className="text-sm text-[var(--ink-soft)] flex flex-col gap-1.5 mt-10 pt-8 border-t border-[var(--line)]">
        <li>🎀 Todo pedido já sai embalado pra presente</li>
        <li>✒️ Dá pra incluir uma mensagem no cartão</li>
        <li>💬 Se preferir, é só chamar direto no WhatsApp e contar o que precisa</li>
      </ul>
    </div>
  );
}
