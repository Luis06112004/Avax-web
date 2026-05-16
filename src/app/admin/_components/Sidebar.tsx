"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Layers,
  Tag,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Sparkles,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  adminLogout,
  clearAdminSession,
  getAdminToken,
  getAdminUser,
  type AdminUser,
} from "@/lib/admin-auth";

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
    items: [
      { label: "General", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "CONTENIDO",
    items: [
      { label: "Productos", href: "/admin/productos", icon: ShoppingBag },
      { label: "Usuarios", href: "/admin/usuarios", icon: Users }, // <-- AÑADIDO Y ACTIVO
      { label: "Categorías", href: "/admin/categorias", icon: Tag, soon: true },
      { label: "Banners", href: "/admin/banners", icon: Layers, soon: true },
      { label: "Clientes", href: "/admin/clientes", icon: Users, soon: true },
    ],
  },
  {
    title: "SISTEMA",
    items: [
      { label: "Sincronización", href: "/admin/sync", icon: RefreshCw },
      {
        label: "Configuración",
        href: "/admin/configuracion",
        icon: Settings,
        soon: true,
      },
    ],
  },
];

function getInitials(name?: string | null): string {
  if (!name) return "AV";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AV";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    setUser(getAdminUser());
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (signingOut) return;
    setSigningOut(true);
    const token = getAdminToken();
    // Limpiamos localmente primero para que el guard del /admin/login no
    // nos rebote de vuelta al dashboard.
    clearAdminSession();
    if (token) {
      try {
        await adminLogout(token);
      } catch {
        // Si la revocación remota falla seguimos: la sesión local ya está limpia.
      }
    }
    router.replace("/admin/login");
  };

  const displayName = user?.name ?? "Sin sesión";
  const displayCargo =
    user?.cargo ?? (user?.role === "admin" ? "Administrador" : "");

  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 h-screen sticky top-0 bg-[var(--admin-sidebar)] border-r border-[var(--admin-border)]">
      <div className="px-5 py-5 border-b border-[var(--admin-border)] flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--avax-blue-light)] to-[var(--avax-blue-dark)] flex items-center justify-center text-white font-bold text-sm">
            {getInitials(user?.name)}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[var(--admin-sidebar)]" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-[var(--admin-fg)] truncate">
            {displayName}
          </span>
          <span className="text-[11px] text-[var(--admin-fg-subtle)] truncate">
            {displayCargo}
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
                  pathname === item.href ||
                  pathname?.startsWith(item.href + "/");
                const Icon = item.icon;

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
                      <span className="flex-1">{item.label}</span>
                      {item.soon && (
                        <span
                          className={cn(
                            "text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded",
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-white/5 text-[var(--admin-fg-subtle)]",
                          )}
                        >
                          PRONTO
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[var(--admin-border)]">
        <button
          type="button"
          onClick={handleLogout}
          disabled={signingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--admin-fg-muted)] hover:bg-white/5 hover:text-[var(--admin-fg)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <LogOut size={16} />
          <span>{signingOut ? "Cerrando sesión..." : "Cerrar sesión"}</span>
        </button>
        <div className="mt-3 px-3 flex items-center gap-2 text-[10px] text-[var(--admin-fg-subtle)]">
          <Sparkles size={10} />
          AVAX CMS · v0.1.0
        </div>
      </div>
    </aside>
  );
}
