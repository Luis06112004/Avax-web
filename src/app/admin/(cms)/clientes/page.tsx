"use client";
import { useEffect, useState } from "react";
import { Topbar } from "../../_components/Topbar";
import { Users } from "lucide-react";

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
        subtitle="Consulta el historial y datos de tus clientes."
        breadcrumbs={[{ label: "AVAX CMS", href: "/admin/dashboard" }, { label: "Clientes" }]}
      />

      <div className="px-6 lg:px-8 py-8">
        {/* Modal historial */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
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
                <button onClick={() => setSelected(null)} className="text-[var(--admin-fg-muted)] hover:text-[var(--admin-fg)] text-xl">✕</button>
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
                      <p className="text-lg font-bold text-[var(--admin-fg)]">{value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider mb-3">Historial de pedidos</p>
                {loadingPedidos ? (
                  <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--primary)]" /></div>
                ) : pedidos.length === 0 ? (
                  <p className="text-center text-[var(--admin-fg-muted)] py-8 text-sm">Sin pedidos aún</p>
                ) : (
                  <div className="space-y-2">
                    {pedidos.map((p) => (
                      <div key={p.id} className="flex items-center justify-between py-3 border-b border-[var(--admin-border)] last:border-0">
                        <div>
                          <p className="text-sm font-medium text-[var(--admin-fg)]">Pedido #{p.id}</p>
                          <p className="text-xs text-[var(--admin-fg-muted)]">{new Date(p.fecha).toLocaleDateString("es-PE")}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[p.estado] ?? "bg-white/5 text-[var(--admin-fg-muted)]"}`}>{p.estado}</span>
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

        {/* Búsqueda */}
        <div className="mb-5">
          <input type="text" placeholder="Buscar por nombre o email..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--admin-fg)] focus:outline-none focus:border-[var(--primary)]" />
        </div>

        {/* Tabla */}
        <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--admin-border)]">
              <tr>
                {["Cliente", "Teléfono", "Pedidos", "Total gastado", "Estado", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.12em] text-[var(--admin-fg-subtle)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--primary)] mx-auto" /></td></tr>
              ) : clientes.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-[var(--admin-fg-muted)]">No se encontraron clientes</td></tr>
              ) : clientes.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--primary)]/15 flex items-center justify-center text-[var(--primary)] font-semibold text-xs flex-shrink-0">
                        {getInitials(c.nombre, c.apellido)}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--admin-fg)]">{c.nombre} {c.apellido}</p>
                        <p className="text-xs text-[var(--admin-fg-muted)]">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[var(--admin-fg-muted)]">{c.telefono || "—"}</td>
                  <td className="px-5 py-4 font-medium text-[var(--admin-fg)]">{c.total_pedidos}</td>
                  <td className="px-5 py-4 font-medium text-[var(--admin-fg)]">S/ {c.total_gastado.toFixed(2)}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => handleToggle(c.id, c.activo)}
                      className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer transition-colors ${c.activo ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-[var(--admin-fg-muted)]"}`}>
                      {c.activo ? "Activo" : "Bloqueado"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => handleVerPedidos(c)}
                      className="text-xs text-[var(--primary)] font-medium px-3 py-1.5 rounded-lg border border-[var(--primary)]/30 hover:bg-[var(--primary)]/10 transition-colors">
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