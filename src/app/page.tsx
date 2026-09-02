import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";

const FEATURES = [
  {
    title: "Feito à mão",
    desc: "Cada peça é preparada artesanalmente, sem produção em série.",
  },
  {
    title: "Embalagem para presente",
    desc: "Pronto para entregar — ou receber — com todo o cuidado.",
  },
  {
    title: "Entrega para todo o Brasil",
    desc: "Pagamento seguro por Pix ou cartão, direto no site.",
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  const items = (products ?? []) as Product[];

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--night)] text-[var(--paper)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            background:
              "radial-gradient(circle at 18% 20%, var(--gold), transparent 45%), radial-gradient(circle at 82% 75%, var(--gold), transparent 40%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-[var(--gold)] mb-5">
            Perfumaria &amp; presentes artesanais
          </p>
          <h1 className="font-display italic text-4xl sm:text-6xl leading-[1.05] max-w-2xl mb-6 text-balance">
            Cada frasco carrega uma história feita à mão.
          </h1>
          <p className="text-base sm:text-lg text-[var(--paper)]/70 max-w-md mb-9">
            Valéria cria perfumes e presentes autorais, um a um, para quem
            gosta de dar — e receber — algo com significado.
          </p>
          <a
            href="#colecao"
            className="inline-flex items-center gap-2 bg-[var(--gold)] text-[var(--night)] font-semibold rounded-full px-7 py-3 hover:bg-[var(--paper)] transition-colors"
          >
            Ver a coleção
            <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--paper-raised)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <p className="font-semibold text-[var(--ink)] mb-1">{f.title}</p>
              <p className="text-sm text-[var(--ink-soft)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="colecao" className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <div className="flex items-end justify-between mb-8 gap-4">
          <h2 className="font-display italic text-2xl sm:text-3xl text-[var(--ink)]">
            A coleção
          </h2>
          {items.length > 0 && (
            <span className="text-sm text-[var(--ink-soft)] whitespace-nowrap">
              {items.length} {items.length === 1 ? "item" : "itens"}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-[var(--ink-soft)]">
            Nenhum produto cadastrado ainda. Assim que a Valéria adicionar
            produtos no painel administrativo, eles aparecem aqui.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
