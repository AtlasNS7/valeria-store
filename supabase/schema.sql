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

-- 5) Estoque: baixa e reposição atômicas
-- Evita que dois pedidos simultâneos vendam a última unidade do mesmo
-- produto (checkout confere e decrementa estoque em uma única transação,
-- então uma corrida entre dois pedidos nunca deixa o estoque negativo).
create or replace function decrement_stock(items jsonb)
returns void
language plpgsql
as $$
declare
  item jsonb;
  updated_rows int;
  product_name text;
begin
  for item in select * from jsonb_array_elements(items)
  loop
    update products
      set stock = stock - (item->>'qty')::int,
          updated_at = now()
      where id = (item->>'product_id')::uuid
        and active = true
        and stock >= (item->>'qty')::int;

    get diagnostics updated_rows = row_count;

    if updated_rows = 0 then
      select name into product_name from products where id = (item->>'product_id')::uuid;
      raise exception 'Estoque insuficiente para "%"', coalesce(product_name, item->>'product_id');
    end if;
  end loop;
end;
$$;

-- Repõe estoque quando um pedido não segue adiante (falha ao criar o
-- registro do pedido, ou pagamento cancelado/recusado depois de reservado).
create or replace function restore_stock(items jsonb)
returns void
language plpgsql
as $$
declare
  item jsonb;
begin
  for item in select * from jsonb_array_elements(items)
  loop
    update products
      set stock = stock + (item->>'qty')::int,
          updated_at = now()
      where id = (item->>'product_id')::uuid;
  end loop;
end;
$$;

grant execute on function decrement_stock(jsonb) to service_role;
grant execute on function restore_stock(jsonb) to service_role;

-- 6) Ocasiões/público — tags livres pra filtrar produtos na loja
-- (ex: "Para ela", "Aniversário", "Namorados"). Lista fixa em src/lib/types.ts.
alter table products add column if not exists occasions text[] not null default '{}';

-- 7) Depoimentos — a Valéria cadastra pelo painel /admin/depoimentos;
-- só os marcados como ativos aparecem na loja.
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  quote text not null,
  active boolean default true,
  created_at timestamptz default now()
);

alter table testimonials enable row level security;

create policy "depoimentos ativos são públicos"
  on testimonials for select
  using (active = true);

create policy "admin gerencia depoimentos"
  on testimonials for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
