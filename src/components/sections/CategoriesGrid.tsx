import Link from "next/link";
import { LayoutGrid, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { MobileScroller } from "@/components/layout/MobileScroller";
import type { HomeCategoria } from "./home-types";

export function CategoriesGrid({
  titulo,
  subtitulo,
  categorias,
}: {
  titulo?: string;
  subtitulo?: string;
  categorias?: HomeCategoria[];
} = {}) {
  if (!categorias || categorias.length === 0) return null;

  return (
    <section className="container-page py-14">
      <SectionHeader
        tag={{ label: subtitulo ?? "Categorías", icon: <LayoutGrid size={14} /> }}
        title={titulo ?? "Explora por categoría"}
        className="mb-9"
      />

      <MobileScroller desktopGrid="lg:grid-cols-4" itemWidth="card">
        {categorias.map((cat) => (
          <Link
            key={cat.id}
            href={`/tienda?categoria=${encodeURIComponent(cat.slug)}`}
            className="group relative overflow-hidden rounded-[24px] bg-[var(--avax-black)] aspect-[4/5] flex cursor-pointer"
          >
            {cat.imagen ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cat.imagen}
                alt={cat.nombre}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface-2)] to-[var(--avax-black)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            <div className="relative z-10 flex flex-col justify-end gap-1 p-6 w-full">
              <h3 className="text-xl md:text-2xl font-black text-white leading-tight line-clamp-2">
                {cat.nombre}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/70">
                  {cat.productos_count} productos
                </span>
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/15 border border-white/20 text-white group-hover:bg-white group-hover:text-[var(--avax-black)] transition-colors">
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </MobileScroller>
    </section>
  );
}
