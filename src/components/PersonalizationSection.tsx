import { whatsappLink } from "@/lib/site";

const FEATURES = [
  {
    icon: "✒️",
    title: "Mensagem no cartão",
    desc: "Escreva o que quiser dizer — a gente inclui um cartão junto com o pedido.",
  },
  {
    icon: "🎀",
    title: "Embalagem para presente",
    desc: "Toda peça sai embrulhada com cuidado, pronta pra entregar em mãos.",
  },
  {
    icon: "🧴",
    title: "Combinação sob medida",
    desc: "Conte a ocasião e o perfil de quem vai receber — a Valéria monta a combinação ideal.",
  },
];

export function PersonalizationSection() {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--paper-raised)]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <p className="text-xs uppercase tracking-[0.3em] font-semibold text-[var(--plum)] mb-3">
          Feito sob medida
        </p>
        <h2 className="font-display italic text-2xl sm:text-3xl text-[var(--ink)] mb-10 max-w-xl">
          Personalize o presente do jeito que só a Valéria faz
        </h2>

        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {FEATURES.map((f) => (
            <div key={f.title}>
              <span className="text-2xl mb-3 block">{f.icon}</span>
              <p className="font-semibold text-[var(--ink)] mb-1">{f.title}</p>
              <p className="text-sm text-[var(--ink-soft)]">{f.desc}</p>
            </div>
          ))}
        </div>

        <a
          href={whatsappLink("Olá! Quero personalizar um presente 🎁")}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-[var(--plum)] text-[var(--night)] font-semibold rounded-full px-6 py-3 hover:bg-[var(--plum-dark)] transition-colors"
        >
          Quero personalizar pelo WhatsApp
          <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
