"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Package, ShoppingBag } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { SneakerPlaceholder } from "@/components/ui/SneakerPlaceholder";
import { listMyOrders, type Order } from "@/lib/orders-api";
import { formatPrice, cn } from "@/lib/utils";

const ESTADO_LABEL: Record<string, { label: string; className: string }> = {
  pendiente: {
    label: "Pendiente",
    className: "bg-[var(--warning)]/10 text-[var(--warning)]",
  },
  pagado: {
    label: "Pagado",
    className: "bg-[var(--success)]/10 text-[var(--success)]",
  },
  enviado: {
    label: "En envío",
    className: "bg-[var(--primary-soft)] text-[var(--primary)]",
  },
  entregado: {
    label: "Entregado",
    className: "bg-[var(--success)]/10 text-[var(--success)]",
  },
  cancelado: {
    label: "Cancelado",
    className: "bg-[var(--danger)]/10 text-[var(--danger)]",
  },
};

export default function MisPedidosPage() {
  const router = useRouter();
  const { isAuthenticated, hydrated, token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.replace(
        `/login?redirect=${encodeURIComponent("/mis-pedidos")}`,
      );
    }
  }, [hydrated, isAuthenticated, router]);

  useEffect(() => {
    if (!token) return;
    let alive = true;
    setLoading(true);
    listMyOrders(token)
      .then((list) => {
        if (alive) setOrders(list);
      })
      .catch(() => {
        if (alive) setError("No se pudo cargar tus pedidos");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [token]);

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="container-page py-10 text-sm text-[var(--foreground-muted)]">
        Verificando sesión…
      </div>
    );
  }

  return (
    <div className="container-page py-6 md:py-10">
      <nav className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--avax-black)] transition-colors">
          Inicio
        </Link>
        <ChevronRight size={12} />
        <span className="text-[var(--avax-black)] font-semibold">
          Mis pedidos
        </span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-black text-[var(--avax-black)] tracking-tight mb-2">
        Mis pedidos
      </h1>
      <p className="text-sm text-[var(--foreground-muted)] mb-8">
        Historial de tus compras en AVAX.
      </p>

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-2xl bg-[var(--surface-2)] animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-[var(--danger)]/20 bg-[var(--danger)]/5 p-6 text-sm text-[var(--danger)]">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 rounded-3xl bg-[var(--surface-2)]">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4">
            <ShoppingBag size={28} className="text-[var(--foreground-muted)]" />
          </div>
          <p className="text-lg font-bold text-[var(--avax-black)] mb-2">
            Aún no tienes pedidos
          </p>
          <p className="text-sm text-[var(--foreground-muted)] mb-5">
            Cuando hagas tu primera compra aparecerá aquí.
          </p>
          <Link href="/tienda">
            <Button variant="dark" size="md">
              Ir a la tienda
            </Button>
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((o) => {
            const estado = ESTADO_LABEL[o.estado] ?? {
              label: o.estado,
              className: "bg-[var(--surface-2)] text-[var(--foreground)]",
            };
            const totalItems = o.items.reduce(
              (s, i) => s + i.cantidad,
              0,
            );
            const date = new Date(o.confirmado_at ?? o.created_at);
            return (
              <li key={o.id}>
                <article className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden">
                  <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[var(--border)]">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-extrabold tracking-wider uppercase text-[var(--foreground-subtle)]">
                        Orden
                      </span>
                      <span className="text-sm font-black text-[var(--avax-black)]">
                        #{o.numero}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-extrabold tracking-wider uppercase text-[var(--foreground-subtle)]">
                        Fecha
                      </span>
                      <span className="text-sm font-bold text-[var(--avax-black)]">
                        {date.toLocaleDateString("es-PE", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-extrabold tracking-wider uppercase text-[var(--foreground-subtle)]">
                        Total
                      </span>
                      <span className="text-sm font-black text-[var(--avax-black)]">
                        {formatPrice(o.total)}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider",
                        estado.className,
                      )}
                    >
                      {estado.label}
                    </span>
                  </header>

                  <div className="flex flex-wrap gap-3 p-5">
                    {o.items.slice(0, 4).map((it) => (
                      <div
                        key={it.id}
                        className="flex items-center gap-3 min-w-[200px]"
                      >
                        <div className="relative w-12 h-12 shrink-0 rounded-lg bg-[var(--surface-2)] overflow-hidden flex items-center justify-center">
                          {it.imagen ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={it.imagen}
                              alt={it.nombre}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <SneakerPlaceholder
                              size={26}
                              className="text-[var(--avax-blue-medium)]"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[var(--avax-black)] line-clamp-1">
                            {it.nombre}
                          </p>
                          <p className="text-[11px] text-[var(--foreground-muted)]">
                            Qty: {it.cantidad}
                            {it.talla ? ` · ${it.talla}` : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                    {o.items.length > 4 && (
                      <span className="text-xs font-bold text-[var(--foreground-muted)] self-center">
                        +{o.items.length - 4} más
                      </span>
                    )}
                  </div>

                  <footer className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-[var(--border)] bg-[var(--surface-2)]">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
                      <Package size={14} />
                      {totalItems} producto{totalItems === 1 ? "" : "s"} ·{" "}
                      {o.envio_metodo.nombre}
                    </span>
                    <Link
                      href="/tienda"
                      className="text-xs font-bold text-[var(--primary)] hover:underline"
                    >
                      Volver a comprar →
                    </Link>
                  </footer>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
