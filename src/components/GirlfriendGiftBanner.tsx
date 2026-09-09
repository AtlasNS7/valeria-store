import Link from "next/link";

export function GirlfriendGiftBanner() {
  return (
    <section className="bg-[var(--plum)] text-[var(--night)]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 sm:py-7 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p className="font-display italic text-lg sm:text-xl text-balance">
          Presente pra namorada e não sabe por onde começar?
        </p>
        <Link
          href="/presente-para-namorada"
          className="inline-flex items-center gap-2 bg-[var(--night)] text-[var(--gold)] font-semibold rounded-full px-6 py-2.5 hover:bg-[var(--plum-dark)] hover:text-[var(--night)] transition-colors whitespace-nowrap"
        >
          Achar o presente certo
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
