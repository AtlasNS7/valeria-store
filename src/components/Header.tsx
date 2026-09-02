"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-display italic text-2xl text-[var(--plum-dark)] transition-colors group-hover:text-[var(--plum)]">
            Valéria
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-soft)]">
            Gift &amp; Essence
          </span>
        </Link>
        <Link
          href="/carrinho"
          className="text-sm font-semibold text-[var(--ink)] border border-[var(--line)] rounded-full px-5 py-2 hover:border-[var(--plum)] hover:text-[var(--plum)] transition-colors"
        >
          Carrinho{totalItems > 0 ? ` (${totalItems})` : ""}
        </Link>
      </div>
    </header>
  );
}
