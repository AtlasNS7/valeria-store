export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--line)] bg-[var(--paper-raised)]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <p className="font-display italic text-lg text-[var(--plum-dark)]">
            Valéria Gift &amp; Essence
          </p>
          <p className="text-sm text-[var(--ink-soft)]">
            Presentes e perfumaria artesanal, feitos à mão.
          </p>
        </div>
        <a
          href="https://www.instagram.com/valeria.perfumariastm/"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-[var(--ink)] border border-[var(--line)] rounded-full px-5 py-2 hover:border-[var(--plum)] hover:text-[var(--plum)] transition-colors"
        >
          @valeria.perfumariastm
        </a>
      </div>
    </footer>
  );
}
