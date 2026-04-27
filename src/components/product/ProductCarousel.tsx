"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "./ProductCard";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { PaginationDots } from "@/components/ui/PaginationDots";
import type { Product } from "@/types";

type Props = {
  products: Product[];
  size?: "sm" | "md";
  /** Cuántas tarjetas se muestran a la vez (en md+). Default 3. */
  perPage?: number;
};

/**
 * Carrusel horizontal con scroll-snap. Las flechas mueven 1 página a la vez.
 * Los puntos reflejan la página actual.
 */
export function ProductCarousel({ products, size = "md", perPage = 3 }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(products.length / perPage));

  const scrollToPage = (newPage: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(totalPages - 1, newPage));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
    setPage(clamped);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const p = Math.round(el.scrollLeft / el.clientWidth);
        setPage(Math.max(0, Math.min(totalPages - 1, p)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [totalPages]);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center text-sm text-[var(--foreground-muted)]">
        Aún no hay productos disponibles. Sincroniza el catálogo desde el panel admin.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        ref={scrollerRef}
        className="overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex gap-6 pb-2">
          {Array.from({ length: totalPages }).map((_, pageIdx) => (
            <div
              key={pageIdx}
              className="snap-start shrink-0 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {products
                .slice(pageIdx * perPage, (pageIdx + 1) * perPage)
                .map((product) => (
                  <ProductCard key={product.id} product={product} size={size} />
                ))}
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          <PaginationDots count={totalPages} active={page} onSelect={scrollToPage} />
          <div className="flex items-center gap-3">
            <ArrowButton
              direction="prev"
              onClick={() => scrollToPage(page - 1)}
              disabled={page === 0}
            />
            <ArrowButton
              direction="next"
              variant="dark"
              onClick={() => scrollToPage(page + 1)}
              disabled={page >= totalPages - 1}
            />
          </div>
        </div>
      )}
    </div>
  );
}
