import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { BrandCard } from "@/components/product/BrandCard";
import { MobileScroller } from "@/components/layout/MobileScroller";
import { listBrands, type ShopBrand } from "@/lib/shop-api";
import type { Brand } from "@/types";
import type { HomeMarca } from "./home-types";

const PILL_COLORS = ["#1E1E1E", "#C8102E", "#1E1E1E", "#0066CC", "#000000"];

// Imagenes IA fijas para el banner "Las mejores del mercado".
// Se asignan por posicion (top1 -> brand-1.png, top2 -> brand-2.png, etc).
const HERO_IMAGES = [
  "/images/sections/brand-1.png",
  "/images/sections/brand-2.png",
  "/images/sections/brand-3.png",
];

function toBrand(b: ShopBrand, idx: number): Brand {
  return {
    id: b.id,
    name: b.nombre,
    image: HERO_IMAGES[idx] ?? b.logo ?? undefined,
    modelCount: b.productos_count,
    pillColor: PILL_COLORS[idx % PILL_COLORS.length],
  };
}

function marcaToBrand(m: HomeMarca, idx: number): Brand {
  return {
    id: m.id,
    name: m.nombre,
    image: HERO_IMAGES[idx] ?? m.logo ?? undefined,
    modelCount: m.productos_count,
    pillColor: PILL_COLORS[idx % PILL_COLORS.length],
  };
}

// Tope de seguridad para el grid (evita layouts rotos con catálogos enormes).
const MAX_BRANDS = 12;

export async function BrandsBanner(
  props: { titulo?: string; subtitulo?: string; marcas?: HomeMarca[] } = {},
) {
  const titulo = props?.titulo;
  const subtitulo = props?.subtitulo;
  const marcasPreset = props?.marcas;

  let brands: Brand[] = [];
  if (marcasPreset && marcasPreset.length > 0) {
    // Respeta la selección del admin (sin recorte fijo a 3).
    brands = marcasPreset.slice(0, MAX_BRANDS).map(marcaToBrand);
  } else {
    try {
      const res = await listBrands();
      brands = res.data
        .sort((a, b) => b.productos_count - a.productos_count)
        .slice(0, MAX_BRANDS)
        .map(toBrand);
    } catch (err) {
      console.error("BrandsBanner fetch failed", err);
    }
  }

  return (
    <section className="container-page py-10">
      <div className="relative rounded-[32px] bg-[var(--avax-black)] overflow-hidden p-8 md:p-12 lg:p-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[380px] h-[380px] rounded-full bg-[var(--primary)] opacity-20 blur-3xl" />
          <div className="absolute top-32 -right-32 w-[340px] h-[340px] rounded-full bg-[var(--accent)] opacity-15 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-10">
          <div className="flex flex-col md:flex-row gap-4 md:items-end md:justify-between">
            <div className="flex flex-col gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E63946] text-white text-[11px] font-extrabold tracking-[0.2em] uppercase w-fit">
                <Sparkles size={12} />
                {subtitulo?.trim() || "Marcas"}
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-[52px] font-black text-white leading-[1.05] tracking-tight">
                {titulo ?? "Las mejores del mercado"}
              </h2>
              <p className="text-sm md:text-base text-white/70">
                Trabajamos con las marcas más respetadas del sneaker game.
              </p>
            </div>
            <Link
              href="/marcas"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold hover:bg-white/15 transition-colors w-fit"
            >
              Ver todas las marcas
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {brands.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 py-14 text-center text-sm text-white/60">
              Aún no hay marcas. Sincroniza el catálogo desde el panel admin.
            </div>
          ) : (
            <MobileScroller
              desktopGrid={
                brands.length <= 3
                  ? "lg:grid-cols-3"
                  : brands.length === 4
                    ? "lg:grid-cols-4"
                    : "lg:grid-cols-3 xl:grid-cols-4"
              }
              itemWidth="card"
            >
              {brands.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </MobileScroller>
          )}
        </div>
      </div>
    </section>
  );
}
