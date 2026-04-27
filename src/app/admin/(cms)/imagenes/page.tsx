"use client";

import { useRef, useState } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Save,
  Undo2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Topbar } from "../../_components/Topbar";
import { cn } from "@/lib/utils";

type Slot = {
  id: string;
  label: string;
  recommended: string;
  current: string | null;
  pendingPreview?: string | null;
};

type Layout =
  | "hero"
  | "wide"
  | "grid-2"
  | "grid-3"
  | "grid-4"
  | "grid-5"
  | "grid-9";

type Section = {
  id: string;
  title: string;
  description: string;
  layout: Layout;
  aspect?: string;
  slots: Slot[];
};

const INITIAL_SECTIONS: Section[] = [
  {
    id: "hero",
    title: "Hero principal",
    description:
      "Imagen grande arriba del home. Recomendado: 1920×800 px, JPG o WebP optimizado.",
    layout: "hero",
    slots: [
      { id: "hero-1", label: "Hero", recommended: "1920×800", current: null },
    ],
  },
  {
    id: "popular",
    title: "Lo más popular esta semana",
    description: "3 productos destacados en la sección 'Trending Ahora'.",
    layout: "grid-3",
    aspect: "aspect-[4/5]",
    slots: [
      {
        id: "pop-p1",
        label: "Nike Air Max SC",
        recommended: "800×1000",
        current: null,
      },
      {
        id: "pop-p2",
        label: "Adidas Forum Low",
        recommended: "800×1000",
        current: null,
      },
      {
        id: "pop-p3",
        label: "New Balance 574",
        recommended: "800×1000",
        current: null,
      },
    ],
  },
  {
    id: "promo",
    title: "Banner promocional — 50% OFF",
    description: "Banner secundario con la oferta limitada.",
    layout: "wide",
    slots: [
      { id: "promo-1", label: "Banner Promo", recommended: "1200×400", current: null },
    ],
  },
  {
    id: "promo-grid",
    title: "+200 modelos disponibles",
    description: "Grid de 9 zapatillas miniatura del banner promocional derecho.",
    layout: "grid-9",
    aspect: "aspect-square",
    slots: Array.from({ length: 9 }, (_, i) => ({
      id: `pg-${i + 1}`,
      label: `Modelo ${i + 1}`,
      recommended: "300×300",
      current: null,
    })),
  },
  {
    id: "releases",
    title: "Nuevos Lanzamientos",
    description: "2 drops destacados de la temporada 2026.",
    layout: "grid-2",
    aspect: "aspect-[5/4]",
    slots: [
      {
        id: "rel-jordan",
        label: "Air Jordan 3 Retro",
        recommended: "1000×800",
        current: null,
      },
      {
        id: "rel-yeezy",
        label: "Yeezy Boost 350 V2",
        recommended: "1000×800",
        current: null,
      },
    ],
  },
  {
    id: "featured",
    title: "Productos Destacados",
    description: "4 zapatillas seleccionadas por el equipo.",
    layout: "grid-4",
    aspect: "aspect-[4/5]",
    slots: [
      {
        id: "feat-f1",
        label: "Nike Dunk Low",
        recommended: "800×1000",
        current: null,
      },
      { id: "feat-f2", label: "NB 9060", recommended: "800×1000", current: null },
      {
        id: "feat-f3",
        label: "Air Max 90",
        recommended: "800×1000",
        current: null,
      },
      { id: "feat-f4", label: "Samba OG", recommended: "800×1000", current: null },
    ],
  },
  {
    id: "brands",
    title: "Logos de marcas",
    description: "Logos de Nike, Adidas y New Balance del banner de marcas.",
    layout: "grid-3",
    aspect: "aspect-[5/2]",
    slots: [
      { id: "brand-nike", label: "Nike", recommended: "200×80", current: null },
      {
        id: "brand-adidas",
        label: "Adidas",
        recommended: "200×80",
        current: null,
      },
      {
        id: "brand-nb",
        label: "New Balance",
        recommended: "200×80",
        current: null,
      },
    ],
  },
  {
    id: "instagram",
    title: "Feed de Instagram",
    description: "5 fotos lifestyle al final del home.",
    layout: "grid-5",
    aspect: "aspect-square",
    slots: Array.from({ length: 5 }, (_, i) => ({
      id: `ig-${i + 1}`,
      label: `Foto ${i + 1}`,
      recommended: "600×600",
      current: null,
    })),
  },
];

const LAYOUT_GRID: Record<Layout, string> = {
  hero: "grid grid-cols-1",
  wide: "grid grid-cols-1",
  "grid-2": "grid grid-cols-1 sm:grid-cols-2 gap-4",
  "grid-3": "grid grid-cols-1 sm:grid-cols-3 gap-4",
  "grid-4": "grid grid-cols-2 sm:grid-cols-4 gap-4",
  "grid-5": "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4",
  "grid-9": "grid grid-cols-3 gap-3",
};

function aspectFor(section: Section): string {
  if (section.aspect) return section.aspect;
  if (section.layout === "hero") return "aspect-[12/5]";
  if (section.layout === "wide") return "aspect-[3/1]";
  return "aspect-square";
}

export default function ImagenesPage() {
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [saving, setSaving] = useState(false);
  const [savedRecently, setSavedRecently] = useState(false);

  const pendingCount = sections.reduce(
    (acc, s) => acc + s.slots.filter((slot) => slot.pendingPreview).length,
    0,
  );

  const updateSlot = (
    sectionId: string,
    slotId: string,
    patch: Partial<Slot>,
  ) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId
          ? s
          : {
              ...s,
              slots: s.slots.map((slot) =>
                slot.id !== slotId ? slot : { ...slot, ...patch },
              ),
            },
      ),
    );
  };

  const handleFile = (sectionId: string, slotId: string, file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateSlot(sectionId, slotId, { pendingPreview: url });
    setSavedRecently(false);
  };

  const handleDiscardSlot = (sectionId: string, slotId: string) => {
    updateSlot(sectionId, slotId, { pendingPreview: null });
  };

  const handleDiscardAll = () => {
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        slots: s.slots.map((slot) => ({ ...slot, pendingPreview: null })),
      })),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: para cada slot con pendingPreview, hacer POST /api/admin/imagenes con FormData (Laravel)
    await new Promise((r) => setTimeout(r, 1000));
    setSections((prev) =>
      prev.map((s) => ({
        ...s,
        slots: s.slots.map((slot) =>
          slot.pendingPreview
            ? { ...slot, current: slot.pendingPreview, pendingPreview: null }
            : slot,
        ),
      })),
    );
    setSaving(false);
    setSavedRecently(true);
  };

  return (
    <>
      <Topbar
        title="Imágenes del Home"
        subtitle="Cambia las imágenes que se muestran en la tienda pública."
        breadcrumbs={[
          { label: "AVAX CMS", href: "/admin/dashboard" },
          { label: "Contenido" },
          { label: "Imágenes del Home" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {pendingCount > 0 && (
              <button
                type="button"
                onClick={handleDiscardAll}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-[var(--admin-fg-muted)] hover:text-[var(--admin-fg)] bg-white/5 hover:bg-white/10 transition-colors"
              >
                <Undo2 size={14} />
                Descartar
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={pendingCount === 0 || saving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md shadow-[var(--primary)]/20"
            >
              <Save size={14} />
              {saving
                ? "Guardando..."
                : `Guardar cambios${pendingCount > 0 ? ` (${pendingCount})` : ""}`}
            </button>
          </div>
        }
      />

      {(pendingCount > 0 || savedRecently) && (
        <div className="px-6 lg:px-8 pt-6">
          {pendingCount > 0 ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
              <AlertTriangle size={16} className="shrink-0" />
              Tienes <strong className="font-semibold">{pendingCount}</strong>{" "}
              {pendingCount === 1 ? "imagen" : "imágenes"} sin guardar. Pulsa{" "}
              <span className="font-semibold">Guardar cambios</span> arriba para
              aplicarlas.
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
              <Check size={16} className="shrink-0" />
              Cambios guardados correctamente.
            </div>
          )}
        </div>
      )}

      <div className="px-6 lg:px-8 py-8 flex flex-col gap-10">
        {sections.map((section) => (
          <section key={section.id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[var(--admin-fg)] tracking-tight">
                  {section.title}
                </h2>
                <p className="text-xs text-[var(--admin-fg-muted)] mt-0.5">
                  {section.description}
                </p>
              </div>
              <span className="text-[10px] font-bold tracking-wider px-2 py-1 rounded bg-white/5 text-[var(--admin-fg-subtle)] shrink-0">
                {section.slots.length}{" "}
                {section.slots.length === 1 ? "IMG" : "IMGS"}
              </span>
            </div>

            <div className={LAYOUT_GRID[section.layout]}>
              {section.slots.map((slot) => (
                <ImageSlotCard
                  key={slot.id}
                  slot={slot}
                  aspectClass={aspectFor(section)}
                  onChange={(file) => handleFile(section.id, slot.id, file)}
                  onDiscard={() => handleDiscardSlot(section.id, slot.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function ImageSlotCard({
  slot,
  aspectClass,
  onChange,
  onDiscard,
}: {
  slot: Slot;
  aspectClass: string;
  onChange: (file: File | null) => void;
  onDiscard: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const previewUrl = slot.pendingPreview || slot.current;
  const isPending = !!slot.pendingPreview;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file?.type.startsWith("image/")) onChange(file);
      }}
      className={cn(
        "group relative rounded-xl overflow-hidden bg-[var(--admin-card)] border cursor-pointer transition-all outline-none",
        aspectClass,
        dragOver
          ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/40"
          : isPending
          ? "border-amber-500/60"
          : "border-[var(--admin-border)] hover:border-[var(--primary)] focus:border-[var(--primary)]",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file);
          e.target.value = "";
        }}
      />

      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt={slot.label}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-[var(--admin-fg-subtle)] gap-2 p-2">
          <ImageIcon size={24} />
          <span className="text-[10px] text-center leading-tight">Sin imagen</span>
        </div>
      )}

      {isPending && (
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/95 text-[10px] font-bold text-white tracking-wider z-10">
          PENDIENTE
        </span>
      )}

      <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white p-2 text-center">
        <Upload size={20} />
        <span className="text-xs font-semibold">
          Click o arrastra para cambiar
        </span>
      </div>

      {isPending && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDiscard();
          }}
          aria-label="Descartar cambio"
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/65 hover:bg-black text-white flex items-center justify-center transition-colors z-10"
        >
          <X size={14} />
        </button>
      )}

      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 flex items-end justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold text-white truncate">
            {slot.label}
          </p>
          <p className="text-[9px] text-white/60">{slot.recommended}</p>
        </div>
      </div>
    </div>
  );
}
