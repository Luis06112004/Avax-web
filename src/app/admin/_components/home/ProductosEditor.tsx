"use client";

import { useEffect, useState, useCallback } from "react";
import SectionEditorLayout, {
  PropSection,
  PropInput,
  PropNumberInput,
} from "@/app/admin/_components/home/SectionEditorLayout";
import DeviceSwitcher, { type DeviceKey } from "@/app/admin/_components/home/DeviceSwitcher";
import { DevicePreview } from "@/app/admin/_components/home/DevicePreview";
import { getSeccionPorTipo, updateSeccion } from "@/lib/home-api";
import { revalidateHome } from "@/lib/revalidate";
import { listFeatured, type ShopProduct } from "@/lib/shop-api";

/** Editor compartido para secciones de carrusel de productos (destacados/nuevos). */
export function ProductosEditor({ tipo, title }: { tipo: string; title: string }) {
  const [seccionId, setSeccionId] = useState<number | null>(null);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [limite, setLimite] = useState(8);
  const [productoIds, setProductoIds] = useState<number[]>([]);
  const [device, setDevice] = useState<DeviceKey>("desktop");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [catalogo, setCatalogo] = useState<ShopProduct[]>([]);

  const cargar = useCallback(() => {
    setLoading(true);
    Promise.all([getSeccionPorTipo(tipo), listFeatured().catch(() => ({ data: [] }))])
      .then(([sec, cat]) => {
        if (sec) {
          setSeccionId(sec.id);
          setTitulo(sec.titulo ?? "");
          setSubtitulo(sec.subtitulo ?? "");
          const cfg = sec.configuracion ?? {};
          setLimite(Number(cfg.limite ?? 8));
          setProductoIds((cfg.producto_ids as number[]) ?? []);
        }
        setCatalogo((cat as { data: ShopProduct[] }).data ?? []);
      })
      .finally(() => setLoading(false));
  }, [tipo]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const guardar = async () => {
    if (!seccionId) return;
    setSaving(true);
    try {
      await updateSeccion(seccionId, {
        titulo,
        subtitulo,
        configuracion: { producto_ids: productoIds, limite },
      });
      await revalidateHome();
      setToast("Guardado correctamente");
    } catch {
      setToast("Error al guardar");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const toggleProducto = (id: number) => {
    setProductoIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // Productos a previsualizar: los seleccionados, o el catálogo (auto)
  const previewProductos =
    productoIds.length > 0
      ? catalogo.filter((p) => productoIds.includes(Number(p.id)))
      : catalogo.slice(0, limite);

  const preview = (
    <DevicePreview
      device={device}
      payload={{ tipo, titulo, subtitulo, productos: previewProductos }}
    />
  );

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center h-screen text-[var(--admin-fg-subtle)]">
        Cargando editor...
      </div>
    );
  }

  return (
    <>
      <SectionEditorLayout
        title={title}
        onSave={guardar}
        saving={saving}
        previewToolbar={<DeviceSwitcher value={device} onChange={setDevice} />}
        preview={preview}
      >
        <PropSection title="Contenido">
          <PropInput label="Título" value={titulo} onChange={setTitulo} placeholder="Lo más vendido" />
          <PropInput label="Subtítulo (etiqueta)" value={subtitulo} onChange={setSubtitulo} placeholder="DESTACADOS" />
          <PropNumberInput label="Límite (auto)" value={limite} onChange={setLimite} min={1} max={20} suffix="prod" />
        </PropSection>

        <PropSection title="Productos seleccionados" defaultOpen={false}>
          <p className="text-[11px] text-[var(--admin-fg-subtle)] mb-1">
            Si no seleccionas ninguno, se muestran automáticamente los más recientes.
          </p>
          <div className="flex flex-col gap-1.5 max-h-[360px] overflow-y-auto admin-scroll">
            {catalogo.map((p) => {
              const active = productoIds.includes(Number(p.id));
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleProducto(Number(p.id))}
                  className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition-colors cursor-pointer ${
                    active
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : "border-[var(--admin-border)] hover:bg-white/5"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" className="h-9 w-9 rounded object-cover bg-white/5" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] text-[var(--admin-fg)]">{p.name}</p>
                    <p className="text-[10px] text-[var(--admin-fg-subtle)]">{p.brand}</p>
                  </div>
                  <span className={`text-[10px] font-bold ${active ? "text-[var(--primary)]" : "text-[var(--admin-fg-subtle)]"}`}>
                    {active ? "✓" : "+"}
                  </span>
                </button>
              );
            })}
          </div>
        </PropSection>
      </SectionEditorLayout>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-sm font-medium text-emerald-200">
          {toast}
        </div>
      )}
    </>
  );
}
