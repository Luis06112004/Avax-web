"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
import {
  listBrands,
  listCategories,
  listProducts,
  type ShopProduct,
} from "@/lib/shop-api";
import type { Product } from "@/types";

const SORTS = [
  { id: "nuevos", label: "Más recientes" },
  { id: "precio_asc", label: "Precio: menor a mayor" },
  { id: "precio_desc", label: "Precio: mayor a menor" },
  { id: "nombre", label: "Nombre A-Z" },
] as const;

const COLORS = [
  { id: "negro", label: "Negro", hex: "#1E1E1E" },
  { id: "blanco", label: "Blanco", hex: "#F2F2F2" },
  { id: "azul", label: "Azul", hex: "#4A7CCF" },
  { id: "rojo", label: "Rojo", hex: "#E63946" },
  { id: "verde", label: "Verde", hex: "#16A34A" },
  { id: "gris", label: "Gris", hex: "#9CA3AF" },
];

const PER_PAGE = 12;

function toProduct(p: ShopProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    price: p.price,
    oldPrice: p.oldPrice ?? undefined,
    discountLabel: p.discountLabel ?? undefined,
    image: p.image,
    badge: p.badge ?? undefined,
    rating: p.rating,
    stock: p.stock,
  };
}

export default function TiendaPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-10 text-sm text-[var(--foreground-muted)]">
          Cargando catálogo…
        </div>
      }
    >
      <TiendaContent />
    </Suspense>
  );
}

function TiendaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") ?? "";

  const [allProducts, setAllProducts] = useState<ShopProduct[]>([]);
  const [brandsList, setBrandsList] = useState<string[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState(initialQ);
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [brands, setBrands] = useState<Set<string>>(new Set());
  const [colors, setColors] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>(SORTS[0].id);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // React to ?q changes from header search
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setSearchTerm(q);
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const [prodRes, brandRes, catRes] = await Promise.all([
          listProducts({ per_page: 200 }),
          listBrands(),
          listCategories(),
        ]);
        if (!alive) return;
        setAllProducts(prodRes.data);
        setBrandsList(brandRes.data.map((b) => b.nombre.toUpperCase()));
        setCategoriesList(catRes.data.map((c) => c.nombre));
      } catch (err) {
        console.error("Tienda fetch failed", err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const toggle = <T,>(set: Set<T>, value: T): Set<T> => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let list = allProducts.filter((p) => {
      if (term) {
        const haystack =
          `${p.name} ${p.brand} ${p.category} ${p.sku}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      if (categories.size > 0 && !categories.has(p.category)) return false;
      if (brands.size > 0 && !brands.has(p.brand)) return false;
      if (colors.size > 0) {
        const lower = p.colors.map((c) => c.toLowerCase());
        const matches = [...colors].some((c) => lower.some((l) => l.includes(c)));
        if (!matches) return false;
      }
      const min = priceMin ? Number(priceMin) : 0;
      const max = priceMax ? Number(priceMax) : Infinity;
      if (p.price < min || p.price > max) return false;
      return true;
    });

    if (sort === "precio_asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "precio_desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "nombre") list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [allProducts, searchTerm, categories, brands, colors, priceMin, priceMax, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const activeFiltersCount =
    categories.size +
    brands.size +
    colors.size +
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0);

  const clearAll = () => {
    setCategories(new Set());
    setBrands(new Set());
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
        <span className="text-[var(--avax-black)] font-semibold">Tienda</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h1 className="text-4xl md:text-5xl font-black text-[var(--avax-black)] tracking-tight">
            Catálogo
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1">
            {loading
              ? "Cargando productos…"
              : searchTerm
                ? `${filtered.length} resultado${filtered.length === 1 ? "" : "s"} para “${searchTerm}”`
                : `${filtered.length} producto${filtered.length === 1 ? "" : "s"} encontrado${filtered.length === 1 ? "" : "s"}`}
          </p>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                router.replace("/tienda");
              }}
              className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-[var(--surface-2)] text-xs font-bold text-[var(--avax-black)] hover:bg-[var(--surface-3)] cursor-pointer"
            >
              <X size={12} />
              Limpiar búsqueda
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="md:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--avax-black)] text-white text-sm font-semibold cursor-pointer"
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
              onChange={(e) => setSort(e.target.value as typeof sort)}
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
          categoriesList={categoriesList}
          brandsList={brandsList}
          categories={categories}
          brands={brands}
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
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-2xl bg-[var(--surface-2)] animate-pulse"
                />
              ))}
            </div>
          ) : paginated.length === 0 ? (
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
                <ProductCard key={p.id} product={toProduct(p)} size="sm" />
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
  categoriesList: string[];
  brandsList: string[];
  categories: Set<string>;
  brands: Set<string>;
  colors: Set<string>;
  priceMin: string;
  priceMax: string;
  onToggleCategory: (c: string) => void;
  onToggleBrand: (b: string) => void;
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
          className="w-9 h-9 rounded-full bg-[var(--surface-2)] flex items-center justify-center cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {props.categoriesList.length > 0 && (
        <FilterGroup title="Categorías">
          <div className="flex flex-col gap-2">
            {props.categoriesList.map((c) => (
              <label
                key={c}
                className="flex items-center gap-2.5 text-sm text-[var(--foreground)] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={props.categories.has(c)}
                  onChange={() => props.onToggleCategory(c)}
                  className="w-4 h-4 rounded border-[var(--border-strong)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                />
                {c}
              </label>
            ))}
          </div>
        </FilterGroup>
      )}

      {props.brandsList.length > 0 && (
        <FilterGroup title="Marcas">
          <div className="flex flex-col gap-2">
            {props.brandsList.map((b) => (
              <label
                key={b}
                className="flex items-center gap-2.5 text-sm text-[var(--foreground)] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={props.brands.has(b)}
                  onChange={() => props.onToggleBrand(b)}
                  className="w-4 h-4 rounded border-[var(--border-strong)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
                />
                {b}
              </label>
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Colores">
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => {
            const active = props.colors.has(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => props.onToggleColor(c.id)}
                aria-label={c.label}
                className={cn(
                  "relative w-9 h-9 rounded-full border-2 transition-all cursor-pointer",
                  active
                    ? "border-[var(--avax-black)] scale-110"
                    : "border-[var(--border)] hover:border-[var(--foreground-subtle)]",
                )}
                style={{ backgroundColor: c.hex }}
                title={c.label}
              />
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Precio (S/)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={props.priceMin}
            onChange={(e) => props.onPriceMinChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface-2)] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <span className="text-[var(--foreground-muted)]">—</span>
          <input
            type="number"
            placeholder="Max"
            value={props.priceMax}
            onChange={(e) => props.onPriceMaxChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--surface-2)] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>
      </FilterGroup>

      {props.activeCount > 0 && (
        <button
          type="button"
          onClick={props.onClearAll}
          className="text-sm font-semibold text-[var(--primary)] hover:underline self-start cursor-pointer"
        >
          Limpiar filtros ({props.activeCount})
        </button>
      )}
    </aside>
  );

  return (
    <>
      <div className="hidden md:block">{Inner}</div>

      {props.isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={props.onClose}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-sm bg-white p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {Inner}
          </div>
        </div>
      )}
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-extrabold tracking-[0.15em] uppercase text-[var(--foreground-muted)]">
        {title}
      </h3>
      {children}
    </div>
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
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Anterior"
        className="w-10 h-10 rounded-full border border-[var(--border-strong)] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--primary)] cursor-pointer transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const active = n === page;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={cn(
              "min-w-10 h-10 px-3 rounded-full text-sm font-bold transition-colors cursor-pointer",
              active
                ? "bg-[var(--avax-black)] text-white"
                : "border border-[var(--border-strong)] hover:border-[var(--primary)]",
            )}
          >
            {n}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => onChange(Math.min(total, page + 1))}
        disabled={page === total}
        aria-label="Siguiente"
        className="w-10 h-10 rounded-full border border-[var(--border-strong)] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--primary)] cursor-pointer transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
