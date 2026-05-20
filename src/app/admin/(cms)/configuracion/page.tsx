"use client";
import { useEffect, useState } from "react";
import { Topbar } from "../../_components/Topbar";

const API_BASE = "http://127.0.0.1:8000/api";

type Config = {
  nombre_tienda: string;
  descripcion_tienda: string;
  email_contacto: string;
  telefono_contacto: string;
  direccion: string;
  moneda: string;
  simbolo_moneda: string;
  color_primario: string;
  redes_sociales: { facebook?: string; instagram?: string; whatsapp?: string; tiktok?: string };
  envio_gratis_desde?: number;
  costo_envio_base: number;
  igv_porcentaje: number;
  meta_titulo?: string;
  meta_descripcion?: string;
  logo_url?: string;
};

const DEFAULT: Config = {
  nombre_tienda: "", descripcion_tienda: "", email_contacto: "",
  telefono_contacto: "", direccion: "", moneda: "PEN", simbolo_moneda: "S/",
  color_primario: "#7c3aed", redes_sociales: {}, costo_envio_base: 0,
  igv_porcentaje: 18, meta_titulo: "", meta_descripcion: "",
};

type Tab = "general" | "pagos" | "redes" | "seo";
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "general", label: "General", icon: "🏪" },
  { id: "pagos", label: "Pagos y envíos", icon: "💳" },
  { id: "redes", label: "Redes sociales", icon: "📱" },
  { id: "seo", label: "SEO", icon: "🔍" },
];

function getToken() {
  return localStorage.getItem("avax_admin_token_v1") ?? "";
}

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<Config>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [logoPreview, setLogoPreview] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/admin/configuracion`, {
      headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((d) => { setConfig({ ...DEFAULT, ...d }); setLogoPreview(d.logo_url ?? ""); })
      .catch(() => setConfig(DEFAULT))
      .finally(() => setLoading(false));
  }, []);

  const set = (field: keyof Config, value: unknown) =>
    setConfig((prev) => ({ ...prev, [field]: value }));

  const setRed = (red: keyof Config["redes_sociales"], value: string) =>
    setConfig((prev) => ({ ...prev, redes_sociales: { ...prev.redes_sociales, [red]: value } }));

  const handleSave = async () => {
    setSaving(true); setError(""); setSaved(false);
    try {
      if (logoFile) {
        const fd = new FormData();
        fd.append("logo", logoFile);
        const r = await fetch(`${API_BASE}/admin/configuracion/logo`, {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
          body: fd,
        });
        const d = await r.json();
        setConfig((prev) => ({ ...prev, logo_url: d.url }));
      }
      await fetch(`${API_BASE}/admin/configuracion`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { setError("Error al guardar"); }
    finally { setSaving(false); }
  };

  const inputCls = "w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg px-4 py-2.5 text-sm text-[var(--admin-fg)] focus:outline-none focus:border-[var(--primary)]";
  const labelCls = "block text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider mb-1.5";

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]" />
    </div>
  );

  return (
    <>
      <Topbar
        title="Configuración general"
        subtitle="Ajusta los datos y parámetros de tu tienda."
        breadcrumbs={[{ label: "AVAX CMS", href: "/admin/dashboard" }, { label: "Configuración" }]}
        actions={
          <button onClick={handleSave} disabled={saving}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all ${saved ? "bg-emerald-600 text-white" : "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white"} disabled:opacity-60`}>
            {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar cambios"}
          </button>
        }
      />

      <div className="px-6 lg:px-8 py-8">
        {error && <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[var(--admin-bg)] p-1 rounded-xl w-fit border border-[var(--admin-border)]">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === t.id ? "bg-[var(--admin-card)] text-[var(--admin-fg)] shadow-sm" : "text-[var(--admin-fg-muted)] hover:text-[var(--admin-fg)]"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl p-6">

          {activeTab === "general" && (
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Logo de la tienda</label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <img src={logoPreview} alt="logo" className="h-16 w-auto rounded-lg border border-[var(--admin-border)] object-contain bg-[var(--admin-bg)] px-2" />
                  ) : (
                    <div className="h-16 w-24 rounded-lg border-2 border-dashed border-[var(--admin-border)] flex items-center justify-center text-[var(--admin-fg-muted)] text-2xl">🏪</div>
                  )}
                  <label className="cursor-pointer bg-[var(--admin-bg)] hover:bg-white/5 border border-dashed border-[var(--admin-border)] rounded-lg px-4 py-3 text-sm text-[var(--admin-fg-muted)] transition-colors">
                    📎 {logoPreview ? "Cambiar logo" : "Subir logo"}
                    <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if(f){setLogoFile(f);setLogoPreview(URL.createObjectURL(f));} }} className="hidden" />
                  </label>
                </div>
              </div>
              <div>
                <label className={labelCls}>Nombre de la tienda *</label>
                <input value={config.nombre_tienda} onChange={(e) => set("nombre_tienda", e.target.value)} placeholder="Avax Store" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Descripción breve</label>
                <textarea value={config.descripcion_tienda ?? ""} onChange={(e) => set("descripcion_tienda", e.target.value)}
                  rows={3} placeholder="Tienda online de ropa deportiva..."
                  className={`${inputCls} resize-none`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Email de contacto</label>
                  <input type="email" value={config.email_contacto} onChange={(e) => set("email_contacto", e.target.value)} placeholder="contacto@avax.pe" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Teléfono</label>
                  <input value={config.telefono_contacto} onChange={(e) => set("telefono_contacto", e.target.value)} placeholder="+51 999 999 999" className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Dirección</label>
                <input value={config.direccion} onChange={(e) => set("direccion", e.target.value)} placeholder="Av. Ejemplo 123, Lima" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Color primario</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={config.color_primario} onChange={(e) => set("color_primario", e.target.value)}
                    className="w-12 h-10 rounded-lg border border-[var(--admin-border)] cursor-pointer p-1 bg-[var(--admin-bg)]" />
                  <input value={config.color_primario} onChange={(e) => set("color_primario", e.target.value)}
                    maxLength={7} className="w-32 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg px-4 py-2.5 text-sm font-mono text-[var(--admin-fg)] focus:outline-none focus:border-[var(--primary)]" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "pagos" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Moneda</label>
                  <select value={config.moneda} onChange={(e) => set("moneda", e.target.value)} className={`${inputCls} bg-[var(--admin-bg)]`}>
                    <option value="PEN">PEN — Sol peruano</option>
                    <option value="USD">USD — Dólar</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Símbolo</label>
                  <input value={config.simbolo_moneda} onChange={(e) => set("simbolo_moneda", e.target.value)} maxLength={5} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Costo base de envío (S/)</label>
                  <input type="number" min="0" step="0.01" value={config.costo_envio_base} onChange={(e) => set("costo_envio_base", Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Envío gratis desde (S/)</label>
                  <input type="number" min="0" step="0.01" value={config.envio_gratis_desde ?? ""} onChange={(e) => set("envio_gratis_desde", e.target.value ? Number(e.target.value) : undefined)} placeholder="Sin mínimo" className={inputCls} />
                </div>
              </div>
              <div>
                <label className={labelCls}>IGV (%)</label>
                <input type="number" min="0" max="100" step="0.1" value={config.igv_porcentaje} onChange={(e) => set("igv_porcentaje", Number(e.target.value))} className={`${inputCls} max-w-xs`} />
              </div>
            </div>
          )}

          {activeTab === "redes" && (
            <div className="space-y-5">
              {([
                { red: "facebook" as const, label: "Facebook", icon: "📘", placeholder: "https://facebook.com/tutienda" },
                { red: "instagram" as const, label: "Instagram", icon: "📸", placeholder: "https://instagram.com/tutienda" },
                { red: "whatsapp" as const, label: "WhatsApp", icon: "💬", placeholder: "+51999999999" },
                { red: "tiktok" as const, label: "TikTok", icon: "🎵", placeholder: "https://tiktok.com/@tutienda" },
              ]).map(({ red, label, icon, placeholder }) => (
                <div key={red}>
                  <label className={labelCls}>{icon} {label}</label>
                  <input value={config.redes_sociales[red] ?? ""} onChange={(e) => setRed(red, e.target.value)} placeholder={placeholder} className={inputCls} />
                </div>
              ))}
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-5">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3 text-sm text-blue-400">
                💡 Estos datos aparecen en los resultados de Google cuando buscan tu tienda.
              </div>
              <div>
                <label className={labelCls}>Título SEO</label>
                <input value={config.meta_titulo ?? ""} onChange={(e) => set("meta_titulo", e.target.value)} maxLength={60} className={inputCls} />
                <p className="text-xs text-[var(--admin-fg-subtle)] mt-1">{(config.meta_titulo ?? "").length}/60 caracteres</p>
              </div>
              <div>
                <label className={labelCls}>Descripción SEO</label>
                <textarea value={config.meta_descripcion ?? ""} onChange={(e) => set("meta_descripcion", e.target.value)} maxLength={160} rows={3} className={`${inputCls} resize-none`} />
                <p className="text-xs text-[var(--admin-fg-subtle)] mt-1">{(config.meta_descripcion ?? "").length}/160 caracteres</p>
              </div>
              <div>
                <label className={labelCls}>Vista previa en Google</label>
                <div className="border border-[var(--admin-border)] rounded-xl p-4 bg-white">
                  <p className="text-blue-600 text-base hover:underline cursor-pointer">{config.meta_titulo || config.nombre_tienda || "Nombre de tu tienda"}</p>
                  <p className="text-green-700 text-xs mt-0.5">avax.pe</p>
                  <p className="text-gray-600 text-sm mt-1">{config.meta_descripcion || "Descripción aparecerá aquí..."}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}