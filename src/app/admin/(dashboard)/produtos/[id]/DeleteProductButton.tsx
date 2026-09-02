"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm text-[var(--ink-soft)] hover:text-red-700"
      >
        excluir produto
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span>Tem certeza?</span>
      <button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          const supabase = createClient();
          await supabase.from("products").delete().eq("id", productId);
          router.push("/admin");
          router.refresh();
        }}
        className="font-semibold text-red-700"
      >
        {loading ? "Excluindo..." : "sim, excluir"}
      </button>
      <button onClick={() => setConfirming(false)} className="text-[var(--ink-soft)]">
        cancelar
      </button>
    </div>
  );
}
