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
  Users,
  Tag,
  Settings,
  Trophy,
} from "lucide-react";
import { Topbar } from "../../_components/Topbar";
import { getAdminToken, getAdminUser } from "@/lib/admin-auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8010/api";

type PedidoReciente = {
  id: number;
  cliente_nombre: string;
  cliente_email: string;
  total: number;
  estado: string;
  fecha: string;
};

type ProductoTop = {
  nombre: string;
  vendidos: number;
};

type Stats = {
  ventas_hoy: number;
  pedidos_total: number;
  productos_total: number;
  clientes_total: number;
  pedidos_recientes: PedidoReciente[];
  productos_top: ProductoTop[];
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
    <div className="admin-card-premium p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="admin-shimmer h-3 w-28 rounded" />
        <div className="admin-shimmer w-8 h-8 rounded-lg" />
      </div>
      <div className="admin-shimmer h-8 w-16 rounded mb-2" />
      <div className="admin-shimmer h-3 w-36 rounded" />
    </div>
  );
}

export default function DashboardPage() {
  const token = getAdminToken() ?? "";
  const user = getAdminUser();

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithAuth<Stats>("/admin/stats", token);
      setStats(data);
      setLastUpdate(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadData(); }, []);

  // Datos reales que vienen del endpoint /admin/stats
  const totalProductos = stats?.productos_total ?? 0;
  const totalPedidos = stats?.pedidos_total ?? 0;
  const totalClientes = stats?.clientes_total ?? 0;
  const ventasHoy = stats?.ventas_hoy ?? 0;
  const pedidosRecientes = stats?.pedidos_recientes ?? [];
  const productosTop = stats?.productos_top ?? [];

  const firstName = user?.name?.split(" ")[0] ?? "Admin";

  const fmtSoles = (n: number) =>
    `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;

  const STATS = [
    {
      label: "Productos en catálogo",
      value: loading ? null : totalProductos.toLocaleString("es-PE"),
      hint: loading ? "Cargando..." : "Sincronizados desde e-commerce",
      icon: ShoppingBag,
      accent: "var(--primary)",
    },
    {
      label: "Pedidos totales",
      value: loading ? null : totalPedidos.toLocaleString("es-PE"),
      hint: loading ? "Cargando..." : totalPedidos === 0 ? "Aún sin pedidos" : "Registrados en la tienda",
      icon: ClipboardList,
      accent: "#f59e0b",
    },
    {
      label: "Ventas de hoy",
      value: loading ? null : fmtSoles(ventasHoy),
      hint: "Pedidos confirmados hoy",
      icon: TrendingUp,
      accent: "#22c55e",
    },
    {
      label: "Clientes registrados",
      value: loading ? null : totalClientes.toLocaleString("es-PE"),
      hint: loading ? "Cargando..." : "Cuentas en la tienda",
      icon: Users,
      accent: "#8b5cf6",
    },
  ];

  // Accesos directos a los módulos que YA existen y funcionan
  const MODULOS = [
    { label: "Productos", href: "/admin/productos", icon: ShoppingBag, desc: "Catálogo del e-commerce" },
    { label: "Banners", href: "/admin/banners", icon: Layers, desc: "Promociones de la home" },
    { label: "Clientes", href: "/admin/clientes", icon: Users, desc: "Cuentas registradas" },
    { label: "Cupones", href: "/admin/cupones", icon: Tag, desc: "Códigos de descuento" },
    { label: "Configuración", href: "/admin/configuracion", icon: Settings, desc: "Datos de la tienda" },
    { label: "Sincronización", href: "/admin/sync", icon: RefreshCw, desc: "Importar catálogo" },
  ];

  return (
    <>
      <Topbar
        title={`Bienvenido, ${firstName}`}
        subtitle={
          lastUpdate
            ? `Datos actualizados a las ${lastUpdate.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}`
            : "Resumen en tiempo real del e-commerce."
        }
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
            : STATS.map(({ label, value, hint, icon: Icon, accent }) => (
                <div
                  key={label}
                  className="admin-card-premium admin-kpi-accent p-5 pl-6 overflow-hidden"
                  style={{ ["--kpi-accent" as string]: accent }}
                >
                  {/* Icono de fondo grande y semitransparente */}
                  <Icon
                    size={88}
                    className="absolute -right-3 -bottom-3 opacity-[0.04] pointer-events-none"
                    style={{ color: accent }}
                  />
                  <div className="relative flex items-start justify-between mb-3">
                    <span className="text-xs text-[var(--admin-fg-muted)]">{label}</span>
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${accent} 16%, transparent)`,
                        color: accent,
                      }}
                    >
                      <Icon size={14} />
                    </span>
                  </div>
                  <p className="relative text-2xl font-bold text-[var(--admin-fg)] mb-1 tracking-tight tabular-nums">
                    {value ?? "—"}
                  </p>
                  <p className="relative text-[11px] text-[var(--admin-fg-subtle)]">{hint}</p>
                </div>
              ))}
        </div>

        {/* Pedidos recientes + Productos más vendidos */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Pedidos recientes (2/3) */}
            <div className="lg:col-span-2 admin-card-premium overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--admin-border)]">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--admin-fg)]">Pedidos recientes</h3>
                  <p className="text-[11px] text-[var(--admin-fg-subtle)] mt-0.5">
                    {pedidosRecientes.length > 0
                      ? `Los ${pedidosRecientes.length} más recientes`
                      : "Aparecerán aquí cuando la tienda registre ventas"}
                  </p>
                </div>
              </div>

              {pedidosRecientes.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12 px-5">
                  <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[var(--admin-fg-subtle)] mb-3">
                    <ClipboardList size={22} />
                  </span>
                  <p className="text-sm text-[var(--admin-fg-muted)]">Todavía no hay pedidos</p>
                  <p className="text-xs text-[var(--admin-fg-subtle)] mt-1 max-w-xs">
                    Cuando un cliente complete una compra en la tienda, verás el detalle acá.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--admin-border)]">
                        <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.12em] text-[var(--admin-fg-subtle)]">CLIENTE</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.12em] text-[var(--admin-fg-subtle)]">ESTADO</th>
                        <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.12em] text-[var(--admin-fg-subtle)] hidden md:table-cell">FECHA</th>
                        <th className="text-right px-5 py-3 text-[10px] font-bold tracking-[0.12em] text-[var(--admin-fg-subtle)]">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pedidosRecientes.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-[var(--admin-border)] last:border-0 hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-5 py-3">
                            <p className="font-semibold text-[var(--admin-fg)]">{p.cliente_nombre}</p>
                            <p className="text-[11px] text-[var(--admin-fg-subtle)]">{p.cliente_email}</p>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${ESTADO_COLOR[p.estado] ?? "bg-white/5 text-[var(--admin-fg-muted)]"}`}>
                              {p.estado}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-[var(--admin-fg-muted)] text-xs hidden md:table-cell tabular-nums">
                            {p.fecha
                              ? new Date(p.fecha).toLocaleDateString("es-PE", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </td>
                          <td className="px-5 py-3 text-right font-semibold text-[var(--admin-fg)] tabular-nums">
                            {fmtSoles(p.total ?? 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Productos más vendidos (1/3) */}
            <div className="admin-card-premium overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--admin-border)]">
                <Trophy size={15} className="text-amber-400" />
                <h3 className="text-sm font-semibold text-[var(--admin-fg)]">Más vendidos</h3>
              </div>
              {productosTop.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12 px-5">
                  <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[var(--admin-fg-subtle)] mb-3">
                    <Trophy size={20} />
                  </span>
                  <p className="text-xs text-[var(--admin-fg-subtle)] max-w-[12rem]">
                    El ranking aparecerá cuando se registren ventas.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-[var(--admin-border)]">
                  {productosTop.map((p, i) => (
                    <li key={p.nombre} className="flex items-center gap-3 px-5 py-3">
                      <span className="w-6 h-6 shrink-0 rounded-md bg-white/5 flex items-center justify-center text-[11px] font-bold text-[var(--admin-fg-muted)] tabular-nums">
                        {i + 1}
                      </span>
                      <p className="flex-1 text-xs text-[var(--admin-fg)] line-clamp-2">{p.nombre}</p>
                      <span className="text-xs font-bold text-[var(--primary)] tabular-nums">
                        {p.vendidos}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
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

        {/* Accesos directos a los módulos */}
        <div>
          <h3 className="text-sm font-semibold text-[var(--admin-fg)] mb-1">Módulos del panel</h3>
          <p className="text-xs text-[var(--admin-fg-muted)] mb-4">
            Accede rápido a cualquier sección del CMS.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MODULOS.map(({ label, href, icon: Icon, desc }) => (
              <Link
                key={href}
                href={href}
                className="admin-card-premium admin-card-interactive group flex items-center gap-3 p-4"
              >
                <span className="w-10 h-10 shrink-0 rounded-xl bg-[var(--primary)]/12 text-[var(--primary)] flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                  <Icon size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--admin-fg)]">{label}</p>
                  <p className="text-[11px] text-[var(--admin-fg-subtle)] truncate">{desc}</p>
                </div>
                <ArrowRight
                  size={15}
                  className="text-[var(--admin-fg-subtle)] group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all"
                />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
