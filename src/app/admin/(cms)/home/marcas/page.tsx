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
import { listBrands, type ShopBrand } from "@/lib/shop-api";

export default function EditorMarcas() {
  const [seccionId, setSeccionId] = useState<number | null>(null);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [limite, setLimite] = useState(12);
  const [marcaIds, setMarcaIds] = useState<number[]>([]);
  const [device, setDevice] = useState<DeviceKey>("desktop");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [catalogo, setCatalogo] = useState<ShopBrand[]>([]);

  const cargar = useCallback(() => {
    setLoading(true);
    Promise.all([
      getSeccionPorTipo("marcas"),
      listBrands().catch(() => ({ data: [] as ShopBrand[] })),
    ])
      .then(([sec, br]) => {
        if (sec) {
          setSeccionId(sec.id);
          setTitulo(sec.titulo ?? "");
          setSubtitulo(sec.subtitulo ?? "");
          const cfg = sec.configuracion ?? {};
          setLimite(Number(cfg.limite ?? 12));
          setMarcaIds((cfg.marca_ids as number[]) ?? []);
        }
        setCatalogo((br as { data: ShopBrand[] }).data ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

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
        configuracion: { marca_ids: marcaIds, limite },
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

  const toggleMarca = (id: number) => {
    setMarcaIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const seleccionadas =
    marcaIds.length > 0
      ? catalogo.filter((m) => marcaIds.includes(Number(m.id)))
      : catalogo.slice(0, limite);

  const preview = (
    <DevicePreview
      device={device}
      payload={{
        tipo: "marcas",
        titulo,
        subtitulo,
        marcas: seleccionadas.map((m) => ({
          id: m.id,
          nombre: m.nombre,
          slug: m.slug,
          logo: m.logo,
          productos_count: m.productos_count,
        })),
      }}
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
        title="Marcas"
        onSave={guardar}
        saving={saving}
        previewToolbar={<DeviceSwitcher value={device} onChange={setDevice} />}
        preview={preview}
      >
        <PropSection title="Contenido">
          <PropInput label="Título" value={titulo} onChange={setTitulo} placeholder="Nuestras marcas" />
          <PropInput label="Subtítulo (etiqueta)" value={subtitulo} onChange={setSubtitulo} placeholder="MARCAS DE CONFIANZA" />
          <PropNumberInput label="Límite (auto)" value={limite} onChange={setLimite} min={1} max={30} suffix="marcas" />
        </PropSection>

        <PropSection title="Marcas seleccionadas" defaultOpen={false}>
          <p className="text-[11px] text-[var(--admin-fg-subtle)] mb-1">
            Si no seleccionas ninguna, se muestran las primeras automáticamente.
          </p>
          <div className="flex flex-col gap-1.5 max-h-[360px] overflow-y-auto admin-scroll">
            {catalogo.map((m) => {
              const active = marcaIds.includes(Number(m.id));
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleMarca(Number(m.id))}
                  className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition-colors cursor-pointer ${
                    active
                      ? "border-[var(--primary)] bg-[var(--primary)]/10"
                      : "border-[var(--admin-border)] hover:bg-white/5"
                  }`}
                >
                  {m.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.logo} alt="" className="h-9 w-9 rounded object-contain bg-white/5" />
                  ) : (
                    <span className="h-9 w-9 rounded bg-white/5 flex items-center justify-center text-[9px] font-bold text-[var(--admin-fg-subtle)]">
                      {m.nombre.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] text-[var(--admin-fg)]">{m.nombre}</p>
                    <p className="text-[10px] text-[var(--admin-fg-subtle)]">{m.productos_count} productos</p>
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
