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

// Categoria dos kits prontos de revenda (ex: "Kit Presente Dia das Mães
// Floratta Red"), que aparecem antes do resto da revenda na listagem.
const RESALE_GIFT_KIT_CATEGORY = "kit-presente";

// Prioridade das listagens de produto:
// 1. product_line = kit_personalizado (produção própria/artesanal da Valéria)
// 2. dentro de revenda: category = "kit-presente" (kits prontos de revenda)
// 3. resto da revenda
// Dentro de cada grupo, a ordenação passada pra cá (created_at, nome, etc)
// é preservada — o sort é estável.
function productRank(item: { product_line?: string | null; category?: string | null }): number {
  if ((item.product_line as ProductLine) === "kit_personalizado") return 0;
  return item.category === RESALE_GIFT_KIT_CATEGORY ? 1 : 2;
}

export function sortByProductLine<
  T extends { product_line?: string | null; category?: string | null },
>(items: T[]): T[] {
  return [...items].sort((a, b) => productRank(a) - productRank(b));
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
  coupon_code: string | null;
  discount_cents: number;
  created_at: string;
  updated_at: string;
};

// Lead capturado pelo popup da home, com o cupom de desconto de uso único
// gerado pra ele. Ver supabase/schema.sql — tabela sem policy de leitura
// pra anon, então toda leitura/escrita além do INSERT inicial passa pela
// service_role key (rotas server-side).
export type Lead = {
  id: string;
  name: string;
  whatsapp: string;
  email: string | null;
  coupon_code: string;
  discount_percent: number;
  used: boolean;
  used_at: string | null;
  expires_at: string;
  created_at: string;
};

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
