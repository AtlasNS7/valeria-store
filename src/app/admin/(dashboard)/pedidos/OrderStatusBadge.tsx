const LABELS: Record<string, { text: string; className: string }> = {
  paid: { text: "Pago", className: "bg-green-100 text-green-800" },
  pending: { text: "Aguardando pagamento", className: "bg-amber-100 text-amber-800" },
  canceled: { text: "Cancelado", className: "bg-red-100 text-red-800" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const info = LABELS[status] ?? { text: status, className: "bg-gray-100 text-gray-800" };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${info.className}`}>
      {info.text}
    </span>
  );
}
