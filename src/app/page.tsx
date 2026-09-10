import { createClient } from "@/lib/supabase/server";
import { ProductFilters } from "@/components/ProductFilters";
import { GirlfriendGiftBanner } from "@/components/GirlfriendGiftBanner";
import { HeroCarousel } from "@/components/HeroCarousel";
import { LastMinuteGiftBanner } from "@/components/LastMinuteGiftBanner";
import { PersonalizationSection } from "@/components/PersonalizationSection";
import { RealGiftsShowcase } from "@/components/RealGiftsShowcase";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { sortByProductLine, type Product, type Testimonial } from "@/lib/types";

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
  const [{ data: products }, { data: testimonials }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("testimonials")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const items = sortByProductLine((products ?? []) as Product[]);
  const testimonialItems = (testimonials ?? []) as Testimonial[];

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--night)] text-[var(--ink)]">
        <HeroCarousel />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <p className="text-xs uppercase tracking-[0.3em] font-semibold text-[var(--gold)] mb-5">
            Perfumaria &amp; presentes artesanais
          </p>
          <h1 className="font-display italic text-4xl sm:text-6xl leading-[1.05] max-w-2xl mb-6 text-balance">
            Cada frasco carrega uma história feita à mão.
          </h1>
          <p className="text-base sm:text-lg text-[var(--ink-soft)] max-w-md mb-9">
            Valéria cria perfumes e presentes autorais, um a um, para quem
            gosta de dar — e receber — algo com significado.
          </p>
          <a
            href="#colecao"
            className="inline-flex items-center gap-2 border border-[var(--gold)] text-[var(--gold)] font-semibold rounded-full px-7 py-3 hover:bg-[var(--gold)] hover:text-[var(--night)] transition-colors"
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

      <GirlfriendGiftBanner />
      <LastMinuteGiftBanner />

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
          <ProductFilters items={items} />
        )}
      </section>

      <RealGiftsShowcase />

      <PersonalizationSection />
      <TestimonialsSection items={testimonialItems} />
    </>
  );
}
