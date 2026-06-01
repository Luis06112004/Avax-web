"use client";

import { useEffect, useState, useCallback } from "react";
import { Info } from "lucide-react";
import SectionEditorLayout, {
  PropSection,
} from "@/app/admin/_components/home/SectionEditorLayout";
import DeviceSwitcher, { type DeviceKey } from "@/app/admin/_components/home/DeviceSwitcher";
import { DevicePreview } from "@/app/admin/_components/home/DevicePreview";
import { getSeccionPorTipo, updateSeccion } from "@/lib/home-api";
import { revalidateHome } from "@/lib/revalidate";

/**
 * Editor para secciones de contenido ESTÁTICO (testimonios, instagram).
 * Estos componentes no aceptan props: su contenido está predefinido en código.
 * Por eso no se ofrecen campos editables (no tendrían efecto en la home);
 * solo se muestra el preview real y un mensaje informativo. El botón Guardar
 * queda como acción inocua (revalida la home) por consistencia del layout.
 */
export function SimpleTextEditor({
  tipo,
  title,
}: {
  tipo: string;
  title: string;
}) {
  const [seccionId, setSeccionId] = useState<number | null>(null);
  const [device, setDevice] = useState<DeviceKey>("desktop");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const cargar = useCallback(() => {
    setLoading(true);
    getSeccionPorTipo(tipo)
      .then((sec) => {
        if (sec) setSeccionId(sec.id);
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
      await updateSeccion(seccionId, { configuracion: {} });
      await revalidateHome();
      setToast("Guardado correctamente");
    } catch {
      setToast("Error al guardar");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const preview = <DevicePreview device={device} payload={{ tipo }} />;

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
          <div className="flex items-start gap-2.5 rounded-lg border border-[var(--admin-border)] bg-white/5 p-3">
            <Info size={16} className="mt-0.5 shrink-0 text-[var(--admin-fg-subtle)]" />
            <p className="text-[12px] leading-relaxed text-[var(--admin-fg-subtle)]">
              Esta sección usa contenido predefinido. Puedes activarla o
              desactivarla desde el panel de Homepage. Para editar su contenido,
              contacta a desarrollo.
            </p>
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
