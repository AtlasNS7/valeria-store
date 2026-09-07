"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { OCCASION_OPTIONS, type Product } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  perfumes: "Perfumes",
  presentes: "Presentes",
  kits: "Kits",
  geral: "Geral",
};

export function ProductFilters({ items }: { items: Product[] }) {
  const [category, setCategory] = useState<string | null>(null);
  const [occasion, setOccasion] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(items.map((p) => p.category))).filter(Boolean),
    [items],
  );

  const occasionsInUse = useMemo(
    () => OCCASION_OPTIONS.filter((o) => items.some((p) => p.occasions?.includes(o))),
    [items],
  );

  const filtered = items.filter((p) => {
    if (category && p.category !== category) return false;
    if (occasion && !p.occasions?.includes(occasion)) return false;
    return true;
  });

  const hasFilters = categories.length > 1 || occasionsInUse.length > 0;

  return (
    <div>
      {hasFilters && (
        <div className="flex flex-col gap-3 mb-8">
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(category === c ? null : c)}
                  className={`text-sm rounded-full px-4 py-1.5 border transition-colors ${
                    category === c
                      ? "bg-[var(--plum)] border-[var(--plum)] text-white"
                      : "border-[var(--line)] text-[var(--ink)] hover:border-[var(--plum)]"
                  }`}
                >
                  {CATEGORY_LABELS[c] ?? c}
                </button>
              ))}
            </div>
          )}
          {occasionsInUse.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {occasionsInUse.map((o) => (
                <button
                  key={o}
                  onClick={() => setOccasion(occasion === o ? null : o)}
                  className={`text-xs rounded-full px-3 py-1 border transition-colors ${
                    occasion === o
                      ? "bg-[var(--gold)] border-[var(--gold)] text-[var(--night)]"
                      : "border-[var(--line)] text-[var(--ink-soft)] hover:border-[var(--gold)]"
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-[var(--ink-soft)]">
          Nenhum produto encontrado com esse filtro.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
