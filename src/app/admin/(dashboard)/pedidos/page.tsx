import { createClient } from "@/lib/supabase/server";
import { formatBRL, type Order } from "@/lib/types";
import { OrderStatusBadge } from "./OrderStatusBadge";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const items = (orders ?? []) as Order[];

  return (
    <div>
      <h1 className="font-display italic text-2xl mb-6">Pedidos</h1>

      {items.length === 0 ? (
        <p className="text-[var(--ink-soft)]">Nenhum pedido ainda.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((order) => (
            <div key={order.id} className="border border-[var(--line)] rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-semibold">{order.customer_name}</p>
                  <p className="text-sm text-[var(--ink-soft)]">{order.customer_phone}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="text-sm text-[var(--ink-soft)] mb-2">{order.customer_address}</p>
              <ul className="text-sm mb-2">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.qty}x {item.name} — {formatBRL(item.price_cents * item.qty)}
                  </li>
                ))}
              </ul>
              <p className="text-sm font-semibold">
                Total: {formatBRL(order.total_cents)}
              </p>
              <p className="text-xs text-[var(--ink-soft)] mt-1">
                {new Date(order.created_at).toLocaleString("pt-BR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
