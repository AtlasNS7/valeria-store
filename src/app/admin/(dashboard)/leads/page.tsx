import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Lead } from "@/lib/types";

// A tabela `leads` não tem policy de SELECT pra ninguém (nem authenticated)
// — só INSERT pra anon (ver supabase/schema.sql). Por isso essa página
// precisa da service_role key pra listar, em vez do cliente normal que as
// outras páginas do admin usam (RLS bloquearia a leitura mesmo logado).
// Como a service_role ignora RLS, essa página confere a sessão ela mesma
// antes de usá-la — as outras páginas do admin dependem só da RLS pra isso,
// o que não protegeria nada aqui.
export default async function AdminLeadsPage() {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }

  const supabase = createAdminClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const items = (leads ?? []) as Lead[];
  // Server Component renderizado uma vez por request (não é um componente
  // client reativo) — Date.now() aqui é só pra marcar cupons expirados na
  // lista, sem risco de resultado instável entre re-renders.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  return (
    <div>
      <h1 className="font-display italic text-2xl mb-6">Leads</h1>

      {items.length === 0 ? (
        <p className="text-[var(--ink-soft)]">
          Nenhum lead capturado ainda. Eles aparecem aqui assim que alguém
          preencher o popup de cupom na home.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((lead) => {
            const expired = new Date(lead.expires_at).getTime() < now;
            return (
              <div
                key={lead.id}
                className="flex items-center gap-4 border border-[var(--line)] rounded-lg p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{lead.name}</p>
                  <p className="text-sm text-[var(--ink-soft)]">{lead.whatsapp}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">
                    {lead.coupon_code} (-{lead.discount_percent}%)
                  </p>
                  <p className="text-xs text-[var(--ink-soft)]">
                    {lead.used
                      ? `usado em ${new Date(lead.used_at!).toLocaleString("pt-BR")}`
                      : expired
                        ? "expirado"
                        : "disponível"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
