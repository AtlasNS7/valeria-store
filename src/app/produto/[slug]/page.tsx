import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatBRL, type Product } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";
import { whatsappLink } from "@/lib/site";

export default async function ProductPage(props: PageProps<"/produto/[slug]">) {
  const { slug } = await props.params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (!product) notFound();
  const p = product as Product;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
      <div className="relative aspect-square bg-[var(--line)] rounded-lg overflow-hidden">
        {p.image_url ? (
          <Image src={p.image_url} alt={p.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--ink-soft)]">
            sem foto
          </div>
        )}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider font-semibold text-[var(--plum)] mb-2">
          {p.category}
        </p>
        <h1 className="font-display italic text-3xl mb-3">{p.name}</h1>
        <p className="text-2xl font-semibold text-[var(--plum-dark)] mb-4">
          {formatBRL(p.price_cents)}
        </p>
        <p className="text-[var(--ink-soft)] whitespace-pre-line mb-6">
          {p.description}
        </p>

        {p.occasions?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {p.occasions.map((o) => (
              <span
                key={o}
                className="text-xs font-semibold rounded-full border border-[var(--line)] text-[var(--ink-soft)] px-3 py-1"
              >
                {o}
              </span>
            ))}
          </div>
        )}

        <AddToCartButton product={p} />
        {p.stock <= 0 && (
          <p className="text-sm text-red-700 mt-3">
            Produto sem estoque no momento — fale com a gente pelo WhatsApp.
          </p>
        )}

        <ul className="text-sm text-[var(--ink-soft)] flex flex-col gap-1.5 mt-6 pt-6 border-t border-[var(--line)]">
          <li>🎀 Já vem embalado para presente</li>
          <li>
            ✒️ Quer personalizar (mensagem, combinação, ocasião)?{" "}
            <a
              href={whatsappLink(`Olá! Quero personalizar o presente "${p.name}"`)}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[var(--plum)] hover:underline"
            >
              Fala com a gente no WhatsApp
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
