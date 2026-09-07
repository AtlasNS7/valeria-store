"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/lib/types";

export function TestimonialsManager({ initial }: { initial: Testimonial[] }) {
  const router = useRouter();
  const [authorName, setAuthorName] = useState("");
  const [quote, setQuote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!authorName.trim() || !quote.trim()) {
      setError("Preenche o nome e o depoimento.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error: saveError } = await supabase.from("testimonials").insert({
      author_name: authorName.trim(),
      quote: quote.trim(),
      active: true,
    });
    setSaving(false);

    if (saveError) {
      setError("Não consegui salvar. Tenta de novo.");
      return;
    }

    setAuthorName("");
    setQuote("");
    router.refresh();
  }

  async function handleToggle(id: string, active: boolean) {
    setBusyId(id);
    const supabase = createClient();
    await supabase.from("testimonials").update({ active: !active }).eq("id", id);
    setBusyId(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Apagar este depoimento?")) return;
    setBusyId(id);
    const supabase = createClient();
    await supabase.from("testimonials").delete().eq("id", id);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleAdd} className="flex flex-col gap-4 max-w-lg">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="author">
            Nome da cliente
          </label>
          <input
            id="author"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Ex: Camila R."
            className="border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--paper)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="quote">
            Depoimento
          </label>
          <textarea
            id="quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            rows={3}
            placeholder="Cole aqui a mensagem real da cliente (WhatsApp, Instagram...)"
            className="border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--paper)]"
          />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="self-start bg-[var(--plum)] text-white font-semibold rounded-full px-6 py-2.5 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "+ Adicionar depoimento"}
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {initial.length === 0 ? (
          <p className="text-[var(--ink-soft)]">
            Nenhum depoimento cadastrado ainda. Só os marcados como
            &quot;visível&quot; aparecem no site.
          </p>
        ) : (
          initial.map((t) => (
            <div
              key={t.id}
              className="flex items-start gap-4 border border-[var(--line)] rounded-lg p-3"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{t.author_name}</p>
                <p className="text-sm text-[var(--ink-soft)]">&quot;{t.quote}&quot;</p>
              </div>
              <button
                disabled={busyId === t.id}
                onClick={() => handleToggle(t.id, t.active)}
                className="text-xs font-semibold border border-[var(--line)] rounded-full px-3 py-1.5 hover:border-[var(--plum)] disabled:opacity-50 whitespace-nowrap"
              >
                {t.active ? "Visível" : "Oculto"}
              </button>
              <button
                disabled={busyId === t.id}
                onClick={() => handleDelete(t.id)}
                className="text-xs font-semibold text-red-700 disabled:opacity-50"
              >
                apagar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
