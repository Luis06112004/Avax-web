"use client";

import { useEffect, useState, useMemo } from "react";
import { Topbar } from "../../_components/Topbar";
import { 
  Users, Search, Download, Star, 
  Mail, Phone, ShoppingBag 
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const API_BASE = "http://127.0.0.1:8000/api";

type Cliente = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fecha_registro: string;
  total_pedidos: number;
  total_gastado: number;
  activo: boolean;
};

type Pedido = {
  id: number;
  total: number;
  estado: string;
  fecha: string;
};

function getToken() {
  return localStorage.getItem("avax_admin_token_v1") ?? "";
}

function getInitials(nombre: string, apellido: string) {
  return `${nombre[0] ?? ""}${apellido[0] ?? ""}`.toUpperCase();
}

const STATUS_COLORS: Record<string, string> = {
  pendiente: "bg-amber-500/15 text-amber-400",
  procesando: "bg-blue-500/15 text-blue-400",
  enviado: "bg-purple-500/15 text-purple-400",
  entregado: "bg-emerald-500/15 text-emerald-400",
  cancelado: "bg-red-500/15 text-red-400",
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Cliente | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [filtroSegmento, setFiltroSegmento] = useState("Todos");

  // Fetch de clientes desde la API de Laravel
  useEffect(() => {
    const q = search ? `?search=${search}` : "";
    fetch(`${API_BASE}/admin/clientes${q}`, {
      headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((d) => setClientes(Array.isArray(d) ? d : Array.isArray(d.clientes) ? d.clientes : []))
      .catch(() => setClientes([]))
      .finally(() => setLoading(false));
  }, [search]);

  // Cálculos dinámicos para los cuadros de Stats basados en la API
  const stats = useMemo(() => {
    const total = clientes.length;
    // Consideramos VIP a quien haya gastado más de S/ 1000 de forma simulada en base al backend
    const vips = clientes.filter(c => c.total_gastado > 1000).length;
    const sumaTotal = clientes.reduce((acc, c) => acc + c.total_gastado, 0);
    const ticketPromedio = total > 0 ? (sumaTotal / total).toFixed(2) : "0.00";

    return { total, vips, ticketPromedio };
  }, [clientes]);

  // Filtrado local por segmento simulado para no perder tu funcionalidad
  const filteredClientes = useMemo(() => {
    return clientes.filter(c => {
      if (filtroSegmento === "Todos") return true;
      if (filtroSegmento === "VIP") return c.total_gastado > 1000;
      if (filtroSegmento === "Frecuente") return c.total_pedidos > 3 && c.total_gastado <= 1000;
      if (filtroSegmento === "Nuevo") return c.total_pedidos <= 3 && c.total_gastado <= 1000;
      return true;
    });
  }, [clientes, filtroSegmento]);

  const handleVerPedidos = async (c: Cliente) => {
    setSelected(c);
    setLoadingPedidos(true);
    setPedidos([]);
    try {
      const r = await fetch(`${API_BASE}/admin/clientes/${c.id}/pedidos`, {
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
      });
      const d = await r.json();
      setPedidos(d.pedidos ?? d);
    } catch { setPedidos([]); }
    finally { setLoadingPedidos(false); }
  };

  const handleToggle = async (id: number, activo: boolean) => {
    await fetch(`${API_BASE}/admin/clientes/${id}/estado`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !activo }),
    });
    setClientes((prev) => prev.map((c) => c.id === id ? { ...c, activo: !activo } : c));
  };

  return (
    <>
      <Topbar
        title="Clientes registrados"
        subtitle="Consulta el historial, estadísticas y datos de tus clientes."
        breadcrumbs={[{ label: "AVAX CMS", href: "/admin/dashboard" }, { label: "Clientes" }]}
      />

      <div className="px-6 lg:px-8 py-8 flex flex-col gap-6">
        
        {/* REINCORPORADOS: Tus hermosos cuadros de estadísticas con datos reales de la API */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] p-5 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-[var(--admin-fg-subtle)] uppercase tracking-widest">Total Registrados</p>
            <h3 className="text-2xl font-bold text-[var(--admin-fg)] mt-1">{stats.total}</h3>
          </div>
          <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] p-5 rounded-2xl shadow-sm border-l-4 border-l-amber-500">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
              <Star size={10} fill="currentColor" /> Clientes VIP (S/ &gt;1K)
            </p>
            <h3 className="text-2xl font-bold text-[var(--admin-fg)] mt-1">{stats.vips}</h3>
          </div>
          <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] p-5 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold text-[var(--admin-fg-subtle)] uppercase tracking-widest">Inversión Promedio</p>
            <h3 className="text-2xl font-bold text-[var(--admin-fg)] mt-1">S/ {stats.ticketPromedio}</h3>
          </div>
        </div>

        {/* Modal de historial de pedidos */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--admin-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)]/15 flex items-center justify-center text-[var(--primary)] font-semibold text-sm">
                    {getInitials(selected.nombre, selected.apellido)}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--admin-fg)]">{selected.nombre} {selected.apellido}</p>
                    <p className="text-xs text-[var(--admin-fg-muted)]">{selected.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-[var(--admin-fg-muted)] hover:text-[var(--admin-fg)] text-sm font-bold bg-white/5 w-7 h-7 rounded-full flex items-center justify-center">✕</button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Total pedidos", value: selected.total_pedidos },
                    { label: "Total gastado", value: `S/ ${selected.total_gastado.toFixed(2)}` },
                    { label: "Miembro desde", value: new Date(selected.fecha_registro).toLocaleDateString("es-PE", { month: "short", year: "numeric" }) },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-[var(--admin-bg)] rounded-xl p-4 text-center border border-[var(--admin-border)]">
                      <p className="text-xs text-[var(--admin-fg-muted)] mb-1">{label}</p>
                      <p className="text-base font-bold text-[var(--admin-fg)]">{value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider mb-3">Historial de pedidos</p>
                {loadingPedidos ? (
                  <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--primary)]" /></div>
                ) : pedidos.length === 0 ? (
                  <p className="text-center text-[var(--admin-fg-muted)] py-8 text-sm">Sin pedidos aún</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {pedidos.map((p) => (
                      <div key={p.id} className="flex items-center justify-between py-3 border-b border-[var(--admin-border)] last:border-0">
                        <div>
                          <p className="text-sm font-medium text-[var(--admin-fg)]">Pedido #{p.id}</p>
                          <p className="text-xs text-[var(--admin-fg-muted)]">{new Date(p.fecha).toLocaleDateString("es-PE")}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[p.estado] ?? "bg-white/5 text-[var(--admin-fg-muted)]"}`}>{p.estado}</span>
                          <span className="text-sm font-bold text-[var(--admin-fg)]">S/ {p.total.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Herramientas de Filtro combinadas */}
        <div className="flex flex-col md:flex-row gap-4 justify-between bg-[var(--admin-card)] border border-[var(--admin-border)] p-4 rounded-2xl">
          <div className="flex gap-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-fg-subtle)]" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por nombre o email..."
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-xl pl-9 pr-4 py-2 text-sm text-[var(--admin-fg)] focus:outline-none focus:border-[var(--primary)]" 
              />
            </div>
            <select 
              className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-xl px-4 text-sm text-[var(--admin-fg)] outline-none"
              value={filtroSegmento}
              onChange={(e) => setFiltroSegmento(e.target.value)}
            >
              <option value="Todos">Todos los segmentos</option>
              <option value="VIP">VIP</option>
              <option value="Frecuente">Frecuente</option>
              <option value="Nuevo">Nuevo</option>
            </select>
          </div>
          <Button variant="outline" icon={<Download size={16} />}>Exportar Excel</Button>
        </div>

        {/* Tabla */}
        <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--admin-border)] bg-white/[0.02]">
                {["Cliente", "Teléfono", "Pedidos", "Total gastado", "Estado", "Acción"].map((h) => (
                  <th key={h} className="px-6 py-4 text-[10px] font-bold tracking-[0.12em] text-[var(--admin-fg-subtle)] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--primary)] mx-auto" /></td></tr>
              ) : filteredClientes.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center text-[var(--admin-fg-muted)]">No se encontraron clientes</td></tr>
              ) : filteredClientes.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--primary)]/15 flex items-center justify-center text-[var(--primary)] font-semibold text-xs flex-shrink-0">
                        {getInitials(c.nombre, c.apellido)}
                      </div>
                      <div>
                        <p className="font-bold text-[var(--admin-fg)]">{c.nombre} {c.apellido}</p>
                        <p className="text-xs text-[var(--admin-fg-muted)]">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-fg-muted)]">{c.telefono || "—"}</td>
                  <td className="px-6 py-4 font-medium text-[var(--admin-fg)]">{c.total_pedidos}</td>
                  <td className="px-6 py-4 font-bold text-[var(--admin-fg)]">S/ {c.total_gastado.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleToggle(c.id, c.activo)}
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium cursor-pointer transition-colors ${c.activo ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20" : "bg-white/5 text-[var(--admin-fg-subtle)] hover:bg-white/10"}`}
                    >
                      {c.activo ? "Activo" : "Bloqueado"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleVerPedidos(c)}
                      className="text-xs text-[var(--primary)] font-semibold px-3 py-1.5 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 hover:bg-[var(--primary)] hover:text-white transition-all"
                    >
                      Ver pedidos
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}