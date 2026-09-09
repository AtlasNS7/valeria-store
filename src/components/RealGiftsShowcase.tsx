import Image from "next/image";

const GIFTS = [
  { src: "/gallery/cesta-bebe.jpg", alt: "Cesta de presente com produtos para mamãe e bebê" },
  { src: "/gallery/cesta-eudora.jpg", alt: "Cesta de presente com perfume Eudora Viva" },
  { src: "/gallery/perfume-boticario.jpg", alt: "Perfume Arbo do Boticário" },
];

export function RealGiftsShowcase() {
  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
      <p className="text-xs uppercase tracking-[0.3em] font-semibold text-[var(--gold)] mb-3">
        Presentes de verdade, feitos aqui
      </p>
      <h2 className="font-display italic text-2xl sm:text-3xl text-[var(--ink)] mb-8">
        Alguns que já saíram daqui
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {GIFTS.map((gift) => (
          <div
            key={gift.src}
            className="aspect-[3/4] overflow-hidden rounded-[var(--radius)] border border-[var(--line)]"
          >
            <Image
              src={gift.src}
              alt={gift.alt}
              width={480}
              height={640}
              className="rounded-[var(--radius)] object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
