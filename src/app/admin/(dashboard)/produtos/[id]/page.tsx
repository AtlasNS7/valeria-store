import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import { ProductForm } from "../ProductForm";
import { DeleteProductButton } from "./DeleteProductButton";

export default async function EditProductPage(
  props: PageProps<"/admin/produtos/[id]">,
) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display italic text-2xl">Editar produto</h1>
        <DeleteProductButton productId={id} />
      </div>
      <ProductForm product={product as Product} />
    </div>
  );
}
