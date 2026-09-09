import { LastMinuteGiftQuiz } from "@/components/LastMinuteGiftQuiz";

export const metadata = {
  title: "Esqueceu a data? | Valéria Gift & Essence",
  description:
    "Presente de última hora sem estresse. Responda 2 perguntas rápidas e fale direto com a Valéria no WhatsApp.",
};

export default function ForgotTheDatePage() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
      <p className="text-xs uppercase tracking-[0.3em] font-semibold text-[var(--plum)] mb-3">
        Presente de última hora
      </p>
      <h1 className="font-display italic text-3xl sm:text-4xl text-[var(--ink)] mb-4 max-w-xl text-balance">
        Esqueceu a data? A gente resolve rápido.
      </h1>
      <p className="text-[var(--ink-soft)] max-w-lg mb-10">
        Responde 2 perguntas rápidas e a gente já te ajuda a fechar o
        presente certo, mesmo em cima da hora — sem enrolação.
      </p>

      <LastMinuteGiftQuiz />

      <ul className="text-sm text-[var(--ink-soft)] flex flex-col gap-1.5 mt-10 pt-8 border-t border-[var(--line)]">
        <li>🎀 Todo pedido já sai embalado pra presente</li>
        <li>✒️ Dá pra incluir uma mensagem no cartão</li>
        <li>💬 Se preferir, é só chamar direto no WhatsApp e contar o que precisa</li>
      </ul>
    </div>
  );
}
