import { createClient } from "@/lib/supabase/server";
import type { Banner } from "@/lib/types";
import { BannerManager } from "./BannerManager";

export default async function AdminBannersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  const items = (data ?? []) as Banner[];

  return (
    <div>
      <h1 className="font-display italic text-2xl mb-2">Banners</h1>
      <p className="text-sm text-[var(--ink-soft)] mb-6">
        O banner promocional aparece no topo da home. Com mais de um ativo,
        eles trocam automaticamente em carrossel — use as setas pra definir a
        ordem.
      </p>
      <BannerManager initial={items} />
    </div>
  );
}
