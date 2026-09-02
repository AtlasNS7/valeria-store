import Link from "next/link";

export default function OrderErrorPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <h1 className="font-display italic text-3xl mb-3">
        Algo deu errado no pagamento
      </h1>
      <p className="text-[var(--ink-soft)] mb-6">
        Não conseguimos confirmar o pagamento. Nada foi cobrado indevidamente
        — tente novamente ou fale com a gente pelo WhatsApp.
      </p>
      <Link
        href="/"
        className="inline-block bg-[var(--plum)] text-white font-semibold rounded-full px-6 py-2.5"
      >
        Voltar para a loja
      </Link>
    </div>
  );
}
