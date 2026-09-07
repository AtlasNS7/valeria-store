import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatBRL } from "@/lib/types";

const GIFT_CATEGORIES = ["presentes", "kits"];

export function ProductCard({ product }: { product: Product }) {
  const isGift = GIFT_CATEGORIES.includes(product.category);

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group flex flex-col rounded-2xl border border-[var(--line)] bg-[var(--paper-raised)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[var(--plum)]/40 hover:shadow-[0_18px_40px_-20px_rgba(24,18,13,0.35)]"
    >
      <div className="relative aspect-square bg-[var(--line)] overflow-hidden">
        {isGift && (
          <span className="absolute top-2 left-2 z-10 text-[10px] font-semibold uppercase tracking-wide bg-[var(--paper)]/90 text-[var(--plum-dark)] rounded-full px-2 py-1">
            🎁 presente
          </span>
        )}
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--ink-soft)] text-sm">
            sem foto
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1.5">
        <span className="text-sm font-semibold leading-snug text-[var(--ink)]">
          {product.name}
        </span>
        <div className="flex items-center justify-between">
          <span className="font-display italic text-[var(--plum-dark)]">
            {formatBRL(product.price_cents)}
          </span>
          <span className="text-xs font-semibold text-[var(--plum)] opacity-0 transition-opacity group-hover:opacity-100">
            ver →
          </span>
        </div>
      </div>
    </Link>
  );
}
