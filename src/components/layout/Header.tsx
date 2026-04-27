"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  User as UserIcon,
  X,
} from "lucide-react";
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

  // Bloquear scroll del body cuando el drawer mobile esta abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("")
    : "";

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[var(--border)]">
        <div className="container-page flex items-center gap-4 lg:gap-6 h-24">
          <Link href="/" className="shrink-0 flex items-center group">
            <motion.div
              initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
              animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
              transition={{
                clipPath: {
                  duration: 1.1,
                  ease: [0.65, 0, 0.35, 1],
                  delay: 0.15,
                },
                opacity: { duration: 0.3, delay: 0.15 },
              }}
              whileHover={{ scale: 1.04, transition: { duration: 0.25 } }}
              whileTap={{ scale: 0.96 }}
              className="origin-left"
            >
              <Image
                src="/images/avax-logo.png"
                alt="AVAX"
                width={260}
                height={80}
                priority
                className="h-16 lg:h-20 w-auto select-none"
              />
            </motion.div>
          </Link>

          {/* NAV desktop */}
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

          {/* SEARCH desktop */}
          <div className="flex-1 max-w-md ml-auto hidden md:block">
            <SearchBar />
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2 ml-auto md:ml-0">
            {/* Lupa solo mobile */}
            <IconButton
              icon={<Search size={18} />}
              label="Buscar"
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

            {/* Menu hamburguesa solo mobile */}
            <IconButton
              icon={<Menu size={18} />}
              label="Menú"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            />
          </div>
        </div>

        {/* Search drop-down mobile (debajo del header) */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.65, 0, 0.35, 1] }}
              className="md:hidden border-t border-[var(--border)] bg-white overflow-hidden"
            >
              <div className="px-4 py-3">
                <SearchBar
                  autoFocus
                  onSubmitted={() => setMobileSearchOpen(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Drawer lateral derecho con menu mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.32, ease: [0.65, 0, 0.35, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[82vw] max-w-sm bg-white shadow-2xl flex flex-col lg:hidden"
            >
              {/* Header del drawer */}
              <div className="h-24 flex items-center justify-between px-5 border-b border-[var(--border)]">
                <Image
                  src="/images/avax-logo.png"
                  alt="AVAX"
                  width={180}
                  height={60}
                  className="h-12 w-auto"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Cerrar menú"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--surface-2)] hover:bg-[var(--surface-3)] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Cuenta del usuario */}
              <div className="px-5 py-4 border-b border-[var(--border)]">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] font-extrabold flex items-center justify-center">
                      {initials || <UserIcon size={20} />}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-[var(--avax-black)] truncate">
                        {user?.name}
                      </span>
                      <span className="text-xs text-[var(--foreground-muted)] truncate">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-3)] transition-colors"
                  >
                    <UserIcon size={18} className="text-[var(--avax-black)]" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[var(--avax-black)]">
                        Iniciar sesión
                      </span>
                      <span className="text-xs text-[var(--foreground-muted)]">
                        Accede para ver tus pedidos
                      </span>
                    </div>
                  </Link>
                )}
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-3 py-3">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-3 text-base font-bold text-[var(--avax-black)] hover:bg-[var(--surface-2)] rounded-xl"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="border-t border-[var(--border)] my-3" />

                <Link
                  href="/mis-pedidos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-3 text-sm font-semibold text-[var(--foreground-muted)] hover:bg-[var(--surface-2)] rounded-xl"
                >
                  Mis pedidos
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left flex items-center gap-2 px-3 py-3 text-sm font-semibold text-[var(--foreground-muted)] hover:bg-[var(--surface-2)] rounded-xl"
                >
                  <Heart size={16} />
                  Favoritos
                </button>

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-3 text-sm font-semibold text-[var(--danger)] hover:bg-[var(--surface-2)] rounded-xl mt-2"
                  >
                    <LogOut size={16} />
                    Cerrar sesión
                  </button>
                )}
              </nav>

              {/* Footer con redes */}
              <div className="px-5 py-4 border-t border-[var(--border)] text-xs text-[var(--foreground-subtle)]">
                © 2026 AVAX · @avax_pe
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
