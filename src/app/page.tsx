import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  const items = (products ?? []) as Product[];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8 max-w-xl">
        <p className="text-xs uppercase tracking-wider font-semibold text-[var(--plum)] mb-2">
          Presentes & perfumaria artesanal
        </p>
        <h1 className="font-display italic text-3xl text-[var(--ink)] mb-2">
          Feito à mão, com carinho
        </h1>
        <p className="text-[var(--ink-soft)]">
          Cada perfume e presente é criado pela Valéria. Escolha o seu abaixo
          e receba em casa.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-[var(--ink-soft)]">
          Nenhum produto cadastrado ainda. Assim que a Valéria adicionar
          produtos no painel administrativo, eles aparecem aqui.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
