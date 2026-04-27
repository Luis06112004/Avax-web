"use client";

import { Children, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /**
   * Clases del grid en desktop. DEBE incluir el prefijo `lg:` ya.
   */
  desktopGrid?: string;
  /**
   * Mostrar puntos de paginacion en mobile. Default true.
   */
  showDots?: boolean;
  /**
   * @deprecated ya no se usa
   */
  itemWidth?: "card" | "wide" | "third" | "quarter";
};

/**
 * En mobile: 1 card por viewport con snap-mandatory CENTRADO.
 * - Cada item ocupa 100% del ancho del scroller
 * - El siguiente NO es visible (no hay peek lateral)
 * - El cambio de slide es completo (no se ve a medias)
 *
 * En desktop (lg+): grid normal.
 */
export function MobileScroller({
  children,
  className,
  desktopGrid = "lg:grid-cols-3",
  showDots = true,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const items = Children.toArray(children);
  const total = items.length;

  // Scroll listener para sincronizar dots
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const idx = Math.round(el.scrollLeft / el.clientWidth);
        setActiveIdx(Math.max(0, Math.min(total - 1, idx)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [total]);

  const goTo = (idx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: idx * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div
        ref={scrollerRef}
        className={cn(
          // Mobile: scroll horizontal con snap, sin peek lateral
          "flex overflow-x-auto snap-x snap-mandatory",
          "scrollbar-none [&::-webkit-scrollbar]:hidden",
          // Desktop: grid normal
          "lg:grid lg:gap-5 lg:overflow-visible lg:snap-none",
          desktopGrid,
          // Cada hijo en mobile: 100% del scroller, padding interior para que la card respire
          "[&>*]:snap-center [&>*]:shrink-0 [&>*]:basis-full [&>*]:min-w-full",
          "lg:[&>*]:basis-auto lg:[&>*]:min-w-0 lg:[&>*]:shrink",
        )}
        style={{ scrollbarWidth: "none" }}
      >
        {children}
      </div>

      {showDots && total > 1 && (
        <div className="flex lg:hidden items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir al item ${i + 1}`}
              className={cn(
                "rounded-full transition-all duration-200 cursor-pointer",
                i === activeIdx
                  ? "w-6 h-2 bg-[var(--avax-black)]"
                  : "w-2 h-2 bg-[var(--border-strong)] hover:bg-[var(--foreground-subtle)]",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
