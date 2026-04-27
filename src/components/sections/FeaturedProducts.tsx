"use client";

import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  listFeatured,
  listProducts,
  type ShopProduct,
} from "@/lib/shop-api";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "todos", label: "Todos" },
  { id: "HOMBRE", label: "Hombre" },
  { id: "MUJER", label: "Mujer" },
] as const;

type TabId = (typeof TABS)[number]["id"];

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

export function FeaturedProducts() {
  const [tab, setTab] = useState<TabId>("todos");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        const res =
          tab === "todos"
            ? await listFeatured()
            : await listProducts({ genero: tab, per_page: 8 });
        if (!alive) return;
        const items = ("pagination" in res ? res.data : res.data) as ShopProduct[];
        setProducts(items.slice(0, 8).map(toProduct));
      } catch (err) {
        console.error("FeaturedProducts fetch failed", err);
        if (alive) setProducts([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [tab]);

  return (
    <section className="container-page py-14">
      <SectionHeader
        tag={{
          label: "Selección del equipo",
          icon: <Award size={14} />,
          className: "bg-[#FEF3C7] text-[#92400E]",
        }}
        title="Productos Destacados"
        end={
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--surface-2)]">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer",
                  tab === t.id
                    ? "bg-[var(--avax-black)] text-white"
                    : "text-[var(--foreground-muted)] hover:text-[var(--avax-black)]",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        }
        className="mb-9"
      />

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-2xl bg-[var(--surface-2)] animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center text-sm text-[var(--foreground-muted)]">
          No hay productos en esta categoría.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} size="sm" />
          ))}
        </div>
      )}
    </section>
  );
}
