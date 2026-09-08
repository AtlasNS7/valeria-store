"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { whatsappLink } from "@/lib/site";
import type { Product } from "@/lib/types";

const BUDGET_OPTIONS = [
  { label: "Até R$ 100", max: 10000 },
  { label: "R$ 100 – R$ 200", max: 20000 },
  { label: "Acima de R$ 200", max: Infinity },
] as const;

const OCCASION_OPTIONS = [
  { label: "Namoro / Aniversário de namoro", tag: "Namorados" },
  { label: "Aniversário dela", tag: "Aniversário" },
  { label: "Sem motivo especial, só pra surpreender", tag: "Para ela" },
] as const;

export function GiftQuiz({ products }: { products: Product[] }) {
  const [budget, setBudget] = useState<(typeof BUDGET_OPTIONS)[number] | null>(null);
  const [occasion, setOccasion] = useState<(typeof OCCASION_OPTIONS)[number] | null>(null);

  const results = useMemo(() => {
    if (!budget || !occasion) return [];

    const byBudgetAndTag = products.filter(
      (p) => p.price_cents <= budget.max && p.occasions?.includes(occasion.tag),
    );
    if (byBudgetAndTag.length > 0) {
      return byBudgetAndTag.sort((a, b) => b.price_cents - a.price_cents).slice(0, 3);
    }

    // Fallback: ninguém marcado com essa ocasião ainda — mostra o que couber no orçamento
    const byBudget = products.filter((p) => p.price_cents <= budget.max);
    return byBudget.sort((a, b) => b.price_cents - a.price_cents).slice(0, 3);
  }, [products, budget, occasion]);

  const step = !budget ? 1 : !occasion ? 2 : 3;

  const whatsappMessage =
    budget && occasion
      ? `Olá! Fiz o teste do site: procuro um presente pra namorada, ocasião "${occasion.label}", orçamento ${budget.label}. Pode me ajudar a escolher?`
      : "Olá! Quero ajuda pra escolher um presente pra namorada.";

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-raised)] p-6 sm:p-10">
      {step < 3 && (
        <div className="flex items-center gap-2 mb-8 text-xs font-semibold text-[var(--ink-soft)]">
          <span className={step >= 1 ? "text-[var(--plum)]" : ""}>1. Orçamento</span>
          <span aria-hidden>→</span>
          <span className={step >= 2 ? "text-[var(--plum)]" : ""}>2. Ocasião</span>
        </div>
      )}

      {step === 1 && (
        <div>
          <h3 className="font-display italic text-xl sm:text-2xl text-[var(--ink)] mb-6">
            Quanto você quer investir?
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            {BUDGET_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setBudget(opt)}
                className="flex-1 text-left sm:text-center border border-[var(--line)] rounded-xl px-5 py-4 font-semibold text-[var(--ink)] hover:border-[var(--plum)] hover:bg-[var(--paper)] transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="font-display italic text-xl sm:text-2xl text-[var(--ink)] mb-6">
            Qual é a ocasião?
          </h3>
          <div className="flex flex-col gap-3">
            {OCCASION_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setOccasion(opt)}
                className="text-left border border-[var(--line)] rounded-xl px-5 py-4 font-semibold text-[var(--ink)] hover:border-[var(--plum)] hover:bg-[var(--paper)] transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setBudget(null)}
            className="mt-6 text-sm text-[var(--ink-soft)] hover:text-[var(--plum)]"
          >
            ← voltar
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="font-display italic text-xl sm:text-2xl text-[var(--ink)] mb-2">
            {results.length > 0 ? "Separamos essas opções pra você" : "Ainda não temos o kit ideal cadastrado"}
          </h3>
          <p className="text-sm text-[var(--ink-soft)] mb-8">
            {results.length > 0
              ? "Se nenhuma bater 100%, é só chamar no WhatsApp que a Valéria monta uma combinação sob medida."
              : "Mas a Valéria monta uma combinação sob medida pra você — é só chamar no WhatsApp."}
          </p>

          {results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={whatsappLink(whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--plum)] text-white font-semibold rounded-full px-6 py-3 hover:bg-[var(--plum-dark)] transition-colors"
            >
              Falar com a Valéria no WhatsApp
              <span aria-hidden>→</span>
            </a>
            <button
              onClick={() => {
                setBudget(null);
                setOccasion(null);
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
