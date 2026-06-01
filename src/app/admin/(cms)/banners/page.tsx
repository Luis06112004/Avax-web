"use client";
import { useEffect, useState } from "react";
import { Topbar } from "../../_components/Topbar";
import { Layers } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8010/api";

type Banner = {
  id: number;
  titulo: string;
  subtitulo?: string;
  imagen_url: string;
  enlace?: string;
  activo: boolean;
  orden: number;
  fecha_inicio?: string;
  fecha_fin?: string;
};

const EMPTY = {
  titulo: "",
  subtitulo: "",
  enlace: "",
  activo: true,
  orden: 1,
  fecha_inicio: "",
  fecha_fin: "",
};

function getToken() {
  return localStorage.getItem("avax_admin_token_v1") ?? "";
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/admin/banners`, {
      headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((d) => setBanners(Array.isArray(d) ? d : Array.isArray(d.banners) ? d.banners : []))
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY, orden: banners.length + 1 });
    setImagen(null);
    setPreview("");
    setError("");
    setShowForm(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm({
      titulo: b.titulo,
      subtitulo: b.subtitulo ?? "",
      enlace: b.enlace ?? "",
      activo: b.activo,
      orden: b.orden,
      fecha_inicio: b.fecha_inicio ?? "",
      fecha_fin: b.fecha_fin ?? "",
    });
    setImagen(null);
    setPreview(b.imagen_url);
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview && !imagen) { setError("La imagen es obligatoria"); return; }
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v.toString()));
      if (imagen) fd.append("imagen", imagen);
      const url = editing
        ? `${API_BASE}/admin/banners/${editing.id}`
        : `${API_BASE}/admin/banners`;
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
        body: fd,
      });
      const data = await res.json();
      if (editing) {
        setBanners((prev) => prev.map((b) => (b.id === editing.id ? data : b)));
      } else {
        setBanners((prev) => [...prev, data]);
      }
      setShowForm(false);
    } catch {
      setError("Error al guardar");
    } finally {
      setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este banner?")) return;
    await fetch(`${API_BASE}/admin/banners/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
    });
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <>
      <Topbar
        title="Banners promocionales"
        subtitle="Gestiona las imágenes del carrusel principal."
        breadcrumbs={[{ label: "AVAX CMS", href: "/admin/dashboard" }, { label: "Banners" }]}
        actions={
          <button onClick={openCreate}
            className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold rounded-lg transition-colors">
            + Nuevo banner
          </button>
        }
      />

      <div className="px-6 lg:px-8 py-8">
        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--admin-border)]">
                <h2 className="font-semibold text-[var(--admin-fg)]">{editing ? "Editar banner" : "Nuevo banner"}</h2>
                <button onClick={() => setShowForm(false)} className="text-[var(--admin-fg-muted)] hover:text-[var(--admin-fg)] text-xl">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}
                <div>
                  <label className="block text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider mb-1.5">Imagen *</label>
                  <label className="block cursor-pointer">
                    {preview ? (
                      <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-xl border border-[var(--admin-border)] mb-2" />
                    ) : (
                      <div className="w-full h-40 rounded-xl border-2 border-dashed border-[var(--admin-border)] flex flex-col items-center justify-center text-[var(--admin-fg-muted)] mb-2 hover:border-[var(--primary)] transition-colors">
                        <Layers size={32} className="mb-2" />
                        <span className="text-sm">Clic para subir imagen</span>
                        <span className="text-xs mt-1 text-[var(--admin-fg-subtle)]">Recomendado: 1200×400px</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if(f){setImagen(f);setPreview(URL.createObjectURL(f));} }} className="hidden" />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider mb-1.5">Título *</label>
                  <input value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} required
                    className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--admin-fg)] focus:outline-none focus:border-[var(--primary)]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider mb-1.5">Subtítulo</label>
                  <input value={form.subtitulo} onChange={(e) => setForm({...form, subtitulo: e.target.value})}
                    className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--admin-fg)] focus:outline-none focus:border-[var(--primary)]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider mb-1.5">Enlace (URL)</label>
                  <input value={form.enlace} onChange={(e) => setForm({...form, enlace: e.target.value})}
                    placeholder="https://... o /productos"
                    className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--admin-fg)] focus:outline-none focus:border-[var(--primary)]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider mb-1.5">Desde</label>
                    <input type="date" value={form.fecha_inicio} onChange={(e) => setForm({...form, fecha_inicio: e.target.value})}
                      className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--admin-fg)] focus:outline-none focus:border-[var(--primary)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider mb-1.5">Hasta</label>
                    <input type="date" value={form.fecha_fin} onChange={(e) => setForm({...form, fecha_fin: e.target.value})}
                      className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--admin-fg)] focus:outline-none focus:border-[var(--primary)]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider mb-1.5">Orden</label>
                    <input type="number" min="1" value={form.orden} onChange={(e) => setForm({...form, orden: Number(e.target.value)})}
                      className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--admin-fg)] focus:outline-none focus:border-[var(--primary)]" />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-[var(--admin-fg-muted)] pb-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.activo} onChange={(e) => setForm({...form, activo: e.target.checked})} className="w-4 h-4 accent-[var(--primary)]" />
                    Activo
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60">
                    {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear banner"}
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

        {/* Lista */}
        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]" /></div>
        ) : banners.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-[var(--admin-border)] rounded-2xl">
            <Layers size={40} className="mx-auto mb-3 text-[var(--admin-fg-subtle)]" />
            <p className="font-semibold text-[var(--admin-fg)] mb-1">Sin banners aún</p>
            <p className="text-sm text-[var(--admin-fg-muted)] mb-4">Crea tu primer banner para el carrusel</p>
            <button onClick={openCreate} className="px-5 py-2.5 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg">+ Crear primer banner</button>
          </div>
        ) : (
          <div className="space-y-3">
            {[...banners].sort((a,b) => a.orden - b.orden).map((b) => (
              <div key={b.id} className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-xl overflow-hidden flex">
                <img src={b.imagen_url} alt={b.titulo} className="w-44 h-28 object-cover flex-shrink-0 bg-[var(--admin-bg)]" />
                <div className="flex-1 px-5 py-4 flex justify-between items-start min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[var(--admin-fg-subtle)] font-mono">#{b.orden}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.activo ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-[var(--admin-fg-muted)]"}`}>
                        {b.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <p className="font-semibold text-[var(--admin-fg)] truncate">{b.titulo}</p>
                    {b.subtitulo && <p className="text-sm text-[var(--admin-fg-muted)] truncate">{b.subtitulo}</p>}
                    {b.enlace && <p className="text-xs text-[var(--primary)] truncate mt-1">🔗 {b.enlace}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0 ml-4">
                    <button onClick={() => openEdit(b)}
                      className="text-xs text-[var(--primary)] font-medium px-3 py-1.5 rounded-lg border border-[var(--primary)]/30 hover:bg-[var(--primary)]/10 transition-colors">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(b.id)}
                      className="text-xs text-red-400 font-medium px-3 py-1.5 rounded-lg border border-red-500/20 hover:bg-red-500/10 transition-colors">
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}