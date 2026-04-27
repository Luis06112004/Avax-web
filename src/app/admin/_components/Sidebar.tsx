"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Layers,
  Tag,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  soon?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const SECTIONS: NavSection[] = [
  {
    title: "MENU",
    items: [{ label: "General", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "CONTENIDO",
    items: [
      { label: "Imágenes del Home", href: "/admin/imagenes", icon: ImageIcon },
      { label: "Banners", href: "/admin/banners", icon: Layers, soon: true },
      { label: "Productos", href: "/admin/productos", icon: ShoppingBag, soon: true },
      { label: "Categorías", href: "/admin/categorias", icon: Tag, soon: true },
      { label: "Clientes", href: "/admin/clientes", icon: Users, soon: true },
    ],
  },
  {
    title: "SISTEMA",
    items: [
      {
        label: "Configuración",
        href: "/admin/configuracion",
        icon: Settings,
        soon: true,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 h-screen sticky top-0 bg-[var(--admin-sidebar)] border-r border-[var(--admin-border)]">
      <div className="px-5 py-5 border-b border-[var(--admin-border)] flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--avax-blue-light)] to-[var(--avax-blue-dark)] flex items-center justify-center text-white font-bold text-sm">
            AS
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[var(--admin-sidebar)]" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-[var(--admin-fg)] truncate">
            Angel Steven
          </span>
          <span className="text-[11px] text-[var(--admin-fg-subtle)] truncate">
            Administrador
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-6">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-2 text-[10px] font-bold tracking-[0.22em] text-[var(--admin-fg-subtle)]">
              {section.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href || pathname?.startsWith(item.href + "/");
                const Icon = item.icon;

                if (item.soon) {
                  return (
                    <li key={item.href}>
                      <button
                        type="button"
                        disabled
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--admin-fg-subtle)] cursor-not-allowed"
                      >
                        <Icon size={16} className="shrink-0" />
                        <span className="flex-1 text-left">{item.label}</span>
                        <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-[var(--admin-fg-subtle)]">
                          PRONTO
                        </span>
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-[var(--primary)] text-white shadow-sm"
                          : "text-[var(--admin-fg-muted)] hover:bg-white/5 hover:text-[var(--admin-fg)]",
                      )}
                    >
                      <Icon size={16} className="shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[var(--admin-border)]">
        <Link
          href="/admin/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--admin-fg-muted)] hover:bg-white/5 hover:text-[var(--admin-fg)] transition-colors"
        >
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </Link>
        <div className="mt-3 px-3 flex items-center gap-2 text-[10px] text-[var(--admin-fg-subtle)]">
          <Sparkles size={10} />
          AVAX CMS · v0.1.0
        </div>
      </div>
    </aside>
  );
}
