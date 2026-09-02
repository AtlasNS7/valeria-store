"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEditing = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(
    product ? (product.price_cents / 100).toFixed(2) : "",
  );
  const [category, setCategory] = useState(product?.category ?? "perfumes");
  const [stock, setStock] = useState(String(product?.stock ?? 1));
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const path = `${Date.now()}-${slugify(file.name)}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
    } catch {
      setError("Não deu pra enviar a foto. Tenta uma imagem menor (JPG/PNG).");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const priceCents = Math.round(parseFloat(price.replace(",", ".")) * 100);
    if (!name.trim() || Number.isNaN(priceCents) || priceCents <= 0) {
      setError("Preenche pelo menos o nome e um preço válido.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const payload = {
      name: name.trim(),
      slug: product?.slug ?? (slugify(name) || `produto-${Date.now()}`),
      description: description.trim(),
      price_cents: priceCents,
      category: category.trim() || "geral",
      stock: Math.max(0, parseInt(stock, 10) || 0),
      image_url: imageUrl || null,
      updated_at: new Date().toISOString(),
    };

    const { error: saveError } = isEditing
      ? await supabase.from("products").update(payload).eq("id", product!.id)
      : await supabase.from("products").insert({ ...payload, active: true });

    setSaving(false);
    if (saveError) {
      setError("Não consegui salvar. Confere se o nome já não existe e tenta de novo.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold" htmlFor="name">Nome do produto</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--paper)]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold" htmlFor="description">Descrição</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--paper)]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="price">Preço (R$)</label>
          <input
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="89,90"
            className="border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--paper)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="stock">Estoque</label>
          <input
            id="stock"
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--paper)]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold" htmlFor="category">Categoria</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--paper)]"
        >
          <option value="perfumes">Perfumes</option>
          <option value="presentes">Presentes</option>
          <option value="kits">Kits</option>
          <option value="geral">Geral</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold" htmlFor="image">Foto do produto</label>
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="w-28 h-28 object-cover rounded-lg border border-[var(--line)]" />
        )}
        <input id="image" type="file" accept="image/*" onChange={handleImageChange} />
        {uploading && <p className="text-sm text-[var(--ink-soft)]">Enviando foto...</p>}
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={saving || uploading}
        className="bg-[var(--plum)] text-white font-semibold rounded-full px-6 py-2.5 disabled:opacity-50"
      >
        {saving ? "Salvando..." : isEditing ? "Salvar alterações" : "Cadastrar produto"}
      </button>
    </form>
  );
}
