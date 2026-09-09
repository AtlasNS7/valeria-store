"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/site";

const RECIPIENT_OPTIONS = ["Mãe", "Irmã", "Namorada ou esposa", "Amiga"] as const;

const WHEN_OPTIONS = ["Hoje", "Amanhã", "Essa semana"] as const;

export function LastMinuteGiftQuiz() {
  const [recipient, setRecipient] = useState<(typeof RECIPIENT_OPTIONS)[number] | null>(null);
  const [when, setWhen] = useState<(typeof WHEN_OPTIONS)[number] | null>(null);

  const step = !recipient ? 1 : !when ? 2 : 3;

  const whatsappMessage =
    recipient && when
      ? `Olá! Esqueci a data 😅 preciso de um presente pra ${recipient.toLowerCase()}, e é pra ${when.toLowerCase()}. Pode me ajudar a resolver rápido?`
      : "Olá! Esqueci a data e preciso de ajuda pra resolver um presente rápido.";

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-raised)] p-6 sm:p-10">
      {step < 3 && (
        <div className="flex items-center gap-2 mb-8 text-xs font-semibold text-[var(--ink-soft)]">
          <span className={step >= 1 ? "text-[var(--plum)]" : ""}>1. Pra quem</span>
          <span aria-hidden>→</span>
          <span className={step >= 2 ? "text-[var(--plum)]" : ""}>2. Pra quando</span>
        </div>
      )}

      {step === 1 && (
        <div>
          <h3 className="font-display italic text-xl sm:text-2xl text-[var(--ink)] mb-6">
            Pra quem é o presente?
          </h3>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            {RECIPIENT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setRecipient(opt)}
                className="flex-1 text-left sm:text-center border border-[var(--line)] rounded-xl px-5 py-4 font-semibold text-[var(--ink)] hover:border-[var(--plum)] hover:bg-[var(--paper)] transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="font-display italic text-xl sm:text-2xl text-[var(--ink)] mb-6">
            Pra quando é a data?
          </h3>
          <div className="flex flex-col gap-3">
            {WHEN_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setWhen(opt)}
                className="text-left border border-[var(--line)] rounded-xl px-5 py-4 font-semibold text-[var(--ink)] hover:border-[var(--plum)] hover:bg-[var(--paper)] transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            onClick={() => setRecipient(null)}
            className="mt-6 text-sm text-[var(--ink-soft)] hover:text-[var(--plum)]"
          >
            ← voltar
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="font-display italic text-xl sm:text-2xl text-[var(--ink)] mb-2">
            Dá tempo, sim!
          </h3>
          <p className="text-sm text-[var(--ink-soft)] mb-8">
            Mesmo em cima da hora a Valéria resolve rápido — é só chamar no
            WhatsApp que ela já separa as melhores opções pra{" "}
            {recipient?.toLowerCase()}, pra {when?.toLowerCase()}.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={whatsappLink(whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--plum)] text-[var(--night)] font-semibold rounded-full px-6 py-3 hover:bg-[var(--plum-dark)] transition-colors"
            >
              Falar com a Valéria no WhatsApp
              <span aria-hidden>→</span>
            </a>
            <button
              onClick={() => {
                setRecipient(null);
                setWhen(null);
              }}
              className="text-sm font-semibold text-[var(--ink-soft)] hover:text-[var(--plum)]"
            >
              Refazer o teste
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
