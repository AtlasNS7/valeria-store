import { whatsappLink } from "@/lib/site";
import { LogoMark } from "@/components/LogoMark";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--line)] bg-[var(--paper-raised)]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start">
          <LogoMark className="h-7 w-7 shrink-0 text-[var(--gold)]" />
          <div>
            <p className="font-display italic text-lg text-[var(--plum-dark)]">
              Valéria Gift &amp; Essence
            </p>
            <p className="text-sm text-[var(--ink-soft)]">
              Presentes e perfumaria artesanal, feitos à mão.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-[var(--ink)] border border-[var(--line)] rounded-full px-5 py-2 hover:border-[var(--plum)] hover:text-[var(--plum)] transition-colors"
          >
            WhatsApp
          </a>
          <a
            href="https://www.instagram.com/valeria.perfumariastm/"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-[var(--ink)] border border-[var(--line)] rounded-full px-5 py-2 hover:border-[var(--plum)] hover:text-[var(--plum)] transition-colors"
          >
            @valeria.perfumariastm
          </a>
        </div>
      </div>
    </footer>
  );
}
