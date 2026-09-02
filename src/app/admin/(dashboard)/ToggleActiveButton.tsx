"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ToggleActiveButton({
  productId,
  active,
}: {
  productId: string;
  active: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const supabase = createClient();
        await supabase
          .from("products")
          .update({ active: !active })
          .eq("id", productId);
        setLoading(false);
        router.refresh();
      }}
      className="text-xs font-semibold border border-[var(--line)] rounded-full px-3 py-1.5 hover:border-[var(--plum)] disabled:opacity-50"
    >
      {active ? "Publicado" : "Oculto"}
    </button>
  );
}
