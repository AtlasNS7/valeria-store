import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="flex items-center justify-between mb-8 border-b border-[var(--line)] pb-4">
        <div className="flex gap-5 text-sm font-semibold">
          <Link href="/admin" className="hover:text-[var(--plum)]">Produtos</Link>
          <Link href="/admin/pedidos" className="hover:text-[var(--plum)]">Pedidos</Link>
          <Link href="/" className="hover:text-[var(--plum)]">Ver loja</Link>
        </div>
        <LogoutButton />
      </nav>
      {children}
    </div>
  );
}
