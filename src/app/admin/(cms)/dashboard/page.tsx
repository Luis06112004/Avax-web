"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  RefreshCw,
  Layers,
  Activity,
  ArrowRight,
  AlertCircle,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import { Topbar } from "../../_components/Topbar";
import { getAdminToken, getAdminUser } from "@/lib/admin-auth";

const API_BASE = "http://127.0.0.1:8000/api";

type Pedido = {
  numero: string;
  estado: string;
  total: number;
  created_at: string;
};

type Producto = {
  id: number | string;
  nombre?: string;
  name?: string;
  slug: string;
  precio?: number;
  price?: number;
  stock?: number;
  activo?: boolean;
  active?: boolean;
};

async function fetchWithAuth<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json() as Promise<T>;
}

const ESTADO_COLOR: Record<string, string> = {
  pendiente: "bg-amber-500/15 text-amber-400",
  procesando: "bg-blue-500/15 text-blue-400",
  completado: "bg-emerald-500/15 text-emerald-400",
  cancelado: "bg-red-500/15 text-red-400",
};

function StatSkeleton() {
  return (
    <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="h-3 w-28 rounded bg-white/5 animate-pulse" />
        <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse" />
      </div>
      <div className="h-8 w-16 rounded bg-white/5 animate-pulse mb-2" />
      <div className="h-3 w-36 rounded bg-white/5 animate-pulse" />
    </div>
  );
}

export default function DashboardPage() {
  const token = getAdminToken() ?? "";
  const user = getAdminUser();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pedidosRes, productosRes] = await Promise.allSettled([
        fetchWithAuth<{ data: Pedido[] } | Pedido[]>("/shop/pedidos", token),
        fetchWithAuth<{ data: Producto[] } | Producto[]>("/shop/productos", token),
      ]);

      if (pedidosRes.status === "fulfilled") {
        const list = Array.isArray(pedidosRes.value)
          ? pedidosRes.value
          : (pedidosRes.value as { data: Pedido[] }).data ?? [];
        setPedidos(list);
      }

      if (productosRes.status === "fulfilled") {
        const list = Array.isArray(productosRes.value)
          ? productosRes.value
          : (productosRes.value as { data: Producto[] }).data ?? [];
        setProductos(list);
      }

      if (
        pedidosRes.status === "rejected" &&
        productosRes.status === "rejected"
      ) {
        throw new Error("No se pudo conectar con la API");
      }

      setLastUpdate(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadData(); }, []);

  const totalProductos = productos.length;
  const productosActivos = productos.filter((p) => p.activo ?? p.active ?? true).length;
  const totalPedidos = pedidos.length;
  const pedidosPendientes = pedidos.filter((p) => p.estado === "pendiente").length;
  const ingresoTotal = pedidos.reduce((acc, p) => acc + (p.total ?? 0), 0);

  const firstName = user?.name?.split(" ")[0] ?? "Admin";

  const STATS = [
    {
      label: "Productos publicados",
      value: loading ? null : String(productosActivos),
      hint: loading ? "Cargando..." : `${totalProductos} en total`,
      icon: ShoppingBag,
    },
    {
      label: "Pedidos totales",
      value: loading ? null : String(totalPedidos),
      hint: loading ? "Cargando..." : `${pedidosPendientes} pendientes`,
      icon: ClipboardList,
    },
    {
      label: "Ingresos",
      value: loading
        ? null
        : `S/ ${ingresoTotal.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`,
      hint: "Suma de todos los pedidos",
      icon: TrendingUp,
    },
    {
      label: "Estado del sitio",
      value: loading ? null : error ? "Error API" : "Operativo",
      hint: loading
        ? "Verificando..."
        : error
        ? error
        : lastUpdate
        ? `Actualizado a las ${lastUpdate.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}`
        : "Sin incidencias",
      icon: Activity,
    },
  ];

  return (
    <>
      <Topbar
        title={`Bienvenido, ${firstName}`}
        subtitle="Resumen del contenido visual del e-commerce."
        breadcrumbs={[{ label: "AVAX CMS" }, { label: "General" }]}
        actions={
          <button
            type="button"
            onClick={() => void loadData()}
            disabled={loading}
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--admin-fg-muted)] hover:text-[var(--admin-fg)] flex items-center justify-center transition-colors disabled:opacity-40"
            aria-label="Actualizar datos"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>
        }
      />

      <div className="px-6 lg:px-8 py-8 flex flex-col gap-8">

        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">No se pudieron cargar los datos en tiempo real</p>
              <p className="text-xs mt-0.5 text-red-400/80">{error} — verifica que el backend esté corriendo.</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
            : STATS.map(({ label, value, hint, icon: Icon }) => (
                <div
                  key={label}
                  className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl p-5 hover:border-[var(--primary)] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs text-[var(--admin-fg-muted)]">{label}</span>
                    <span className="w-8 h-8 rounded-lg bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center">
                      <Icon size={14} />
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-[var(--admin-fg)] mb-1 tracking-tight">
                    {value ?? "—"}
                  </p>
                  <p className="text-[11px] text-[var(--admin-fg-subtle)]">{hint}</p>
                </div>
              ))}
        </div>

        {/* Últimos pedidos */}
        {!loading && pedidos.length > 0 && (
          <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--admin-border)]">
              <div>
                <h3 className="text-sm font-semibold text-[var(--admin-fg)]">Últimos pedidos</h3>
                <p className="text-[11px] text-[var(--admin-fg-subtle)] mt-0.5">
                  Los {Math.min(pedidos.length, 5)} más recientes
                </p>
              </div>
              <Link
                href="/admin/pedidos"
                className="text-xs text-[var(--primary)] hover:underline font-medium flex items-center gap-1"
              >
                Ver todos <ArrowRight size={12} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--admin-border)]">
                    <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.12em] text-[var(--admin-fg-subtle)]">PEDIDO</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.12em] text-[var(--admin-fg-subtle)]">ESTADO</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.12em] text-[var(--admin-fg-subtle)] hidden md:table-cell">FECHA</th>
                    <th className="text-right px-5 py-3 text-[10px] font-bold tracking-[0.12em] text-[var(--admin-fg-subtle)]">TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.slice(0, 5).map((p) => (
                    <tr
                      key={p.numero}
                      className="border-b border-[var(--admin-border)] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3 font-semibold text-[var(--admin-fg)]">
                        #{p.numero}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${ESTADO_COLOR[p.estado] ?? "bg-white/5 text-[var(--admin-fg-muted)]"}`}>
                          {p.estado}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[var(--admin-fg-muted)] text-xs hidden md:table-cell">
                        {p.created_at
                          ? new Date(p.created_at).toLocaleDateString("es-PE", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-[var(--admin-fg)]">
                        S/ {(p.total ?? 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CTA productos */}
        <div className="relative overflow-hidden rounded-2xl border border-[var(--admin-border)] gradient-avax p-8 lg:p-10">
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[var(--avax-blue-light)]/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.22em] text-white/80 mb-3">
              <ShoppingBag size={12} />
              ACCIÓN PRINCIPAL
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 tracking-tight">
              Gestiona el catálogo de productos
            </h2>
            <p className="text-sm text-white/85 mb-7 max-w-lg leading-relaxed">
              Crea, edita y publica productos del e-commerce. Define precios,
              stock, tallas, colores e imágenes — todo desde un solo lugar.
            </p>
            <Link
              href="/admin/productos"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[var(--avax-black)] hover:bg-white/90 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-black/10"
            >
              Ir a productos
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Próximamente */}
        <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[var(--admin-fg)] mb-1">Próximamente</h3>
          <p className="text-xs text-[var(--admin-fg-muted)] mb-5">
            Estos módulos se habilitarán cuando el backend Laravel esté disponible.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "Categorías del catálogo",
              "Banners promocionales",
              "Pedidos y estados de envío",
              "Clientes registrados",
              "Cupones y promociones",
              "Configuración general",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-[var(--admin-border)] text-xs text-[var(--admin-fg-muted)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--admin-fg-subtle)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </>
  );
}
