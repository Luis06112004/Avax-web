"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "./CartProvider";
import { Button } from "@/components/ui/Button";
import { SneakerPlaceholder } from "@/components/ui/SneakerPlaceholder";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const {
    drawerOpen,
    closeDrawer,
    items,
    subtotal,
    totalItems,
    updateQty,
    removeItem,
  } = useCart();

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  if (!drawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      onClick={closeDrawer}
    >
      <aside
        className="absolute right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Carrito de compras"
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[var(--avax-black)]" />
            <h2 className="text-lg font-extrabold text-[var(--avax-black)]">
              Tu carrito
            </h2>
            {totalItems > 0 && (
              <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 text-[11px] font-bold rounded-full bg-[var(--avax-blue-light)] text-white">
                {totalItems}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Cerrar carrito"
            className="w-9 h-9 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface-3)] flex items-center justify-center cursor-pointer"
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6 py-10">
              <div className="w-20 h-20 rounded-full bg-[var(--surface-2)] flex items-center justify-center mb-4">
                <ShoppingBag size={28} className="text-[var(--foreground-muted)]" />
              </div>
              <p className="text-base font-bold text-[var(--avax-black)] mb-1">
                Tu carrito está vacío
              </p>
              <p className="text-sm text-[var(--foreground-muted)] mb-5">
                Agrega productos para comenzar tu compra.
              </p>
              <Button variant="dark" size="md" onClick={closeDrawer}>
                Explorar productos
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-[var(--border)]">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 p-4">
                  <div className="relative w-20 h-20 shrink-0 rounded-xl bg-[var(--surface-2)] overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <SneakerPlaceholder
                        size={44}
                        className="text-[var(--avax-blue-medium)]"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] font-extrabold tracking-wider uppercase text-[var(--foreground-subtle)]">
                          {item.brand}
                        </p>
                        <Link
                          href={`/producto/${item.slug}`}
                          onClick={closeDrawer}
                          className="block text-sm font-bold text-[var(--avax-black)] line-clamp-1 hover:text-[var(--primary)]"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                          Talla: {item.size}
                          {item.color ? ` · ${item.color}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label="Eliminar"
                        className="text-[var(--foreground-muted)] hover:text-[var(--danger)] cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center rounded-full border border-[var(--border-strong)] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          aria-label="Restar"
                          className="w-7 h-7 flex items-center justify-center hover:bg-[var(--surface-2)] cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          aria-label="Sumar"
                          className="w-7 h-7 flex items-center justify-center hover:bg-[var(--surface-2)] cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-black text-[var(--avax-black)]">
                        {formatPrice(item.unitPrice * item.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-[var(--border)] p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--foreground-muted)]">
                Subtotal ({totalItems} item{totalItems === 1 ? "" : "s"})
              </span>
              <span className="text-lg font-black text-[var(--avax-black)]">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-xs text-[var(--foreground-muted)] -mt-2">
              Envío y descuentos se calculan al finalizar.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/checkout/datos-envio" onClick={closeDrawer}>
                <Button variant="dark" size="md" fullWidth>
                  Finalizar compra
                </Button>
              </Link>
              <Link href="/carrito" onClick={closeDrawer}>
                <Button variant="ghost" size="md" fullWidth>
                  Ver carrito completo
                </Button>
              </Link>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}
