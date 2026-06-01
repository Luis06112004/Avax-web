"use client";

import { useEffect, useState, useCallback } from "react";
import SectionEditorLayout, {
  PropSection,
} from "@/app/admin/_components/home/SectionEditorLayout";
import DeviceSwitcher, { type DeviceKey } from "@/app/admin/_components/home/DeviceSwitcher";
import { DevicePreview } from "@/app/admin/_components/home/DevicePreview";
import { getSeccionPorTipo, updateSeccion } from "@/lib/home-api";
import { revalidateHome } from "@/lib/revalidate";
import { listProducts, type ShopProduct } from "@/lib/shop-api";

/**
 * Editor del Hero. El Hero es un CARRUSEL DE PRODUCTOS: todo su contenido
 * (nombre, marca, precio, imagen, rating) se arma desde cada producto. Por eso
 * el editor SOLO sirve para elegir qué productos aparecen en el carrusel.
 */
export default function EditorHero() {
  const [seccionId, setSeccionId] = useState<number | null>(null);
  const [productoIds, setProductoIds] = useState<number[]>([]);
  const [device, setDevice] = useState<DeviceKey>("desktop");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [catalogo, setCatalogo] = useState<ShopProduct[]>([]);

  const cargar = useCallback(() => {
    setLoading(true);
    Promise.all([
      getSeccionPorTipo("hero"),
      listProducts({ per_page: 100 }).catch(() => ({ data: [] as ShopProduct[] })),
    ])
      .then(([sec, cat]) => {
        if (sec) {
          setSeccionId(sec.id);
          const cfg = sec.configuracion ?? {};
          setProductoIds((cfg.producto_ids as number[]) ?? []);
        }
        setCatalogo((cat as { data: ShopProduct[] }).data ?? []);
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
        // El Hero no usa título/subtítulo propios: su contenido viene del producto.
        configuracion: { producto_ids: productoIds, limite: productoIds.length || 5 },
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

  // Productos a previsualizar: en el ORDEN en que el admin los eligió.
  const seleccionados =
    productoIds.length > 0
      ? (productoIds
          .map((id) => catalogo.find((p) => Number(p.id) === id))
          .filter(Boolean) as ShopProduct[])
      : catalogo.slice(0, 5);

  const preview = (
    <DevicePreview device={device} payload={{ tipo: "hero", productos: seleccionados }} />
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
        title="Hero principal"
        onSave={guardar}
        saving={saving}
        previewToolbar={<DeviceSwitcher value={device} onChange={setDevice} />}
        preview={preview}
      >
        <PropSection title="Productos del carrusel">
          <p className="text-[11px] text-[var(--admin-fg-subtle)] mb-2">
            Elige los productos que aparecerán en el carrusel principal. El nombre,
            precio, imagen y marca se toman de cada producto. Si no eliges ninguno,
            se muestran los destacados/nuevos automáticamente.
          </p>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-[var(--admin-fg-muted)] font-semibold">
              {productoIds.length} seleccionado{productoIds.length === 1 ? "" : "s"}
            </span>
            {productoIds.length > 0 && (
              <button
                type="button"
                onClick={() => setProductoIds([])}
                className="text-[var(--primary)] hover:underline cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>
          <div className="flex flex-col gap-1.5 max-h-[440px] overflow-y-auto admin-scroll">
            {catalogo.map((p) => {
              const active = productoIds.includes(Number(p.id));
              const orden = productoIds.indexOf(Number(p.id)) + 1;
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
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt="" className="h-9 w-9 rounded object-cover bg-white/5" />
                  ) : (
                    <span className="h-9 w-9 rounded bg-white/5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] text-[var(--admin-fg)]">{p.name}</p>
                    <p className="text-[10px] text-[var(--admin-fg-subtle)]">{p.brand}</p>
                  </div>
                  {active ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white tabular-nums">
                      {orden}
                    </span>
                  ) : (
                    <span className="text-[14px] text-[var(--admin-fg-subtle)]">+</span>
                  )}
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
