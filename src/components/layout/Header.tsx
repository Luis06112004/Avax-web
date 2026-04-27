"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { IconButton } from "@/components/ui/IconButton";

const NAV_ITEMS = [
  { label: "Inicio", href: "/" },
  { label: "Tienda", href: "/tienda" },
  { label: "Marcas", href: "/marcas" },
  { label: "Ofertas", href: "/ofertas" },
  { label: "Componentes", href: "/componentes" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[var(--border)]">
      <div className="container-page flex items-center gap-6 h-20">
        <Link href="/" className="shrink-0 flex items-center">
          <Image
            src="/images/avax-logo.png"
            alt="AVAX"
            width={120}
            height={40}
            priority
            className="h-9 w-auto"
          />
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
          <Input
            icon={<Search size={18} />}
            rounded="pill"
            placeholder="Buscar productos..."
            fullWidth
          />
        </div>

        <div className="flex items-center gap-2">
          <IconButton
            icon={<Search size={18} />}
            label="Buscar"
            className="md:hidden"
          />
          <IconButton icon={<Heart size={18} />} label="Favoritos" />
          <IconButton
            icon={<User size={18} />}
            label="Mi cuenta"
            className="hidden sm:inline-flex"
          />
          <button
            type="button"
            aria-label="Carrito"
            className="relative inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--avax-black)] hover:bg-black text-white transition-colors cursor-pointer"
          >
            <ShoppingCart size={18} />
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-bold rounded-full bg-[var(--avax-blue-light)] text-white">
              2
            </span>
          </button>
          <IconButton
            icon={<Menu size={18} />}
            label="Menú"
            className="lg:hidden"
          />
        </div>
      </div>
    </header>
  );
}
