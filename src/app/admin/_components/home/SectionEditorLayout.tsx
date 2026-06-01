"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface SectionEditorLayoutProps {
  title: string;
  backHref?: string;
  backLabel?: string;
  onSave: () => void;
  saving: boolean;
  preview: ReactNode;
  children: ReactNode; // panel de propiedades
  previewToolbar?: ReactNode; // toolbar (device switcher)
}

export default function SectionEditorLayout({
  title,
  backHref = "/admin/home",
  backLabel = "Homepage",
  onSave,
  saving,
  preview,
  children,
  previewToolbar,
}: SectionEditorLayoutProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="flex items-center gap-1.5 text-[13px] text-[var(--admin-fg-muted)] transition-colors hover:text-[var(--admin-fg)]"
          >
            <ArrowLeft size={16} />
            {backLabel}
          </Link>
          <span className="text-[var(--admin-border)]">|</span>
          <h1 className="text-[15px] font-bold text-[var(--admin-fg)]">{title}</h1>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--primary-hover)] disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </div>

      {/* Preview (izq) + Propiedades (der) */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden bg-[var(--admin-bg)]">
          {previewToolbar && (
            <div className="flex items-center gap-3 border-b border-[var(--admin-border)] bg-[var(--admin-card)] px-4 py-2.5">
              {previewToolbar}
            </div>
          )}
          <div className="admin-scroll flex flex-1 items-center justify-center overflow-auto p-6">
            {preview}
          </div>
        </div>

        <div className="admin-scroll hidden w-[380px] shrink-0 flex-col overflow-y-auto border-l border-[var(--admin-border)] bg-[var(--admin-card)] lg:flex">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ─── Sección plegable de propiedades ─── */

export function PropSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-[var(--admin-border)]">
      <summary className="flex cursor-pointer items-center justify-between px-5 py-3 text-[13px] font-bold text-[var(--admin-fg)] select-none hover:bg-white/[0.03]">
        {title}
        <span className="text-[var(--admin-fg-subtle)] transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="flex flex-col gap-3 px-5 pb-4">{children}</div>
    </details>
  );
}

/* ─── Inputs reutilizables ─── */

const inputClass =
  "rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-3 py-2 text-[13px] text-[var(--admin-fg)] outline-none transition-colors focus:border-[var(--primary)] placeholder:text-[var(--admin-fg-subtle)]";
const labelClass =
  "text-[11px] font-medium text-[var(--admin-fg-muted)] uppercase tracking-wider";

export function PropInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className={labelClass}>{label}</label>
      {textarea ? (
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </div>
  );
}

export function PropNumberInput({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          className="w-16 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-2 py-1.5 text-center text-[12px] text-[var(--admin-fg)] outline-none transition-colors focus:border-[var(--primary)] tabular-nums"
        />
        {suffix && <span className="text-[11px] text-[var(--admin-fg-subtle)]">{suffix}</span>}
      </div>
    </div>
  );
}

export function PropToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <label className={labelClass}>{label}</label>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
          value ? "bg-[var(--primary)]" : "bg-white/15"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
          style={{ marginTop: "2px" }}
        />
      </button>
    </div>
  );
}

export function PropColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-9 cursor-pointer rounded border border-[var(--admin-border)] bg-transparent"
        />
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-2 py-1.5 text-[11px] text-[var(--admin-fg)] outline-none focus:border-[var(--primary)]"
        />
      </div>
    </div>
  );
}

export function PropSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className={labelClass}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-bg)] px-2 py-1.5 text-[12px] text-[var(--admin-fg)] outline-none focus:border-[var(--primary)] cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[var(--admin-bg)]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function PropImageUpload({
  label,
  value,
  onPick,
  onClear,
}: {
  label: string;
  value: string;
  onPick: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      {value ? (
        <div className="group relative aspect-video w-full overflow-hidden rounded-lg border border-[var(--admin-border)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
            <button
              onClick={onPick}
              className="rounded-lg bg-white px-3 py-1.5 text-[11px] font-semibold text-[var(--avax-black)] cursor-pointer"
            >
              Cambiar
            </button>
            <button
              onClick={onClear}
              className="rounded-lg bg-red-500 px-3 py-1.5 text-[11px] font-semibold text-white cursor-pointer"
            >
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={onPick}
          className="flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-[var(--admin-border)] py-6 text-[var(--admin-fg-subtle)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] cursor-pointer"
        >
          <span className="text-[12px] font-medium">Subir imagen (URL)</span>
        </button>
      )}
    </div>
  );
}
