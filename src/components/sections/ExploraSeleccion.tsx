import Link from "next/link";
import { Compass, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import type { ExploracionItem } from "./home-types";

export function ExploraSeleccion({
  titulo,
  subtitulo,
  items,
}: {
  titulo?: string;
  subtitulo?: string;
  items?: ExploracionItem[];
} = {}) {
  if (!items || items.length === 0) return null;

  return (
    <section className="container-page py-14">
      <SectionHeader
        tag={{ label: subtitulo ?? "Colecciones", icon: <Compass size={14} /> }}
        title={titulo ?? "Explora nuestra selección"}
        className="mb-9"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {items.map((item, idx) => (
          <Link
            key={`${item.link}-${idx}`}
            href={item.link}
            className="group relative overflow-hidden rounded-[24px] bg-[var(--avax-black)] aspect-[3/4] flex cursor-pointer"
          >
            {item.imagen ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.imagen}
                alt={item.titulo}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--avax-blue-medium)] via-[var(--avax-blue-dark)] to-[var(--avax-black)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            <div className="relative z-10 flex items-end justify-between gap-3 p-6 w-full">
              <h3 className="text-lg md:text-2xl font-black text-white leading-tight line-clamp-3">
                {item.titulo}
              </h3>
              <span className="inline-flex shrink-0 items-center justify-center w-9 h-9 rounded-full bg-white/15 border border-white/20 text-white group-hover:bg-white group-hover:text-[var(--avax-black)] transition-colors">
                <ArrowUpRight size={15} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
