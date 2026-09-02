"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const router = useRouter();

  return (
    <div className="flex gap-3">
      <button
        onClick={() => {
          addItem(product);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        disabled={product.stock <= 0}
        className="bg-[var(--plum)] text-white font-semibold rounded-full px-6 py-2.5 hover:bg-[var(--plum-dark)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {added ? "Adicionado ✓" : "Adicionar ao carrinho"}
      </button>
      <button
        onClick={() => {
          addItem(product);
          router.push("/carrinho");
        }}
        disabled={product.stock <= 0}
        className="border border-[var(--line)] font-semibold rounded-full px-6 py-2.5 hover:border-[var(--plum)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Comprar agora
      </button>
    </div>
  );
}
