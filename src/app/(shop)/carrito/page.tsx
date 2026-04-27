"use client";

import Link from "next/link";
import {
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { SneakerPlaceholder } from "@/components/ui/SneakerPlaceholder";
import { formatPrice } from "@/lib/utils";

export default function CarritoPage() {
  const { items, totalItems, subtotal, updateQty, removeItem, clearCart } =
    useCart();

  return (
    <div className="container-page py-6 md:py-10">
      <nav className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--avax-black)] transition-colors">
          Inicio
        </Link>
        <ChevronRight size={12} />
        <span className="text-[var(--avax-black)] font-semibold">Carrito</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-black text-[var(--avax-black)] tracking-tight mb-2">
        Tu carrito
      </h1>
      <p className="text-sm text-[var(--foreground-muted)] mb-8">
        {totalItems === 0
          ? "Aún no tienes productos."
          : `${totalItems} producto${totalItems === 1 ? "" : "s"} en el carrito.`}
      </p>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 rounded-3xl bg-[var(--surface-2)]">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4">
            <ShoppingBag size={28} className="text-[var(--foreground-muted)]" />
          </div>
          <p className="text-lg font-bold text-[var(--avax-black)] mb-2">
            Tu carrito está vacío
          </p>
          <p className="text-sm text-[var(--foreground-muted)] mb-5">
            Explora nuestro catálogo y encuentra tu próximo par.
          </p>
          <Link href="/tienda">
            <Button variant="dark" size="md">
              Ir a la tienda
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="flex flex-col gap-3">
            <ul className="flex flex-col rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden bg-white">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 p-4 sm:p-5">
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28 shrink-0 rounded-xl bg-[var(--surface-2)] overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <SneakerPlaceholder
                        size={50}
                        className="text-[var(--avax-blue-medium)]"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-extrabold tracking-wider uppercase text-[var(--foreground-subtle)]">
                          {item.brand}
                        </p>
                        <Link
                          href={`/producto/${item.slug}`}
                          className="block text-sm sm:text-base font-bold text-[var(--avax-black)] line-clamp-2 hover:text-[var(--primary)]"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                          Talla: {item.size}
                          {item.color ? ` · Color: ${item.color}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label="Eliminar"
                        className="text-[var(--foreground-muted)] hover:text-[var(--danger)] cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 mt-auto">
                      <div className="inline-flex items-center rounded-full border border-[var(--border-strong)] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          aria-label="Restar"
                          className="w-9 h-9 flex items-center justify-center hover:bg-[var(--surface-2)] cursor-pointer"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-bold">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          aria-label="Sumar"
                          className="w-9 h-9 flex items-center justify-center hover:bg-[var(--surface-2)] cursor-pointer"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-[var(--foreground-muted)]">
                          {formatPrice(item.unitPrice)} c/u
                        </span>
                        <span className="text-base font-black text-[var(--avax-black)]">
                          {formatPrice(item.unitPrice * item.qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/tienda"
                className="inline-flex items-center text-sm font-semibold text-[var(--primary)] hover:underline"
              >
                ← Seguir comprando
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="text-sm font-semibold text-[var(--foreground-muted)] hover:text-[var(--danger)] cursor-pointer"
              >
                Vaciar carrito
              </button>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 self-start rounded-2xl border border-[var(--border)] bg-white p-5 flex flex-col gap-4">
            <h2 className="text-base font-extrabold text-[var(--avax-black)]">
              Resumen del pedido
            </h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[var(--foreground-muted)]">
                  Subtotal ({totalItems} item{totalItems === 1 ? "" : "s"})
                </span>
                <span className="font-bold text-[var(--avax-black)]">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--foreground-muted)]">Envío</span>
                <span className="font-bold text-[var(--success)]">
                  Calculado en checkout
                </span>
              </div>
            </div>
            <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between">
              <span className="text-sm font-bold text-[var(--avax-black)]">
                Total
              </span>
              <span className="text-xl font-black text-[var(--avax-black)]">
                {formatPrice(subtotal)}
              </span>
            </div>
            <Link href="/checkout/datos-envio">
              <Button variant="dark" size="md" fullWidth>
                Finalizar compra
              </Button>
            </Link>
            <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--foreground-muted)]">
              <ShieldCheck size={14} className="text-[var(--success)]" />
              Compra 100% segura
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
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
        </div>
      )}
    </div>
  );
}
