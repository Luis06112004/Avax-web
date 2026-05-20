"use client";
import { useEffect, useState } from "react";
import { Topbar } from "../../_components/Topbar";

const API_BASE = "http://127.0.0.1:8000/api";

type Cupon = {
  id: number;
  codigo: string;
  tipo: "porcentaje" | "monto_fijo";
  valor: number;
  minimo_compra?: number;
  maximo_descuento?: number;
  usos_maximos?: number;
  usos_actuales: number;
  activo: boolean;
  fecha_inicio?: string;
  fecha_fin?: string;
};

const EMPTY = {
  codigo: "",
  tipo: "porcentaje" as "porcentaje" | "monto_fijo",
  valor: "",
  minimo_compra: "",
  maximo_descuento: "",
  usos_maximos: "",
  activo: true,
  fecha_inicio: "",
  fecha_fin: "",
};

function getToken() {
  return localStorage.getItem("avax_admin_token_v1") ?? "";
}

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function CuponesPage() {
  const [cupones, setCupones] = useState<Cupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Cupon | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/admin/cupones`, {
      headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((d) => setCupones(Array.isArray(d) ? d : Array.isArray(d.cupones) ? d.cupones : []))
      .catch(() => setCupones([]))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY, codigo: generateCode() });
    setError("");
    setShowForm(true);
  };

  const openEdit = (c: Cupon) => {
    setEditing(c);
    setForm({
      codigo: c.codigo,
      tipo: c.tipo,
      valor: c.valor.toString(),
      minimo_compra: c.minimo_compra?.toString() ?? "",
      maximo_descuento: c.maximo_descuento?.toString() ?? "",
      usos_maximos: c.usos_maximos?.toString() ?? "",
      activo: c.activo,
      fecha_inicio: c.fecha_inicio ?? "",
      fecha_fin: c.fecha_fin ?? "",
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      valor: Number(form.valor),
      minimo_compra: form.minimo_compra ? Number(form.minimo_compra) : null,
      maximo_descuento: form.maximo_descuento ? Number(form.maximo_descuento) : null,
      usos_maximos: form.usos_maximos ? Number(form.usos_maximos) : null,
    };
    try {
      const url = editing ? `${API_BASE}/admin/cupones/${editing.id}` : `${API_BASE}/admin/cupones`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (editing) {
        setCupones((prev) => prev.map((c) => c.id === editing.id ? data : c));
      } else {
        setCupones((prev) => [...prev, data]);
      }
      setShowForm(false);
    } catch { setError("Error al guardar"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este cupón?")) return;
    await fetch(`${API_BASE}/admin/cupones/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
    });
    setCupones((prev) => prev.filter((c) => c.id !== id));
  };

  const handleToggle = async (id: number, activo: boolean) => {
    await fetch(`${API_BASE}/admin/cupones/${id}/estado`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !activo }),
    });
    setCupones((prev) => prev.map((c) => c.id === id ? { ...c, activo: !activo } : c));
  };

  const isExpired = (c: Cupon) => c.fecha_fin ? new Date(c.fecha_fin) < new Date() : false;
  const isExhausted = (c: Cupon) => c.usos_maximos ? c.usos_actuales >= c.usos_maximos : false;

  return (
    <>
      <Topbar
        title="Cupones y promociones"
        subtitle="Crea códigos de descuento para tus clientes."
        breadcrumbs={[{ label: "AVAX CMS", href: "/admin/dashboard" }, { label: "Cupones" }]}
        actions={
          <button onClick={openCreate}
            className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold rounded-lg transition-colors">
            + Nuevo cupón
          </button>
        }
      />

      <div className="px-6 lg:px-8 py-8">
        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--admin-border)]">
                <h2 className="font-semibold text-[var(--admin-fg)]">{editing ? "Editar cupón" : "Nuevo cupón"}</h2>
                <button onClick={() => setShowForm(false)} className="text-[var(--admin-fg-muted)] hover:text-[var(--admin-fg)] text-xl">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}
                <div>
                  <label className="block text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider mb-1.5">Código *</label>
                  <div className="flex gap-2">
                    <input value={form.codigo} onChange={(e) => setForm({...form, codigo: e.target.value.toUpperCase()})}
                      required maxLength={20}
                      className="flex-1 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg px-4 py-2.5 text-sm font-mono uppercase text-[var(--admin-fg)] focus:outline-none focus:border-[var(--primary)]" />
                    <button type="button" onClick={() => setForm({...form, codigo: generateCode()})}
                      className="px-3 py-2.5 border border-[var(--admin-border)] rounded-lg text-sm text-[var(--admin-fg-muted)] hover:text-[var(--admin-fg)] hover:bg-white/5 transition-colors">🎲</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider mb-1.5">Tipo *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["porcentaje", "monto_fijo"] as const).map((t) => (
                      <label key={t} className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors text-sm ${form.tipo === t ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]" : "border-[var(--admin-border)] text-[var(--admin-fg-muted)]"}`}>
                        <input type="radio" name="tipo" value={t} checked={form.tipo === t} onChange={() => setForm({...form, tipo: t})} className="hidden" />
                        {t === "porcentaje" ? "% Porcentaje" : "S/ Monto fijo"}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider mb-1.5">
                    Valor * {form.tipo === "porcentaje" ? "(%)" : "(S/)"}
                  </label>
                  <input type="number" min="0" step={form.tipo === "porcentaje" ? "1" : "0.01"}
                    value={form.valor} onChange={(e) => setForm({...form, valor: e.target.value})} required
                    className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--admin-fg)] focus:outline-none focus:border-[var(--primary)]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider mb-1.5">Compra mínima</label>
                    <input type="number" min="0" step="0.01" value={form.minimo_compra} onChange={(e) => setForm({...form, minimo_compra: e.target.value})}
                      placeholder="Sin mínimo"
                      className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--admin-fg)] focus:outline-none focus:border-[var(--primary)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider mb-1.5">Límite de usos</label>
                    <input type="number" min="1" value={form.usos_maximos} onChange={(e) => setForm({...form, usos_maximos: e.target.value})}
                      placeholder="Sin límite"
                      className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--admin-fg)] focus:outline-none focus:border-[var(--primary)]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider mb-1.5">Válido desde</label>
                    <input type="date" value={form.fecha_inicio} onChange={(e) => setForm({...form, fecha_inicio: e.target.value})}
                      className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--admin-fg)] focus:outline-none focus:border-[var(--primary)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider mb-1.5">Válido hasta</label>
                    <input type="date" value={form.fecha_fin} onChange={(e) => setForm({...form, fecha_fin: e.target.value})}
                      className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--admin-fg)] focus:outline-none focus:border-[var(--primary)]" />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-[var(--admin-fg-muted)] cursor-pointer">
                  <input type="checkbox" checked={form.activo} onChange={(e) => setForm({...form, activo: e.target.checked})} className="w-4 h-4 accent-[var(--primary)]" />
                  Cupón activo
                </label>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60">
                    {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear cupón"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-5 border border-[var(--admin-border)] text-[var(--admin-fg-muted)] hover:text-[var(--admin-fg)] text-sm rounded-lg transition-colors">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabla */}
        <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--admin-border)]">
              <tr>
                {["Código", "Descuento", "Condiciones", "Usos", "Estado", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.12em] text-[var(--admin-fg-subtle)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--primary)] mx-auto" /></td></tr>
              ) : cupones.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-[var(--admin-fg-muted)]">Sin cupones. Crea el primero.</td></tr>
              ) : cupones.map((c) => {
                const expired = isExpired(c);
                const exhausted = isExhausted(c);
                const statusLabel = !c.activo ? "Inactivo" : expired ? "Vencido" : exhausted ? "Agotado" : "Activo";
                const statusClass = !c.activo || expired || exhausted ? "bg-white/5 text-[var(--admin-fg-muted)]" : "bg-emerald-500/15 text-emerald-400";
                return (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-[var(--admin-fg)] text-base tracking-wider">{c.codigo}</td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-[var(--admin-fg)]">{c.tipo === "porcentaje" ? `${c.valor}%` : `S/ ${c.valor.toFixed(2)}`}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-[var(--admin-fg-muted)] space-y-0.5">
                      {c.minimo_compra && <p>Mínimo: S/ {c.minimo_compra}</p>}
                      {c.fecha_fin && <p>Vence: {new Date(c.fecha_fin).toLocaleDateString("es-PE")}</p>}
                    </td>
                    <td className="px-5 py-4 text-[var(--admin-fg)]">
                      {c.usos_actuales}{c.usos_maximos ? ` / ${c.usos_maximos}` : ""}
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleToggle(c.id, c.activo)}
                        className={`text-xs px-2 py-1 rounded-full font-medium cursor-pointer transition-colors ${statusClass}`}>
                        {statusLabel}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(c)}
                          className="text-xs text-[var(--primary)] font-medium px-3 py-1.5 rounded-lg border border-[var(--primary)]/30 hover:bg-[var(--primary)]/10 transition-colors">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(c.id)}
                          className="text-xs text-red-400 font-medium px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-colors">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}