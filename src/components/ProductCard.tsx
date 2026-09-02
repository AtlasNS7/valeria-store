import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatBRL } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group flex flex-col rounded-lg border border-[var(--line)] bg-[var(--paper-raised)] overflow-hidden hover:border-[var(--plum)] transition-colors"
    >
      <div className="relative aspect-square bg-[var(--line)]">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--ink-soft)] text-sm">
            sem foto
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1">
        <span className="text-sm font-semibold leading-snug">{product.name}</span>
        <span className="font-display italic text-[var(--plum-dark)]">
          {formatBRL(product.price_cents)}
        </span>
      </div>
    </Link>
  );
}
