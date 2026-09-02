-- Schema para a loja Valéria Gift & Essence
-- Rode isto no SQL Editor do seu projeto Supabase (supabase.com -> seu projeto -> SQL Editor)

-- 1) Tabela de produtos
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text default '',
  price_cents integer not null,        -- preço em centavos (ex: 8990 = R$ 89,90)
  category text default 'geral',
  image_url text,
  stock integer default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) Tabela de pedidos
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  items jsonb not null,                -- [{product_id, name, price_cents, qty}]
  total_cents integer not null,
  status text not null default 'pending', -- pending | paid | canceled
  infinitepay_link text,
  infinitepay_order_nsu text,          -- identificador que a InfinitePay manda no webhook
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3) Row Level Security
alter table products enable row level security;
alter table orders enable row level security;

-- Qualquer pessoa (site público) pode LER produtos ativos
create policy "produtos ativos são públicos"
  on products for select
  using (active = true);

-- Só usuário autenticado (admin = a Valéria logada) pode criar/editar/apagar produtos
create policy "admin gerencia produtos"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Qualquer pessoa pode CRIAR um pedido (checkout), mas não pode ler pedidos de outros
create policy "qualquer um pode criar pedido"
  on orders for insert
  with check (true);

-- Só admin autenticado pode ver/gerenciar pedidos
create policy "admin ve pedidos"
  on orders for select
  using (auth.role() = 'authenticated');

create policy "admin atualiza pedidos"
  on orders for update
  using (auth.role() = 'authenticated');

-- 4) Bucket de imagens dos produtos (rode isto ou crie pelo painel Storage do Supabase)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "imagens de produto são públicas para leitura"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "admin autenticado pode subir imagens"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "admin autenticado pode apagar imagens"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');
