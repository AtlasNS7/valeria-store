import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente com a service_role key — ignora RLS.
// USO EXCLUSIVO em código de servidor de confiança (route handlers como o
// webhook do InfinityPay), nunca em código que roda no navegador.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
