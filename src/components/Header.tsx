"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="border-b border-[var(--line)] bg-[var(--paper)] sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-display italic text-xl text-[var(--plum-dark)]">
          Valéria Gift &amp; Essence
        </Link>
        <Link
          href="/carrinho"
          className="text-sm font-semibold text-[var(--ink)] border border-[var(--line)] rounded-full px-4 py-1.5 hover:border-[var(--plum)] transition-colors"
        >
          Carrinho{totalItems > 0 ? ` (${totalItems})` : ""}
        </Link>
      </div>
    </header>
  );
}
