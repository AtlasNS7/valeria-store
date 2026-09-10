export type ProductLine = "kit_personalizado" | "revenda";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  category: string;
  occasions: string[];
  image_url: string | null;
  stock: number;
  active: boolean;
  product_line: ProductLine;
  created_at: string;
  updated_at: string;
};

// Prioridade das linhas de produto nas listagens: kits personalizados
// sempre aparecem antes dos produtos de revenda. Dentro de cada grupo a
// ordenação passada pra cá (created_at, nome, etc) é preservada.
const PRODUCT_LINE_WEIGHT: Record<ProductLine, number> = {
  kit_personalizado: 0,
  revenda: 1,
};

export function sortByProductLine<T extends { product_line?: string | null }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => {
    const weightA = PRODUCT_LINE_WEIGHT[a.product_line as ProductLine] ?? 1;
    const weightB = PRODUCT_LINE_WEIGHT[b.product_line as ProductLine] ?? 1;
    return weightA - weightB;
  });
}

// Lista fixa de ocasiões/públicos pra marcar produtos e filtrar na loja.
export const OCCASION_OPTIONS = [
  "Para ela",
  "Para ele",
  "Aniversário",
  "Namorados",
  "Dia das Mães",
  "Amigo secreto",
] as const;

export type Testimonial = {
  id: string;
  author_name: string;
  quote: string;
  active: boolean;
  created_at: string;
};

export type CartItem = {
  product_id: string;
  slug: string;
  name: string;
  price_cents: number;
  image_url: string | null;
  qty: number;
};

export type OrderItem = {
  product_id: string;
  name: string;
  price_cents: number;
  qty: number;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: OrderItem[];
  total_cents: number;
  status: "pending" | "paid" | "canceled";
  infinitepay_link: string | null;
  infinitepay_order_nsu: string | null;
  created_at: string;
  updated_at: string;
};

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
