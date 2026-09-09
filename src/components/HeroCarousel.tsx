"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SLIDES = [
  {
    src: "/gallery/cesta-bebe.jpg",
    alt: "Cesta de presente artesanal com produtos para mamãe e bebê",
    caption: "Kit Cesta Bebê",
  },
  {
    src: "/gallery/cesta-eudora.jpg",
    alt: "Cesta de presente artesanal com perfume Eudora Viva",
    caption: "Cesta Eudora Viva",
  },
  {
    src: "/gallery/perfume-boticario.jpg",
    alt: "Perfume Arbo do Boticário embalado para presente",
    caption: "Perfume Boticário",
  },
] as const;

const AUTOPLAY_MS = 6000;

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-[var(--night)]/65" />

      <p className="absolute top-5 right-5 sm:top-8 sm:right-8 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-soft)]">
        {SLIDES[active].caption}
      </p>

      <button
        type="button"
        onClick={() => setActive((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
        aria-label="Slide anterior"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full border border-[var(--ink-soft)]/40 text-[var(--ink)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => setActive((i) => (i + 1) % SLIDES.length)}
        aria-label="Próximo slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full border border-[var(--ink-soft)]/40 text-[var(--ink)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
      >
        ›
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Ir para o slide ${slide.caption}`}
            aria-current={i === active}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === active ? "bg-[var(--gold)]" : "bg-[var(--ink-soft)]/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
