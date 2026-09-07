import type { Testimonial } from "@/lib/types";

export function TestimonialsSection({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
      <p className="text-xs uppercase tracking-[0.3em] font-semibold text-[var(--plum)] mb-3">
        Quem já recebeu
      </p>
      <h2 className="font-display italic text-2xl sm:text-3xl text-[var(--ink)] mb-10 max-w-xl">
        O que as clientes dizem
      </h2>

      <div className="grid sm:grid-cols-3 gap-6">
        {items.map((t) => (
          <figure
            key={t.id}
            className="rounded-2xl border border-[var(--line)] bg-[var(--paper-raised)] p-6"
          >
            <blockquote className="text-[var(--ink)] text-sm leading-relaxed mb-4">
              &quot;{t.quote}&quot;
            </blockquote>
            <figcaption className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
              {t.author_name}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
