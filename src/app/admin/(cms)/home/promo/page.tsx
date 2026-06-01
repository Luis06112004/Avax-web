"use client";

import { useEffect, useState, useCallback } from "react";
import SectionEditorLayout, {
  PropSection,
  PropInput,
} from "@/app/admin/_components/home/SectionEditorLayout";
import DeviceSwitcher, { type DeviceKey } from "@/app/admin/_components/home/DeviceSwitcher";
import { DevicePreview } from "@/app/admin/_components/home/DevicePreview";
import { getSeccionPorTipo, updateSeccion } from "@/lib/home-api";
import { revalidateHome } from "@/lib/revalidate";

export default function EditorPromo() {
  const [seccionId, setSeccionId] = useState<number | null>(null);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [etiqueta, setEtiqueta] = useState("");
  const [botonTexto, setBotonTexto] = useState("");
  const [botonLink, setBotonLink] = useState("");
  const [device, setDevice] = useState<DeviceKey>("desktop");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const cargar = useCallback(() => {
    setLoading(true);
    getSeccionPorTipo("promo_banner")
      .then((sec) => {
        if (sec) {
          setSeccionId(sec.id);
          setTitulo(sec.titulo ?? "");
          setSubtitulo(sec.subtitulo ?? "");
          const cfg = sec.configuracion ?? {};
          setEtiqueta((cfg.etiqueta as string) ?? "");
          setBotonTexto((cfg.boton_texto as string) ?? "");
          setBotonLink((cfg.boton_link as string) ?? "");
        }
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
        configuracion: {
          etiqueta,
          boton_texto: botonTexto,
          boton_link: botonLink,
        },
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

  const preview = (
    <DevicePreview
      device={device}
      payload={{
        tipo: "promo_banner",
        titulo,
        subtitulo,
        config: { etiqueta, boton_texto: botonTexto, boton_link: botonLink },
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
        title="Banner promocional"
        onSave={guardar}
        saving={saving}
        previewToolbar={<DeviceSwitcher value={device} onChange={setDevice} />}
        preview={preview}
      >
        <PropSection title="Contenido">
          <PropInput label="Título" value={titulo} onChange={setTitulo} placeholder={"HASTA\\n40% OFF"} textarea />
          <PropInput label="Subtítulo" value={subtitulo} onChange={setSubtitulo} placeholder="En modelos seleccionados de temporada." />
          <PropInput label="Etiqueta" value={etiqueta} onChange={setEtiqueta} placeholder="OFERTA ESPECIAL" />
        </PropSection>

        <PropSection title="Botón (CTA)">
          <PropInput label="Texto del botón" value={botonTexto} onChange={setBotonTexto} placeholder="Ver ofertas" />
          <PropInput label="Enlace del botón" value={botonLink} onChange={setBotonLink} placeholder="/ofertas" />
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
