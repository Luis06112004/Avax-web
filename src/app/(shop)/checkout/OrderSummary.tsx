"use client";

import { ShieldCheck } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { SneakerPlaceholder } from "@/components/ui/SneakerPlaceholder";
import { formatPrice } from "@/lib/utils";

type Props = {
  showShipping?: boolean;
  totalLabel?: string;
};

export function OrderSummary({
  showShipping = false,
  totalLabel = "Total",
}: Props) {
  const { items, totalItems, subtotal, shippingMethod, shippingCost, total } =
    useCart();

  return (
    <aside className="rounded-2xl border border-[var(--border)] bg-white p-5 flex flex-col gap-4 lg:sticky lg:top-24 self-start">
      <h2 className="text-base font-extrabold text-[var(--avax-black)]">
        Resumen del pedido
      </h2>

      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <div className="relative w-12 h-12 shrink-0 rounded-lg bg-[var(--surface-2)] overflow-hidden flex items-center justify-center">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <SneakerPlaceholder
                  size={26}
                  className="text-[var(--avax-blue-medium)]"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[var(--avax-black)] line-clamp-1">
                {item.name}
              </p>
              <p className="text-[11px] text-[var(--foreground-muted)]">
                Talla: {item.size} · Qty: {item.qty}
              </p>
            </div>
            <span className="text-sm font-black text-[var(--avax-black)] shrink-0">
              {formatPrice(item.unitPrice * item.qty)}
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t border-[var(--border)] pt-3 flex flex-col gap-1.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[var(--foreground-muted)]">
            Subtotal ({totalItems} item{totalItems === 1 ? "" : "s"})
          </span>
          <span className="font-bold text-[var(--avax-black)]">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[var(--foreground-muted)]">
            Envío{showShipping ? ` · ${shippingMethod.name}` : ""}
          </span>
          <span
            className={
              shippingCost === 0
                ? "font-bold text-[var(--success)]"
                : "font-bold text-[var(--avax-black)]"
            }
          >
            {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
          </span>
        </div>
      </div>

      <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between">
        <span className="text-sm font-bold text-[var(--avax-black)]">
          {totalLabel}
        </span>
        <span className="text-xl font-black text-[var(--avax-black)]">
          {formatPrice(total)}
        </span>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--foreground-muted)]">
        <ShieldCheck size={14} className="text-[var(--success)]" />
        Compra 100% segura
      </div>

      <div className="flex items-center justify-center gap-2">
        {["VISA", "MC", "AMEX", "YAPE"].map((m) => (
          <span
            key={m}
            className="px-2 py-1 rounded-md bg-[var(--surface-2)] text-[10px] font-extrabold text-[var(--foreground-muted)]"
          >
            {m}
          </span>
        ))}
      </div>
    </aside>
  );
}
