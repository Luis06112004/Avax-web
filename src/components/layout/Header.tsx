"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, LogOut, Menu, ShoppingCart, User as UserIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { SearchBar } from "@/components/layout/SearchBar";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Tienda", href: "/tienda" },
  { label: "Marcas", href: "/marcas" },
  { label: "Ofertas", href: "/ofertas" },
];

export function Header() {
  const { totalItems, openDrawer } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("")
    : "";

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[var(--border)]">
      <div className="container-page flex items-center gap-4 lg:gap-6 h-20">
        <Link href="/" className="shrink-0 flex items-center group">
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
            transition={{
              clipPath: { duration: 1.1, ease: [0.65, 0, 0.35, 1], delay: 0.15 },
              opacity: { duration: 0.3, delay: 0.15 },
            }}
            whileHover={{ scale: 1.04, transition: { duration: 0.25 } }}
            whileTap={{ scale: 0.96 }}
            className="origin-left"
          >
            <Image
              src="/images/avax-logo.png"
              alt="AVAX"
              width={200}
              height={60}
              priority
              className="h-12 lg:h-14 w-auto select-none"
            />
          </motion.div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--avax-black)] rounded-md transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1 max-w-md ml-auto hidden md:block">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <IconButton
            icon={<Menu size={18} />}
            label="Menú"
            className="md:hidden"
            onClick={() => setMobileSearchOpen((s) => !s)}
          />
          <IconButton
            icon={<Heart size={18} />}
            label="Favoritos"
            className="hidden sm:inline-flex"
          />

          {isAuthenticated ? (
            <div ref={accountRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                aria-label="Mi cuenta"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] text-sm font-extrabold hover:bg-[var(--primary)] hover:text-white transition-colors cursor-pointer"
              >
                {initials || <UserIcon size={18} />}
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-[var(--border)] overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[var(--border)]">
                    <p className="text-sm font-bold text-[var(--avax-black)] line-clamp-1">
                      {user?.name}
                    </p>
                    <p className="text-xs text-[var(--foreground-muted)] line-clamp-1">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    href="/mis-pedidos"
                    onClick={() => setAccountOpen(false)}
                    className="block px-4 py-2.5 text-sm hover:bg-[var(--surface-2)]"
                  >
                    Mis pedidos
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      setAccountOpen(false);
                      await logout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[var(--surface-2)] cursor-pointer"
                  >
                    <LogOut size={14} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--foreground)] transition-colors"
              aria-label="Iniciar sesión"
            >
              <UserIcon size={18} />
            </Link>
          )}

          <button
            type="button"
            aria-label="Carrito"
            onClick={openDrawer}
            className="relative inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--avax-black)] hover:bg-black text-white transition-colors cursor-pointer"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-bold rounded-full bg-[var(--avax-blue-light)] text-white">
                {totalItems}
              </span>
            )}
          </button>
          <IconButton
            icon={mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            label="Menú"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen((s) => !s)}
          />
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-white px-4 py-3">
          <SearchBar autoFocus onSubmitted={() => setMobileSearchOpen(false)} />
        </div>
      )}

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[var(--border)] bg-white">
          <nav className="container-page py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2.5 text-sm font-semibold text-[var(--avax-black)] hover:bg-[var(--surface-2)] rounded-md"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
