import Link from "next/link";
import {
  Hammer,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Topbar } from "./Topbar";

type Props = {
  title: string;
  subtitle: string;
  breadcrumbs: { label: string; href?: string }[];
  icon: LucideIcon;
  description: string;
  features: string[];
};

export function ComingSoon({
  title,
  subtitle,
  breadcrumbs,
  icon: Icon,
  description,
  features,
}: Props) {
  return (
    <>
      <Topbar title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} />

      <div className="px-6 lg:px-8 py-10 flex items-start justify-center">
        <div className="w-full max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-8 lg:p-12">
            <div className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 rounded-full bg-[var(--primary)] opacity-20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 w-72 h-72 rounded-full bg-[var(--avax-blue-light)] opacity-15 blur-3xl" />

            <div className="relative flex flex-col items-center text-center gap-5">
              <div className="relative">
                <span className="absolute inset-0 rounded-3xl bg-[var(--primary)]/30 blur-xl animate-pulse" />
                <span className="relative inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--avax-blue-light)] to-[var(--avax-blue-dark)] items-center justify-center text-white shadow-lg">
                  <Icon size={32} />
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold tracking-[0.22em]">
                <Hammer size={12} />
                EN CONSTRUCCIÓN
              </span>

              <div className="flex flex-col gap-2 max-w-lg">
                <h2 className="text-2xl lg:text-3xl font-bold text-[var(--admin-fg)] tracking-tight">
                  Este módulo está en proceso de fabricación
                </h2>
                <p className="text-sm text-[var(--admin-fg-muted)] leading-relaxed">
                  {description}
                </p>
              </div>

              {features.length > 0 && (
                <div className="w-full max-w-md mt-2">
                  <p className="text-[10px] font-bold tracking-[0.22em] text-[var(--admin-fg-subtle)] mb-3">
                    LO QUE INCLUIRÁ
                  </p>
                  <ul className="flex flex-col gap-2 text-left">
                    {features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm text-[var(--admin-fg-muted)] px-3 py-2.5 rounded-lg bg-white/[0.03] border border-[var(--admin-border)]"
                      >
                        <CheckCircle2
                          size={14}
                          className="text-[var(--primary)] mt-0.5 shrink-0"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center gap-3 mt-3 flex-wrap justify-center">
                <Link
                  href="/admin/productos"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-md shadow-[var(--primary)]/25 transition-colors"
                >
                  Ir a Productos
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-[var(--admin-fg)] transition-colors"
                >
                  Volver al Dashboard
                </Link>
              </div>

              <div className="mt-4 pt-5 border-t border-[var(--admin-border)] w-full text-[11px] text-[var(--admin-fg-subtle)] flex items-center justify-center gap-2">
                <Sparkles size={11} />
                Se habilitará cuando el backend Laravel esté disponible.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
