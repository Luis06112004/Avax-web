import Link from "next/link";
import { Bell, Search } from "lucide-react";

type Crumb = { label: string; href?: string };

type Props = {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
};

export function Topbar({ title, subtitle, breadcrumbs, actions }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-[var(--admin-bg)]/85 backdrop-blur-md border-b border-[var(--admin-border)]">
      <div className="flex items-center gap-6 px-6 lg:px-8 h-20">
        <div className="flex flex-col min-w-0 flex-shrink">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1.5 text-[11px] text-[var(--admin-fg-subtle)] mb-0.5">
              {breadcrumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {c.href ? (
                    <Link
                      href={c.href}
                      className="hover:text-[var(--admin-fg-muted)] transition-colors"
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span>{c.label}</span>
                  )}
                  {i < breadcrumbs.length - 1 && <span>/</span>}
                </span>
              ))}
            </nav>
          )}
          <h1 className="text-lg font-bold text-[var(--admin-fg)] tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[var(--admin-fg-muted)] truncate">{subtitle}</p>
          )}
        </div>

        <div className="hidden xl:flex items-center gap-2 ml-auto flex-1 max-w-sm">
          <div className="relative w-full">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-fg-subtle)]"
            />
            <input
              type="text"
              placeholder="Buscar en el panel..."
              className="w-full bg-white/5 border border-[var(--admin-border)] rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--admin-fg)] placeholder:text-[var(--admin-fg-subtle)] outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto xl:ml-0 shrink-0">
          {actions}
          <button
            type="button"
            aria-label="Notificaciones"
            className="relative w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--admin-fg-muted)] hover:text-[var(--admin-fg)] flex items-center justify-center transition-colors"
          >
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--avax-blue-light)]" />
          </button>
        </div>
      </div>
    </header>
  );
}
