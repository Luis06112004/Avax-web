"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

type ShopProduct = Product & {
  category: string;
  sizes: number[];
  colorTags: string[];
};

const PRODUCTS: ShopProduct[] = [
  {
    id: "s1",
    slug: "nike-dunk-low",
    name: "Nike Dunk Low",
    brand: "NIKE",
    price: 549,
    image: "",
    rating: 4.9,
    badge: "HOT",
    category: "Lifestyle",
    sizes: [38, 39, 40, 41, 42, 43],
    colorTags: ["black", "white"],
  },
  {
    id: "s2",
    slug: "adidas-superstar",
    name: "Adidas Superstar",
    brand: "ADIDAS",
    price: 359,
    image: "",
    rating: 5.0,
    badge: "NEW",
    category: "Lifestyle",
    sizes: [39, 40, 41, 42],
    colorTags: ["white"],
  },
  {
    id: "s3",
    slug: "nb-574",
    name: "New Balance 574",
    brand: "NEW BALANCE",
    price: 489,
    image: "",
    rating: 4.8,
    category: "Casual",
    sizes: [40, 41, 42, 43],
    colorTags: ["white", "blue"],
  },
  {
    id: "s4",
    slug: "jordan-1-mid",
    name: "Jordan 1 Mid",
    brand: "JORDAN",
    price: 489,
    image: "",
    rating: 5.0,
    badge: "HOT",
    category: "Basketball",
    sizes: [40, 41, 42, 43, 44],
    colorTags: ["blue", "white"],
  },
  {
    id: "s5",
    slug: "converse-chuck-70",
    name: "Converse Chuck 70",
    brand: "CONVERSE",
    price: 339,
    image: "",
    rating: 4.6,
    category: "Casual",
    sizes: [38, 39, 40, 41, 42],
    colorTags: ["black"],
  },
  {
    id: "s6",
    slug: "puma-suede-classic",
    name: "Puma Suede Classic",
    brand: "PUMA",
    price: 299,
    image: "",
    rating: 4.5,
    category: "Lifestyle",
    sizes: [39, 40, 41, 42, 43],
    colorTags: ["blue"],
  },
  {
    id: "s7",
    slug: "nike-air-force-1",
    name: "Nike Air Force 1",
    brand: "NIKE",
    price: 424,
    oldPrice: 529,
    image: "",
    rating: 4.9,
    category: "Lifestyle",
    sizes: [38, 39, 40, 41, 42, 43, 44],
    colorTags: ["white"],
  },
  {
    id: "s8",
    slug: "adidas-gazelle",
    name: "Adidas Gazelle",
    brand: "ADIDAS",
    price: 459,
    image: "",
    rating: 5.0,
    category: "Lifestyle",
    sizes: [39, 40, 41, 42],
    colorTags: ["white", "green"],
  },
  {
    id: "s9",
    slug: "reebok-classic",
    name: "Reebok Classic",
    brand: "REEBOK",
    price: 299,
    image: "",
    rating: 4.7,
    category: "Running",
    sizes: [40, 41, 42, 43],
    colorTags: ["white"],
  },
  {
    id: "s10",
    slug: "nike-air-max-sc",
    name: "Nike Air Max SC",
    brand: "NIKE",
    price: 349,
    oldPrice: 449,
    discountLabel: "-22%",
    image: "",
    rating: 4.9,
    category: "Running",
    sizes: [40, 41, 42, 43],
    colorTags: ["black", "white"],
  },
  {
    id: "s11",
    slug: "adidas-forum-low",
    name: "Adidas Forum Low",
    brand: "ADIDAS",
    price: 329,
    oldPrice: 399,
    image: "",
    rating: 4.8,
    category: "Skate",
    sizes: [39, 40, 41, 42],
    colorTags: ["white", "red"],
  },
  {
    id: "s12",
    slug: "nb-9060",
    name: "NB 9060",
    brand: "NEW BALANCE",
    price: 459,
    image: "",
    rating: 4.8,
    category: "Lifestyle",
    sizes: [40, 41, 42, 43],
    colorTags: ["black"],
  },
];

const CATEGORIES = ["Running", "Lifestyle", "Skate", "Basketball", "Casual"];
const BRANDS = [
  "NIKE",
  "ADIDAS",
  "NEW BALANCE",
  "PUMA",
  "CONVERSE",
  "JORDAN",
  "REEBOK",
];
const SIZES = [38, 39, 40, 41, 42, 43, 44];
const COLORS = [
  { id: "black", label: "Negro", hex: "#1E1E1E" },
  { id: "white", label: "Blanco", hex: "#F2F2F2" },
  { id: "blue", label: "Azul", hex: "#4A7CCF" },
  { id: "red", label: "Rojo", hex: "#E63946" },
  { id: "green", label: "Verde", hex: "#16A34A" },
];
const SORTS = [
  { id: "popular", label: "Más populares" },
  { id: "price-asc", label: "Precio: menor a mayor" },
  { id: "price-desc", label: "Precio: mayor a menor" },
  { id: "rating", label: "Mejor valorados" },
];

const PER_PAGE = 9;

export default function TiendaPage() {
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [brands, setBrands] = useState<Set<string>>(new Set());
  const [sizes, setSizes] = useState<Set<number>>(new Set());
  const [colors, setColors] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [sort, setSort] = useState(SORTS[0].id);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggle = <T,>(set: Set<T>, value: T): Set<T> => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (categories.size > 0 && !categories.has(p.category)) return false;
      if (brands.size > 0 && !brands.has(p.brand)) return false;
      if (sizes.size > 0 && !p.sizes.some((s) => sizes.has(s))) return false;
      if (colors.size > 0 && !p.colorTags.some((c) => colors.has(c))) return false;
      const min = priceMin ? Number(priceMin) : 0;
      const max = priceMax ? Number(priceMax) : Infinity;
      if (p.price < min || p.price > max) return false;
      return true;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "rating")
      list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    return list;
  }, [categories, brands, sizes, colors, priceMin, priceMax, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const activeFiltersCount =
    categories.size +
    brands.size +
    sizes.size +
    colors.size +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0);

  const clearAll = () => {
    setCategories(new Set());
    setBrands(new Set());
    setSizes(new Set());
    setColors(new Set());
    setPriceMin("");
    setPriceMax("");
    setPage(1);
  };

  return (
    <div className="container-page py-8">
      <nav className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--avax-black)] transition-colors">
          Inicio
        </Link>
        <ChevronRight size={12} />
        <span className="text-[var(--avax-black)] font-semibold">Zapatillas</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-[var(--avax-black)] tracking-tight">
            Zapatillas
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            {filtered.length} producto{filtered.length === 1 ? "" : "s"} encontrado
            {filtered.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="md:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--avax-black)] text-white text-sm font-semibold"
          >
            <SlidersHorizontal size={14} />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-[var(--avax-blue-light)] text-[10px] font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <label className="relative">
            <span className="sr-only">Ordenar por</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 rounded-full bg-white border border-[var(--border-strong)] text-sm font-semibold text-[var(--avax-black)] cursor-pointer hover:border-[var(--primary)] transition-colors"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  Ordenar por: {s.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--foreground-muted)]"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
        <FiltersPanel
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          categories={categories}
          brands={brands}
          sizes={sizes}
          colors={colors}
          priceMin={priceMin}
          priceMax={priceMax}
          onToggleCategory={(c) => {
            setCategories((s) => toggle(s, c));
            setPage(1);
          }}
          onToggleBrand={(b) => {
            setBrands((s) => toggle(s, b));
            setPage(1);
          }}
          onToggleSize={(sz) => {
            setSizes((s) => toggle(s, sz));
            setPage(1);
          }}
          onToggleColor={(c) => {
            setColors((s) => toggle(s, c));
            setPage(1);
          }}
          onPriceMinChange={(v) => {
            setPriceMin(v);
            setPage(1);
          }}
          onPriceMaxChange={(v) => {
            setPriceMax(v);
            setPage(1);
          }}
          onClearAll={clearAll}
          activeCount={activeFiltersCount}
        />

        <div className="flex flex-col gap-8 min-w-0">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 rounded-3xl bg-[var(--surface-2)]">
              <p className="text-lg font-bold text-[var(--avax-black)] mb-2">
                Sin resultados
              </p>
              <p className="text-sm text-[var(--foreground-muted)] mb-5">
                Prueba ajustando o limpiando los filtros.
              </p>
              <Button variant="dark" size="md" onClick={clearAll}>
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginated.map((p) => (
                <ProductCard key={p.id} product={p} size="sm" />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              page={currentPage}
              total={totalPages}
              onChange={setPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function FiltersPanel(props: {
  isOpen: boolean;
  onClose: () => void;
  categories: Set<string>;
  brands: Set<string>;
  sizes: Set<number>;
  colors: Set<string>;
  priceMin: string;
  priceMax: string;
  onToggleCategory: (c: string) => void;
  onToggleBrand: (b: string) => void;
  onToggleSize: (s: number) => void;
  onToggleColor: (c: string) => void;
  onPriceMinChange: (v: string) => void;
  onPriceMaxChange: (v: string) => void;
  onClearAll: () => void;
  activeCount: number;
}) {
  const Inner = (
    <aside className="flex flex-col gap-7 bg-white md:bg-transparent">
      <div className="flex items-center justify-between md:hidden">
        <h2 className="text-lg font-bold text-[var(--avax-black)]">Filtros</h2>
        <button
          type="button"
          onClick={props.onClose}
          aria-label="Cerrar filtros"
          className="w-9 h-9 rounded-full bg-[var(--surface-2)] flex items-center justify-center"
        >
          <X size={16} />
        </button>
      </div>

      <FilterGroup title="Categorías">
        {CATEGORIES.map((c) => (
          <FilterCheckbox
            key={c}
            label={c}
            checked={props.categories.has(c)}
            onChange={() => props.onToggleCategory(c)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Marcas">
        {BRANDS.map((b) => (
          <FilterCheckbox
            key={b}
            label={b.charAt(0) + b.slice(1).toLowerCase()}
            checked={props.brands.has(b)}
            onChange={() => props.onToggleBrand(b)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Talla">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => props.onToggleSize(s)}
              className={cn(
                "min-w-10 h-10 px-2 rounded-lg border text-sm font-bold transition-colors",
                props.sizes.has(s)
                  ? "bg-[var(--avax-black)] border-[var(--avax-black)] text-white"
                  : "bg-white border-[var(--border-strong)] text-[var(--avax-black)] hover:border-[var(--primary)]",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Color">
        <div className="flex items-center gap-2.5 flex-wrap">
          {COLORS.map((c) => {
            const isOn = props.colors.has(c.id);
            return (
              <button
                key={c.id}
                type="button"
                aria-label={c.label}
                title={c.label}
                onClick={() => props.onToggleColor(c.id)}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-transform",
                  isOn
                    ? "border-[var(--primary)] scale-110"
                    : "border-[var(--border-strong)] hover:scale-105",
                )}
                style={{ backgroundColor: c.hex }}
              />
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Precio (S/)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Min"
            value={props.priceMin}
            onChange={(e) => props.onPriceMinChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface-2)] text-sm outline-none focus:bg-white focus:ring-1 focus:ring-[var(--primary)]"
          />
          <span className="text-[var(--foreground-subtle)]">—</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Max"
            value={props.priceMax}
            onChange={(e) => props.onPriceMaxChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface-2)] text-sm outline-none focus:bg-white focus:ring-1 focus:ring-[var(--primary)]"
          />
        </div>
      </FilterGroup>

      <Button
        variant="dark"
        size="md"
        fullWidth
        onClick={props.onClearAll}
        disabled={props.activeCount === 0}
      >
        Limpiar filtros{props.activeCount > 0 ? ` (${props.activeCount})` : ""}
      </Button>
    </aside>
  );

  return (
    <>
      <div className="hidden md:block">{Inner}</div>

      {props.isOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={props.onClose}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white p-6 overflow-y-auto">
            {Inner}
          </div>
        </div>
      )}
    </>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-extrabold tracking-[0.18em] text-[var(--avax-black)] uppercase">
        {title}
      </h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer text-sm text-[var(--foreground-muted)] hover:text-[var(--avax-black)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-[var(--border-strong)] accent-[var(--primary)]"
      />
      {label}
    </label>
  );
}

function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  return (
    <nav className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Página anterior"
        className="w-10 h-10 rounded-full bg-white border border-[var(--border-strong)] flex items-center justify-center hover:border-[var(--primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "min-w-10 h-10 px-3 rounded-full text-sm font-bold transition-colors",
            p === page
              ? "bg-[var(--avax-black)] text-white"
              : "bg-white border border-[var(--border-strong)] text-[var(--avax-black)] hover:border-[var(--primary)]",
          )}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(Math.min(total, page + 1))}
        disabled={page === total}
        aria-label="Página siguiente"
        className="w-10 h-10 rounded-full bg-[var(--avax-black)] text-white flex items-center justify-center hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
