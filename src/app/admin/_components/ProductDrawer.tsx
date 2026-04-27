"use client";

import { useEffect, useRef, useState } from "react";
import { X, Upload, Trash2, Save, Image as ImageIcon } from "lucide-react";
import {
  type AdminProduct,
  type ProductBadge,
  type ProductInput,
  type ProductStatus,
  BRANDS,
  CATEGORIES,
  COLORS,
  SIZES,
  STATUS_LABEL,
} from "../_data/productosMock";
import { cn } from "@/lib/utils";

type Mode = "create" | "edit";

type Props = {
  open: boolean;
  mode: Mode;
  initial: AdminProduct | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (data: ProductInput) => void;
};

const EMPTY: ProductInput = {
  sku: "",
  name: "",
  brand: "NIKE",
  category: "Lifestyle",
  description: "",
  price: 0,
  oldPrice: null,
  stock: 0,
  sizes: [],
  colors: [],
  badge: null,
  status: "draft",
  images: [],
};

export function ProductDrawer({
  open,
  mode,
  initial,
  saving,
  onClose,
  onSubmit,
}: Props) {
  const [data, setData] = useState<ProductInput>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initial) {
      const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = initial;
      void _id;
      void _c;
      void _u;
      setData(rest);
    } else {
      setData(EMPTY);
    }
    setErrors({});
  }, [open, mode, initial]);

  const update = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => {
    setData((d) => ({ ...d, [key]: value }));
  };

  const toggleSize = (s: number) => {
    setData((d) => ({
      ...d,
      sizes: d.sizes.includes(s)
        ? d.sizes.filter((x) => x !== s)
        : [...d.sizes, s].sort((a, b) => a - b),
    }));
  };

  const toggleColor = (c: string) => {
    setData((d) => ({
      ...d,
      colors: d.colors.includes(c)
        ? d.colors.filter((x) => x !== c)
        : [...d.colors, c],
    }));
  };

  const handleImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    // Convertimos a data URLs base64 para que el backend pueda persistirlas
    // (los blob: URLs sólo viven en este navegador y serían inútiles).
    const dataUrls = await Promise.all(
      Array.from(files)
        .filter((f) => f.type.startsWith("image/"))
        .map(
          (f) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result));
              reader.onerror = () => reject(reader.error);
              reader.readAsDataURL(f);
            }),
        ),
    );
    setData((d) => ({ ...d, images: [...d.images, ...dataUrls] }));
  };

  const removeImage = (idx: number) => {
    setData((d) => ({ ...d, images: d.images.filter((_, i) => i !== idx) }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Requerido";
    if (!data.sku.trim()) e.sku = "Requerido";
    if (data.price <= 0) e.price = "Debe ser mayor a 0";
    if (data.stock < 0) e.stock = "No puede ser negativo";
    if (data.oldPrice !== null && data.oldPrice <= data.price)
      e.oldPrice = "Debe ser mayor al precio actual";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    onSubmit(data);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={saving ? undefined : onClose}
      />

      <aside className="relative ml-auto w-full sm:w-[560px] h-full bg-[var(--admin-bg)] border-l border-[var(--admin-border)] flex flex-col">
        <header className="flex items-center justify-between px-6 py-5 border-b border-[var(--admin-border)] shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[var(--admin-fg)] tracking-tight">
              {mode === "create" ? "Nuevo producto" : "Editar producto"}
            </h2>
            <p className="text-xs text-[var(--admin-fg-muted)]">
              {mode === "create"
                ? "Completa los datos para publicar el producto."
                : `Editando: ${initial?.name ?? ""}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Cerrar"
            className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--admin-fg-muted)] hover:text-[var(--admin-fg)] flex items-center justify-center transition-colors disabled:opacity-40"
          >
            <X size={16} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
          <Section title="Información básica">
            <Field label="Nombre" error={errors.name}>
              <Input
                value={data.name}
                onChange={(v) => update("name", v)}
                placeholder="Nike Air Max 90 Negro"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="SKU" error={errors.sku}>
                <Input
                  value={data.sku}
                  onChange={(v) => update("sku", v.toUpperCase())}
                  placeholder="NK-AM90-BK"
                />
              </Field>
              <Field label="Estado">
                <Select
                  value={data.status}
                  onChange={(v) => update("status", v as ProductStatus)}
                  options={(["active", "draft", "out_of_stock"] as ProductStatus[]).map(
                    (s) => ({ value: s, label: STATUS_LABEL[s] }),
                  )}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Marca">
                <Select
                  value={data.brand}
                  onChange={(v) => update("brand", v)}
                  options={BRANDS.map((b) => ({ value: b, label: b }))}
                />
              </Field>
              <Field label="Categoría">
                <Select
                  value={data.category}
                  onChange={(v) => update("category", v)}
                  options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                />
              </Field>
            </div>

            <Field label="Descripción">
              <textarea
                value={data.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                placeholder="Detalles, materiales, características..."
                className="w-full bg-white/5 border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--admin-fg)] placeholder:text-[var(--admin-fg-subtle)] outline-none focus:border-[var(--primary)] resize-none"
              />
            </Field>
          </Section>

          <Section title="Precios y stock">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Precio (S/)" error={errors.price}>
                <Input
                  type="number"
                  value={data.price === 0 ? "" : String(data.price)}
                  onChange={(v) => update("price", Number(v) || 0)}
                  placeholder="349"
                />
              </Field>
              <Field label="Antes (S/)" error={errors.oldPrice}>
                <Input
                  type="number"
                  value={data.oldPrice === null ? "" : String(data.oldPrice)}
                  onChange={(v) =>
                    update("oldPrice", v === "" ? null : Number(v))
                  }
                  placeholder="449"
                />
              </Field>
              <Field label="Stock" error={errors.stock}>
                <Input
                  type="number"
                  value={String(data.stock)}
                  onChange={(v) => update("stock", Number(v) || 0)}
                  placeholder="24"
                />
              </Field>
            </div>
          </Section>

          <Section title="Tallas disponibles">
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => {
                const active = data.sizes.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSize(s)}
                    className={cn(
                      "min-w-10 h-10 px-2 rounded-lg text-sm font-bold transition-colors",
                      active
                        ? "bg-[var(--primary)] text-white"
                        : "bg-white/5 text-[var(--admin-fg-muted)] hover:bg-white/10 hover:text-[var(--admin-fg)]",
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Colores">
            <div className="flex items-center flex-wrap gap-3">
              {COLORS.map((c) => {
                const active = data.colors.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleColor(c.id)}
                    aria-label={c.label}
                    title={c.label}
                    className={cn(
                      "w-9 h-9 rounded-full border-2 transition-transform",
                      active
                        ? "border-[var(--primary)] scale-110"
                        : "border-[var(--admin-border)] hover:scale-105",
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
          </Section>

          <Section title="Etiqueta destacada">
            <div className="flex flex-wrap gap-2">
              {(["HOT", "NEW", "SALE", null] as ProductBadge[]).map((b) => {
                const active = data.badge === b;
                return (
                  <button
                    key={b ?? "none"}
                    type="button"
                    onClick={() => update("badge", b)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider transition-colors",
                      active
                        ? "bg-[var(--primary)] text-white"
                        : "bg-white/5 text-[var(--admin-fg-muted)] hover:bg-white/10",
                    )}
                  >
                    {b ?? "SIN ETIQUETA"}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Imágenes del producto">
            <div className="grid grid-cols-3 gap-3">
              {data.images.map((url, i) => (
                <div
                  key={`${url}-${i}`}
                  className="relative aspect-square rounded-lg overflow-hidden bg-[var(--admin-card)] border border-[var(--admin-border)] group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Imagen ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label="Eliminar imagen"
                    className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-[var(--admin-border)] hover:border-[var(--primary)] flex flex-col items-center justify-center gap-1.5 text-[var(--admin-fg-subtle)] hover:text-[var(--admin-fg-muted)] transition-colors"
              >
                <Upload size={18} />
                <span className="text-[10px] font-semibold">Subir</span>
              </button>
            </div>
            {data.images.length === 0 && (
              <div className="flex items-center gap-2 text-[11px] text-[var(--admin-fg-subtle)]">
                <ImageIcon size={12} />
                Aún no hay imágenes. Agrega al menos una para publicar.
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                handleImages(e.target.files);
                e.target.value = "";
              }}
            />
          </Section>
        </div>

        <footer className="px-6 py-4 border-t border-[var(--admin-border)] flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold text-[var(--admin-fg-muted)] hover:text-[var(--admin-fg)] bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-40"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-md shadow-[var(--primary)]/25 disabled:opacity-50 transition-colors"
          >
            <Save size={14} />
            {saving
              ? "Guardando..."
              : mode === "create"
              ? "Crear producto"
              : "Guardar cambios"}
          </button>
        </footer>
      </aside>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[10px] font-bold tracking-[0.22em] text-[var(--admin-fg-subtle)]">
        {title.toUpperCase()}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-[var(--admin-fg-muted)] uppercase tracking-wider">
        {label}
      </span>
      {children}
      {error && (
        <span className="text-[11px] text-red-400 font-medium">{error}</span>
      )}
    </label>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "number";
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--admin-fg)] placeholder:text-[var(--admin-fg-subtle)] outline-none focus:border-[var(--primary)]"
    />
  );
}

function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="w-full bg-white/5 border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-sm text-[var(--admin-fg)] outline-none focus:border-[var(--primary)] cursor-pointer appearance-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-[var(--admin-bg)]">
          {o.label}
        </option>
      ))}
    </select>
  );
}
