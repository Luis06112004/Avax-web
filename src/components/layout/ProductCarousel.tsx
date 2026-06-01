"use client";

import { Children, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Mostrar indicador de paginación. Default true. */
  showDots?: boolean;
};

/**
 * Carrusel de cards completas por viewport — 4 desktop, 2 tablet, 1 móvil —
 * con scroll-snap, flechas ‹ › (en todas las vistas) y avance card por card.
 * El indicador inferior es de DOTS si hay pocas posiciones, o una barra de
 * progreso si hay muchas (evita que se desborden en móvil con muchos productos).
 */
export function ProductCarousel({ children, className, showDots = true }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children);
  const total = items.length;

  const [perView, setPerView] = useState(1);
  const [pos, setPos] = useState(0); // índice de card activa (0-based)
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 4 : w >= 640 ? 2 : 1);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const stepWidth = () => {
    const el = scrollerRef.current;
    if (!el) return 0;
    const first = el.firstElementChild as HTMLElement | null;
    const second = el.children[1] as HTMLElement | null;
    if (first && second) return second.offsetLeft - first.offsetLeft;
    return first ? first.clientWidth : el.clientWidth / Math.max(1, perView);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setCanPrev(el.scrollLeft > 8);
        setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
        const step = stepWidth();
        setPos(step ? Math.round(el.scrollLeft / step) : 0);
      });
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [total, perView]);

  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * stepWidth(), behavior: "smooth" });
  };

  const goTo = (cardIdx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: cardIdx * stepWidth(), behavior: "smooth" });
  };

  const hasNav = total > perView;
  // Posiciones de scroll alcanzables (la última muestra las últimas perView cards)
  const positions = Math.max(1, total - perView + 1);
  // Si hay muchas posiciones, usamos barra de progreso en vez de dots
  const useBar = positions > 8;
  const clampedPos = Math.min(pos, positions - 1);

  return (
    <div className={cn("relative flex flex-col gap-5", className)}>
      <div className="relative">
        {/* Pista — 100% del ancho, las cards no pierden espacio */}
        <div
          ref={scrollerRef}
          className="flex gap-4 lg:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden py-1"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((child, i) => (
            <div
              key={i}
              className="snap-start shrink-0 basis-full sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-3.75rem)/4)]"
            >
              {child}
            </div>
          ))}
        </div>

        {/* Flechas: semi-superpuestas sobre los bordes de las cards en TODAS las
            vistas. Sin translate hacia afuera para que NUNCA se corten ni
            generen overflow horizontal del documento (especialmente en tablet). */}
        {hasNav && (
          <>
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canPrev}
              aria-label="Anterior"
              className={cn(
                "absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full bg-white shadow-md border border-[var(--border)] text-[var(--avax-black)] transition-all cursor-pointer",
                "left-1 w-9 h-9 lg:left-2 lg:w-10 lg:h-10",
                canPrev
                  ? "hover:bg-[var(--avax-black)] hover:text-white hover:border-[var(--avax-black)]"
                  : "opacity-0 pointer-events-none",
              )}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canNext}
              aria-label="Siguiente"
              className={cn(
                "absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full bg-white shadow-md border border-[var(--border)] text-[var(--avax-black)] transition-all cursor-pointer",
                "right-1 w-9 h-9 lg:right-2 lg:w-10 lg:h-10",
                canNext
                  ? "hover:bg-[var(--avax-black)] hover:text-white hover:border-[var(--avax-black)]"
                  : "opacity-0 pointer-events-none",
              )}
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Indicador inferior */}
      {showDots && hasNav && (
        useBar ? (
          // Barra de progreso (muchas posiciones → no se desbordan dots)
          <div className="mx-auto h-1 w-32 rounded-full bg-[var(--border-strong)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--avax-black)] transition-all duration-200"
              style={{
                width: `${100 / positions}%`,
                marginLeft: `${(clampedPos / positions) * 100}%`,
              }}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: positions }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir a la posición ${i + 1}`}
                className={cn(
                  "rounded-full transition-all duration-200 cursor-pointer",
                  i === clampedPos
                    ? "w-6 h-2 bg-[var(--avax-black)]"
                    : "w-2 h-2 bg-[var(--border-strong)] hover:bg-[var(--foreground-subtle)]",
                )}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
