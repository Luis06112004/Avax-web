import Link from "next/link";
import { Calendar, ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { MobileScroller } from "@/components/layout/MobileScroller";

const RELEASES = [
  {
    brand: "AIR JORDAN",
    name: "Air Jordan 3 Retro",
    subtitle: "Edición limitada · Stock mínimo",
    price: 599,
    image: "/images/sections/air-jordan-3.png",
    href: "/tienda?q=jordan",
    theme: "dark" as const,
  },
  {
    brand: "YEEZY",
    name: "Yeezy Boost 350 V2",
    subtitle: "Comodidad y diseño premium",
    price: 899,
    image: "/images/sections/yeezy-350.png",
    href: "/tienda?q=yeezy",
    theme: "light" as const,
  },
];

export function NewReleases() {
  return (
    <section className="container-page py-14">
      <SectionHeader
        tag={{
          label: "Drops 2026",
          icon: <Calendar size={14} />,
        }}
        title="Nuevos Lanzamientos"
        end={
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[var(--border-strong)] text-sm font-bold text-[var(--avax-black)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
          >
            Ver todo
            <ArrowUpRight size={14} />
          </Link>
        }
        className="mb-9"
      />

      <MobileScroller desktopGrid="lg:grid-cols-2" itemWidth="wide">
        {RELEASES.map((release) => {
          const isDark = release.theme === "dark";
          return (
            <Link
              key={release.name}
              href={release.href}
              className="group relative overflow-hidden rounded-[28px] bg-[var(--avax-black)] min-h-[420px] flex cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={release.image}
                alt={release.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay para legibilidad del texto */}
              <div
                className={
                  isDark
                    ? "absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
                    : "absolute inset-0 bg-gradient-to-t from-white/95 via-white/30 to-transparent"
                }
              />

              <div className="relative z-10 flex flex-col justify-end gap-2.5 p-9 w-full">
                <span
                  className={
                    isDark
                      ? "inline-flex items-center px-3 py-1 rounded-full bg-white text-[10px] font-extrabold tracking-[0.15em] text-[var(--avax-black)] w-fit"
                      : "inline-flex items-center px-3 py-1 rounded-full bg-[var(--avax-black)] text-[10px] font-extrabold tracking-[0.15em] text-white w-fit"
                  }
                >
                  {release.brand}
                </span>
                <h3
                  className={
                    isDark
                      ? "text-3xl md:text-4xl font-black text-white leading-none line-clamp-2"
                      : "text-3xl md:text-4xl font-black text-[var(--avax-black)] leading-none line-clamp-2"
                  }
                >
                  {release.name}
                </h3>
                <p
                  className={
                    isDark
                      ? "text-sm text-white/80"
                      : "text-sm text-[var(--foreground-muted)]"
                  }
                >
                  {release.subtitle}
                </p>
                <span
                  className={
                    isDark
                      ? "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[var(--avax-black)] text-sm font-extrabold w-fit mt-2 group-hover:bg-[var(--surface-2)] transition-colors"
                      : "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--avax-black)] text-white text-sm font-extrabold w-fit mt-2 group-hover:bg-black transition-colors"
                  }
                >
                  Comprar S/ {release.price}
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          );
        })}
      </MobileScroller>
    </section>
  );
}
