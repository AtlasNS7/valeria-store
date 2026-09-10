"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Banner } from "@/lib/types";

const AUTOPLAY_MS = 6000;

export function PromoBannerCarousel({ banners }: { banners: Banner[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % banners.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[var(--night)]">
      <div className="relative h-[220px] sm:h-[320px] md:h-[420px]">
        {banners.map((banner, i) => (
          <BannerSlide key={banner.id} banner={banner} visible={i === active} />
        ))}
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {banners.map((banner, i) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ir para o banner ${i + 1}`}
              aria-current={i === active}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === active ? "bg-[var(--gold)]" : "bg-[var(--ink-soft)]/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function BannerSlide({ banner, visible }: { banner: Banner; visible: boolean }) {
  const hasText = Boolean(banner.title || banner.subtitle);

  const content = (
    <>
      <Image
        src={banner.image_url}
        alt={banner.title ?? "Banner promocional"}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {hasText && (
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--night)]/80 via-[var(--night)]/10 to-transparent" />
      )}
      {hasText && (
        <div className="absolute inset-x-0 bottom-0 px-5 sm:px-8 pb-6 sm:pb-8 max-w-6xl mx-auto">
          {banner.title && (
            <p className="font-display italic text-2xl sm:text-4xl text-[var(--ink)] mb-1">
              {banner.title}
            </p>
          )}
          {banner.subtitle && (
            <p className="text-sm sm:text-base text-[var(--ink-soft)]">{banner.subtitle}</p>
          )}
        </div>
      )}
    </>
  );

  const className = `absolute inset-0 transition-opacity duration-1000 ease-in-out ${
    visible ? "opacity-100" : "opacity-0 pointer-events-none"
  }`;

  if (banner.link_url) {
    return (
      <a href={banner.link_url} className={className}>
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
