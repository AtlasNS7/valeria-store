# Valéria Gift & Essence — loja online

Site próprio da loja: catálogo, carrinho, checkout com Pix/cartão via
**InfinitePay** e um painel simples para a Valéria cadastrar produtos e
acompanhar pedidos, sem mexer em código.

## Como é feito

- **Next.js 16** (React) + Tailwind CSS — o site em si.
- **Supabase** — banco de dados (produtos e pedidos), login do painel
  admin e armazenamento das fotos dos produtos. Tem plano gratuito
  generoso, suficiente pra esse tamanho de loja.
- **InfinitePay (Checkout Integrado)** — gera o link de pagamento
  (Pix/cartão) e avisa o site quando um pedido é pago.
- **Vercel** — hospedagem (o pedido foi testar aqui primeiro; dá pra
  apontar um domínio da Hostinger pra cá depois, ver seção final).

## 1. Criar o projeto no Supabase

1. Crie uma conta em [supabase.com](https://supabase.com) e um novo projeto.
2. Vá em **SQL Editor** → cole o conteúdo de `supabase/schema.sql` → **Run**.
   Isso cria as tabelas `products` e `orders`, as regras de segurança, e o
   bucket de imagens `product-images`.
3. Vá em **Authentication → Users → Add user** e crie o login da Valéria
   (e-mail + senha). É esse login que dá acesso ao painel `/admin`.
4. Vá em **Settings → API** e copie:
   - `Project URL` → vai virar `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → vira `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → vira `SUPABASE_SERVICE_ROLE_KEY` (**nunca**
     exponha essa chave no navegador — ela só é usada no servidor)

## 2. Criar a conta InfinitePay

1. Crie a conta em [infinitepay.io](https://www.infinitepay.io) (CNPJ ou
   MEI) e pegue o seu **handle** (o `@seunome` do InfiniteTag, sem o `$`).
2. Isso vira `INFINITEPAY_HANDLE` no `.env`.
3. A documentação do checkout está em
   [infinitepay.io/checkout-documentacao](https://www.infinitepay.io/checkout-documentacao)
   — o formato exato da resposta da API e do webhook pode variar um pouco;
   se algo não bater, ajuste `src/lib/infinitepay.ts` (está comentado
   explicando onde) e `src/app/api/webhook/infinitepay/route.ts` conforme
   o retorno real que aparecer nos logs.

## 3. Configurar as variáveis de ambiente

Copie o arquivo de exemplo e preencha com os valores dos passos acima:

```bash
cp .env.local.example .env.local
```

## 4. Rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000` (loja) e `http://localhost:3000/admin/login`
(painel — entre com o e-mail/senha criados no passo 1.3).

## 5. Publicar no Vercel (teste)

1. Suba este projeto pro GitHub (`git init` já foi feito automaticamente;
   crie um repositório vazio no GitHub e siga o `git remote add origin ...`).
2. Em [vercel.com](https://vercel.com), importe o repositório.
3. Em **Environment Variables**, adicione as mesmas variáveis do seu
   `.env.local` (troque `NEXT_PUBLIC_SITE_URL` pela URL que a Vercel vai
   te dar, tipo `https://valeria-store.vercel.app`).
4. Deploy. Pronto, o site já fica no ar nesse link de teste.

## 6. Colocar no domínio da Hostinger (quando estiver validado)

Duas opções, sem precisar mudar nada no código:

- **Migrar o domínio pra apontar pro Vercel** (mais simples): na
  Hostinger, edite o DNS do domínio e aponte um registro `A`/`CNAME` para
  o Vercel, seguindo as instruções que aparecem em **Vercel → seu projeto
  → Settings → Domains** ao adicionar o domínio lá.
- **Manter tudo na Hostinger**: se a Hostinger tiver um plano com Node.js,
  dá pra rodar `npm run build && npm start` lá direto — mas isso exige
  mais manutenção manual (deploy, reiniciar processo). Pra maioria dos
  casos, a primeira opção é mais simples de manter sozinho.

## Como a Valéria usa o painel (`/admin`)

- **Produtos**: adicionar foto, nome, descrição, preço e estoque. Dá pra
  ocultar um produto sem apagar (botão "Publicado/Oculto").
- **Pedidos**: mostra nome, telefone, endereço, itens e se já foi pago.
  A confirmação de pagamento é automática (via webhook da InfinitePay).

## O que falta pra produção "de verdade"

- [ ] Confirmar o formato exato da resposta da API InfinitePay e do
      payload do webhook com uma conta real (ver comentários em
      `src/lib/infinitepay.ts` e `src/app/api/webhook/infinitepay/route.ts`).
- [ ] Enviar uma notificação (WhatsApp/e-mail) pra Valéria quando um
      pedido novo é pago — hoje ela precisa checar `/admin/pedidos`.
- [ ] Botão no painel para marcar pedido como "enviado" e (se quiser)
      chamar a API do Lalamove/Uber Direct automaticamente.
- [ ] Política de troca/devolução e termos de uso, se for vender pra
      valer.
