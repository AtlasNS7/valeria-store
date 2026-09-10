"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Banner } from "@/lib/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function BannerManager({ initial }: { initial: Banner[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const path = `${Date.now()}-${slugify(file.name)}`;
      const { error: uploadError } = await supabase.storage
        .from("banner-images")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("banner-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
    } catch {
      setError("Não deu pra enviar a imagem. Tenta uma imagem menor (JPG/PNG).");
    } finally {
      setUploading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!imageUrl) {
      setError("Envia a imagem do banner antes de salvar.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const nextSortOrder =
      initial.length > 0 ? Math.max(...initial.map((b) => b.sort_order)) + 1 : 0;
    const { error: saveError } = await supabase.from("banners").insert({
      image_url: imageUrl,
      title: title.trim() || null,
      subtitle: subtitle.trim() || null,
      link_url: linkUrl.trim() || null,
      active: true,
      sort_order: nextSortOrder,
    });
    setSaving(false);

    if (saveError) {
      setError("Não consegui salvar o banner. Tenta de novo.");
      return;
    }

    setTitle("");
    setSubtitle("");
    setLinkUrl("");
    setImageUrl("");
    router.refresh();
  }

  async function handleToggle(id: string, active: boolean) {
    setBusyId(id);
    const supabase = createClient();
    await supabase.from("banners").update({ active: !active }).eq("id", id);
    setBusyId(null);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Apagar este banner?")) return;
    setBusyId(id);
    const supabase = createClient();
    await supabase.from("banners").delete().eq("id", id);
    setBusyId(null);
    router.refresh();
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= initial.length) return;

    const current = initial[index];
    const target = initial[targetIndex];

    setBusyId(current.id);
    const supabase = createClient();
    await Promise.all([
      supabase.from("banners").update({ sort_order: target.sort_order }).eq("id", current.id),
      supabase.from("banners").update({ sort_order: current.sort_order }).eq("id", target.id),
    ]);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleAdd} className="flex flex-col gap-4 max-w-lg">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold" htmlFor="banner-image">
            Imagem do banner
          </label>
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              className="w-full max-w-sm rounded-lg border border-[var(--line)] object-cover"
            />
          )}
          <input id="banner-image" type="file" accept="image/*" onChange={handleImageChange} />
          {uploading && <p className="text-sm text-[var(--ink-soft)]">Enviando imagem...</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="banner-title">
            Título (opcional)
          </label>
          <input
            id="banner-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Semana da Beleza"
            className="border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--paper)]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="banner-subtitle">
            Subtítulo (opcional)
          </label>
          <input
            id="banner-subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Ex: Até 30% off em perfumaria selecionada"
            className="border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--paper)]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="banner-link">
            Link (opcional)
          </label>
          <input
            id="banner-link"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Ex: /produto/perfume-x ou #colecao"
            className="border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--paper)]"
          />
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={saving || uploading}
          className="self-start bg-[var(--plum)] text-[var(--night)] font-semibold rounded-full px-6 py-2.5 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "+ Adicionar banner"}
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {initial.length === 0 ? (
          <p className="text-[var(--ink-soft)]">
            Nenhum banner cadastrado ainda. Assim que adicionar um, ele aparece
            no topo da home.
          </p>
        ) : (
          initial.map((banner, index) => (
            <div
              key={banner.id}
              className="flex items-center gap-4 border border-[var(--line)] rounded-lg p-3"
            >
              <div className="relative w-20 h-12 rounded bg-[var(--line)] overflow-hidden flex-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">
                  {banner.title || "(sem título)"}
                </p>
                {banner.subtitle && (
                  <p className="text-sm text-[var(--ink-soft)] truncate">{banner.subtitle}</p>
                )}
              </div>
              <div className="flex flex-col">
                <button
                  disabled={busyId === banner.id || index === 0}
                  onClick={() => handleMove(index, -1)}
                  className="text-xs text-[var(--ink-soft)] hover:text-[var(--plum)] disabled:opacity-30"
                  aria-label="Mover pra cima"
                >
                  ▲
                </button>
                <button
                  disabled={busyId === banner.id || index === initial.length - 1}
                  onClick={() => handleMove(index, 1)}
                  className="text-xs text-[var(--ink-soft)] hover:text-[var(--plum)] disabled:opacity-30"
                  aria-label="Mover pra baixo"
                >
                  ▼
                </button>
              </div>
              <button
                disabled={busyId === banner.id}
                onClick={() => handleToggle(banner.id, banner.active)}
                className="text-xs font-semibold border border-[var(--line)] rounded-full px-3 py-1.5 hover:border-[var(--plum)] disabled:opacity-50 whitespace-nowrap"
              >
                {banner.active ? "Visível" : "Oculto"}
              </button>
              <button
                disabled={busyId === banner.id}
                onClick={() => handleDelete(banner.id)}
                className="text-xs font-semibold text-red-700 disabled:opacity-50"
              >
                apagar
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
