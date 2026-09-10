"use client";

import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/site";

const STORAGE_KEY = "valeria-lead-modal-dismissed";
const SHOW_DELAY_MS = 6000;

type Coupon = { code: string; discountPercent: number };

export function LeadCaptureModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // localStorage indisponível (modo privado, etc) — mostra o popup mesmo assim.
    }
    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // sem problema — só reaparece na próxima visita.
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !whatsapp.trim()) {
      setError("Preenche nome e WhatsApp pra receber o cupom.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, whatsapp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Não deu pra gerar seu cupom.");

      setCoupon({ code: data.coupon_code, discountPercent: data.discount_percent });
      setStep("success");
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // sem problema.
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não deu pra gerar seu cupom. Tenta de novo.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!coupon) return;
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponível — o código já está visível na tela.
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--night)]/70 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-[var(--radius)] border border-[var(--line)] bg-[var(--paper-raised)] p-6 sm:p-8 shadow-[var(--shadow-card)]">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fechar"
          className="absolute top-4 right-4 text-[var(--ink-soft)] hover:text-[var(--plum)]"
        >
          ✕
        </button>

        {step === "form" ? (
          <>
            <p className="text-xs uppercase tracking-[0.3em] font-semibold text-[var(--gold)] mb-3">
              Presente de boas-vindas
            </p>
            <h2 className="font-display italic text-2xl text-[var(--ink)] mb-2">
              Ganhe um cupom de desconto
            </h2>
            <p className="text-sm text-[var(--ink-soft)] mb-6">
              Deixa seu nome e WhatsApp que a gente te dá um cupom exclusivo pra
              usar agora na loja.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--paper)]"
              />
              <input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Seu WhatsApp"
                className="border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--paper)]"
              />
              {error && <p className="text-sm text-red-700">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="bg-[var(--plum)] text-[var(--night)] font-semibold rounded-full px-6 py-3 hover:bg-[var(--plum-dark)] transition-colors disabled:opacity-50"
              >
                {loading ? "Gerando cupom..." : "Quero meu cupom"}
              </button>
            </form>
          </>
        ) : (
          coupon && (
            <>
              <p className="text-xs uppercase tracking-[0.3em] font-semibold text-[var(--gold)] mb-3">
                Cupom liberado
              </p>
              <h2 className="font-display italic text-2xl text-[var(--ink)] mb-2">
                {coupon.discountPercent}% de desconto pra você
              </h2>
              <p className="text-sm text-[var(--ink-soft)] mb-4">
                Use esse código no checkout pra garantir seu desconto:
              </p>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex-1 font-display italic text-xl text-[var(--plum-dark)] border border-[var(--line)] rounded-lg px-4 py-3 text-center">
                  {coupon.code}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-sm font-semibold text-[var(--ink)] border border-[var(--line)] rounded-full px-4 py-3 hover:border-[var(--plum)] hover:text-[var(--plum)] transition-colors whitespace-nowrap"
                >
                  {copied ? "Copiado!" : "Copiar"}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={whatsappLink(
                    `Olá! Ganhei o cupom ${coupon.code} (${coupon.discountPercent}% de desconto) no site. Quero aproveitar!`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-[var(--plum)] text-[var(--night)] font-semibold rounded-full px-6 py-3 hover:bg-[var(--plum-dark)] transition-colors"
                >
                  Falar no WhatsApp
                  <span aria-hidden>→</span>
                </a>
                <button
                  type="button"
                  onClick={dismiss}
                  className="text-sm font-semibold text-[var(--ink-soft)] hover:text-[var(--plum)]"
                >
                  Continuar navegando
                </button>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
