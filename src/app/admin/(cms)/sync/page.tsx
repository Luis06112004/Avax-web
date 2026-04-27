"use client";

import { useEffect, useState } from "react";
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
  Plus,
  Pencil,
  Archive,
  Globe,
  Package,
  Tags,
  Image as ImageIcon,
  Activity,
  Timer,
} from "lucide-react";
import { Topbar } from "../../_components/Topbar";
import {
  getLastSync,
  getSyncCambios,
  runSync,
  type SyncCambio,
  type SyncJob,
} from "../../_data/syncApi";

const ECOMMERCE_URL =
  process.env.NEXT_PUBLIC_ECOMMERCE_URL ?? "https://api1.eless.com.pe/api/v1";

function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === undefined) return "—";
  if (seconds < 60) return `${seconds}s`;
  const min = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${min}m ${rest}s`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("es-PE", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function tipoBadge(tipo: SyncCambio["tipo"]) {
  if (tipo === "nuevo") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
        <Plus size={10} /> Nuevo
      </span>
    );
  }
  if (tipo === "actualizado") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
        <Pencil size={10} /> Actualizado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
      <Archive size={10} /> Removido
    </span>
  );
}

function estadoBadge(estado: SyncJob["estado"]) {
  const map: Record<SyncJob["estado"], { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
    completado: {
      label: "Completado",
      cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
      Icon: CheckCircle2,
    },
    en_progreso: {
      label: "En progreso",
      cls: "bg-blue-500/10 text-blue-300 border-blue-500/30",
      Icon: Loader2,
    },
    error: {
      label: "Error",
      cls: "bg-rose-500/10 text-rose-300 border-rose-500/30",
      Icon: XCircle,
    },
    cancelado: {
      label: "Cancelado",
      cls: "bg-slate-500/10 text-slate-300 border-slate-500/30",
      Icon: XCircle,
    },
  };
  const item = map[estado];
  const animate = estado === "en_progreso" ? "animate-spin" : "";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${item.cls}`}
    >
      <item.Icon size={12} className={animate} />
      {item.label}
    </span>
  );
}

export default function SyncPage() {
  const [job, setJob] = useState<SyncJob | null>(null);
  const [cambios, setCambios] = useState<SyncCambio[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLast = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLastSync();
      const last = res.data;
      setJob(last);
      if (last) {
        const detalle = await getSyncCambios(last.id, { per_page: 50 });
        setCambios(detalle.data.cambios);
      } else {
        setCambios([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLast();
  }, []);

  const handleRun = async () => {
    if (running) return;
    setRunning(true);
    setError(null);
    try {
      const res = await runSync();
      setJob(res.data);
      const detalle = await getSyncCambios(res.data.id, { per_page: 50 });
      setCambios(detalle.data.cambios);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  };

  return (
    <>
      <Topbar
        title="Sincronización"
        subtitle="Importa el catálogo desde el e-commerce externo (eless style)."
        breadcrumbs={[{ label: "AVAX CMS" }, { label: "Sistema" }, { label: "Sincronización" }]}
      />

      <div className="px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Card de origen */}
        <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-300 shrink-0">
                <Globe size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--admin-fg)]">
                  Origen: e-commerce eless style
                </h2>
                <p className="text-sm text-[var(--admin-fg-muted)] mt-0.5 break-all">
                  {ECOMMERCE_URL}
                </p>
                <p className="text-xs text-[var(--admin-fg-subtle)] mt-2">
                  La sincronización trae productos, marcas, categorías, tallas e imágenes.
                  Los productos eliminados del origen se marcan como inactivos localmente.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRun}
              disabled={running}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[var(--admin-bg)] font-semibold text-sm hover:bg-slate-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0 cursor-pointer"
            >
              {running ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sincronizando…
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Sincronizar ahora
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            <strong className="font-semibold">Error: </strong>
            {error}
          </div>
        )}

        {/* Última sync — KPIs */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[var(--admin-fg)]">
              Última sincronización
            </h3>
            {job && estadoBadge(job.estado)}
          </div>

          {loading && !job ? (
            <div className="text-sm text-[var(--admin-fg-muted)] py-10 text-center">
              Cargando…
            </div>
          ) : !job ? (
            <div className="rounded-2xl border border-dashed border-[var(--admin-border)] p-10 text-center">
              <p className="text-sm text-[var(--admin-fg-muted)]">
                Aún no se ha realizado ninguna sincronización.
              </p>
              <p className="text-xs text-[var(--admin-fg-subtle)] mt-1">
                Pulsa &quot;Sincronizar ahora&quot; para importar el catálogo.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <KpiCard
                  icon={Package}
                  label="Total productos"
                  value={job.total_productos}
                  tone="default"
                />
                <KpiCard
                  icon={Plus}
                  label="Nuevos"
                  value={job.nuevos}
                  tone="success"
                />
                <KpiCard
                  icon={Pencil}
                  label="Actualizados"
                  value={job.actualizados}
                  tone="warning"
                />
                <KpiCard
                  icon={Archive}
                  label="Removidos"
                  value={job.removidos}
                  tone="danger"
                />
                <KpiCard
                  icon={Activity}
                  label="Sin cambios"
                  value={job.sin_cambios}
                  tone="default"
                />
                <KpiCard
                  icon={Timer}
                  label="Duración"
                  value={formatDuration(job.duracion_segundos)}
                  tone="default"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[var(--admin-fg-muted)]">
                <InfoRow label="Código" value={job.codigo} />
                <InfoRow label="Iniciado" value={formatDate(job.iniciado_at)} />
                <InfoRow label="Terminado" value={formatDate(job.terminado_at)} />
              </div>

              {/* Tabla de cambios */}
              <div className="mt-2 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-card)] overflow-hidden">
                <header className="px-5 py-3 border-b border-[var(--admin-border)] flex items-center gap-2">
                  <Tags size={14} className="text-[var(--admin-fg-muted)]" />
                  <h4 className="text-sm font-semibold text-[var(--admin-fg)]">
                    Cambios detectados
                  </h4>
                  <span className="ml-auto text-xs text-[var(--admin-fg-subtle)]">
                    {cambios.length} de {job.nuevos + job.actualizados + job.removidos}
                  </span>
                </header>
                {cambios.length === 0 ? (
                  <div className="px-5 py-10 text-center text-sm text-[var(--admin-fg-muted)]">
                    No se detectaron cambios.
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--admin-border)]">
                    {cambios.map((c) => (
                      <div
                        key={c.id}
                        className="px-5 py-3 flex items-center gap-4 hover:bg-[var(--admin-card-hover)] transition-colors"
                      >
                        {tipoBadge(c.tipo)}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[var(--admin-fg)] truncate">
                            {c.nombre}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--admin-fg-subtle)] mt-0.5">
                            {c.sku && <span>SKU: {c.sku}</span>}
                            {c.subtipo && (
                              <span className="px-1.5 py-0.5 rounded bg-[var(--admin-card-hover)] text-[var(--admin-fg-muted)]">
                                {c.subtipo}
                              </span>
                            )}
                            <span>{formatDate(c.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Hint */}
        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5 flex items-start gap-3 text-sm">
          <ImageIcon size={18} className="text-[var(--admin-fg-muted)] shrink-0 mt-0.5" />
          <div className="text-[var(--admin-fg-muted)]">
            Las imágenes y tallas se reemplazan en cada sync (son lectura desde el e-commerce).
            Los productos no se editan localmente — para modificar un producto, hazlo en el origen
            y vuelve a sincronizar.
          </div>
        </div>
      </div>
    </>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Package;
  label: string;
  value: number | string;
  tone: "default" | "success" | "warning" | "danger";
}) {
  const tones: Record<typeof tone, string> = {
    default: "bg-[var(--admin-card)] border-[var(--admin-border)] text-[var(--admin-fg)]",
    success: "bg-emerald-500/5 border-emerald-500/20 text-emerald-200",
    warning: "bg-amber-500/5 border-amber-500/20 text-amber-200",
    danger: "bg-rose-500/5 border-rose-500/20 text-rose-200",
  };
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[var(--admin-fg-muted)]">
        <Icon size={12} />
        {label}
      </div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-2.5 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-card)] flex items-center justify-between">
      <span className="text-[var(--admin-fg-subtle)]">{label}</span>
      <span className="text-[var(--admin-fg)] font-medium">{value}</span>
    </div>
  );
}
