export default async function OrderSuccessPage(
  props: PageProps<"/pedido/sucesso">,
) {
  const params = await props.searchParams;
  const orderId = typeof params.order === "string" ? params.order : null;

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <h1 className="font-display italic text-3xl mb-3">Pedido recebido! 🎁</h1>
      <p className="text-[var(--ink-soft)] mb-2">
        Assim que o pagamento for confirmado, a Valéria já começa a preparar o
        seu pedido com carinho.
      </p>
      {orderId && (
        <p className="text-sm text-[var(--ink-soft)]">
          Número do pedido: <span className="font-mono">{orderId}</span>
        </p>
      )}
    </div>
  );
}
