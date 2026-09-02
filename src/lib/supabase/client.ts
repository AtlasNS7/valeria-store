import { createBrowserClient } from "@supabase/ssr";

// Cliente Supabase para uso no navegador (componentes "use client").
// Usa a chave pública (anon key) — segura para expor no front-end,
// porque as regras de segurança (RLS) definidas em supabase/schema.sql
// controlam o que cada tipo de usuário pode ler ou escrever.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
