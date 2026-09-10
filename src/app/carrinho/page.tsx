"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatBRL } from "@/lib/types";

export default function CartPage() {
  const { items, setQty, removeItem, totalCents, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; discountPercent: number } | null>(
    null,
  );
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const discountCents = coupon ? Math.round((totalCents * coupon.discountPercent) / 100) : 0;
  const finalTotalCents = totalCents - discountCents;

  async function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    setCouponError(null);
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Digita o código do cupom.");
      return;
    }

    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Cupom inválido.");
      setCoupon({ code, discountPercent: data.discount_percent });
    } catch (err) {
      setCoupon(null);
      setCouponError(err instanceof Error ? err.message : "Cupom inválido.");
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponInput("");
    setCouponError(null);
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError("Preenche nome, telefone e endereço pra continuar.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          customer_address: address,
          items,
          coupon_code: coupon?.code,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha ao iniciar pagamento");

      clear();
      window.location.href = data.payment_url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não deu pra iniciar o pagamento. Tenta de novo.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="font-display italic text-2xl mb-2">Seu carrinho está vazio</h1>
        <p className="text-[var(--ink-soft)]">
          Volte para a loja e escolha algo especial.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display italic text-2xl mb-6">Seu carrinho</h1>

      <div className="flex flex-col gap-3 mb-8">
        {items.map((item) => (
          <div
            key={item.product_id}
            className="flex items-center gap-3 border border-[var(--line)] bg-[var(--paper-raised)] rounded-lg p-3"
          >
            <div className="relative w-16 h-16 rounded bg-[var(--line)] overflow-hidden flex-none">
              {item.image_url && (
                <Image src={item.image_url} alt={item.name} fill className="object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{item.name}</p>
              <p className="text-sm text-[var(--ink-soft)]">{formatBRL(item.price_cents)}</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.qty}
              onChange={(e) => setQty(item.product_id, Number(e.target.value))}
              className="w-14 border border-[var(--line)] rounded px-2 py-1 text-center"
            />
            <button
              onClick={() => removeItem(item.product_id)}
              className="text-sm text-[var(--ink-soft)] hover:text-[var(--plum)]"
            >
              remover
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--line)] pt-4 mb-8">
        <form onSubmit={handleApplyCoupon} className="flex flex-col gap-2 mb-4">
          {coupon ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-[var(--ink)]">
                Cupom <span className="font-semibold">{coupon.code}</span> aplicado
                (-{coupon.discountPercent}%)
              </p>
              <button
                type="button"
                onClick={removeCoupon}
                className="text-sm text-[var(--ink-soft)] hover:text-[var(--plum)]"
              >
                remover
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Código do cupom"
                className="flex-1 border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--paper)]"
              />
              <button
                type="submit"
                disabled={couponLoading}
                className="text-sm font-semibold text-[var(--ink)] border border-[var(--line)] rounded-lg px-4 py-2 hover:border-[var(--plum)] hover:text-[var(--plum)] transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {couponLoading ? "Aplicando..." : "Aplicar"}
              </button>
            </div>
          )}
          {couponError && <p className="text-sm text-red-700">{couponError}</p>}
        </form>

        {coupon && (
          <div className="flex justify-between items-center text-sm text-[var(--ink-soft)] mb-1">
            <span>Subtotal</span>
            <span>{formatBRL(totalCents)}</span>
          </div>
        )}
        {coupon && (
          <div className="flex justify-between items-center text-sm text-[var(--ink-soft)] mb-1">
            <span>Desconto</span>
            <span>-{formatBRL(discountCents)}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="font-semibold">Total</span>
          <span className="font-display italic text-xl text-[var(--plum-dark)]">
            {formatBRL(finalTotalCents)}
          </span>
        </div>
      </div>

      <form onSubmit={handleCheckout} className="flex flex-col gap-4">
        <h2 className="font-display italic text-lg">Dados para entrega</h2>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="name">Nome completo</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--paper)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="phone">WhatsApp / telefone</label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(11) 91234-5678"
            className="border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--paper)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold" htmlFor="address">
            Endereço completo de entrega
          </label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="Rua, número, bairro, cidade, complemento"
            className="border border-[var(--line)] rounded-lg px-3 py-2 bg-[var(--paper)]"
          />
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--plum)] text-[var(--night)] font-semibold rounded-full px-6 py-3 hover:bg-[var(--plum-dark)] transition-colors disabled:opacity-50"
        >
          {loading ? "Preparando pagamento..." : "Ir para o pagamento (Pix / cartão)"}
        </button>
        <p className="text-xs text-[var(--ink-soft)] text-center">
          Você será redirecionado para a página segura de pagamento da InfinitePay.
        </p>
      </form>
    </div>
  );
}
