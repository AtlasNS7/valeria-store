import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatBRL, type Product } from "@/lib/types";
import { ToggleActiveButton } from "./ToggleActiveButton";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const items = (products ?? []) as Product[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display italic text-2xl">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="bg-[var(--plum)] text-white font-semibold rounded-full px-5 py-2 text-sm"
        >
          + Novo produto
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-[var(--ink-soft)]">
          Nenhum produto ainda. Clique em &quot;+ Novo produto&quot; pra
          cadastrar o primeiro.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 border border-[var(--line)] rounded-lg p-3"
            >
              <div className="relative w-14 h-14 rounded bg-[var(--line)] overflow-hidden flex-none">
                {p.image_url && (
                  <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{p.name}</p>
                <p className="text-sm text-[var(--ink-soft)]">
                  {formatBRL(p.price_cents)} · estoque: {p.stock}
                  {!p.active && " · inativo"}
                </p>
              </div>
              <ToggleActiveButton productId={p.id} active={p.active} />
              <Link
                href={`/admin/produtos/${p.id}`}
                className="text-sm font-semibold text-[var(--plum)]"
              >
                editar
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
