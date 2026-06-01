"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { HeroCarousel, type HeroSlide } from "@/components/sections/HeroCarousel";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { NewReleases } from "@/components/sections/NewReleases";
import { Testimonials } from "@/components/sections/Testimonials";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { ProductCarousel } from "@/components/layout/ProductCarousel";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { BrandCard } from "@/components/product/BrandCard";
import { MobileScroller } from "@/components/layout/MobileScroller";
import { Flame, Award, Sparkles } from "lucide-react";
import type { ShopProduct, HomeMarca } from "@/components/sections/home-types";
import type { Product, Brand } from "@/types";

/**
 * Página aislada de PREVIEW (renderizada dentro de un iframe). Usa SOLO
 * componentes presentacionales (no-async, client) para evitar el error de
 * "async Client Component". Recibe la config en vivo por postMessage.
 */

type PreviewMsg = {
  __avaxPreview: true;
  tipo: string;
  titulo?: string;
  subtitulo?: string;
  config?: Record<string, unknown>;
  productos?: ShopProduct[];
  marcas?: HomeMarca[];
};

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

function splitName(full: string): { top: string; bottom: string } {
  const words = full.trim().split(/\s+/);
  if (words.length <= 2) return { top: words.join(" "), bottom: "" };
  const half = Math.ceil(words.length / 2);
  return { top: words.slice(0, half).join(" "), bottom: words.slice(half).join(" ") };
}

// Descripción específica por producto (brand + category), igual que Hero.tsx.
// ShopProduct no trae descripción corta, así que evitamos un texto idéntico.
function heroDescription(p: ShopProduct): string {
  const brand = p.brand?.trim();
  const category = p.category?.trim();
  if (brand && category) {
    return `${category} de ${brand}. Originales 100% verificados con garantía AVAX.`;
  }
  if (brand) {
    return `Lo último de ${brand}. Originales 100% verificados con garantía AVAX.`;
  }
  if (category) {
    return `${category} premium. Originales 100% verificados con garantía AVAX.`;
  }
  return "Originales 100% verificados con garantía AVAX.";
}

function toSlide(p: ShopProduct): HeroSlide {
  const { top, bottom } = splitName(p.name);
  return {
    id: p.id,
    brand: p.brand,
    nameTop: top || p.name,
    nameBottom: bottom,
    description: heroDescription(p),
    price: p.price,
    oldPrice: p.oldPrice,
    rating: p.rating,
    reviews: 0,
    image: p.image,
    thumbs: p.images.slice(0, 3),
  };
}

function PreviewInner() {
  const sp = useSearchParams();
  const tipoInicial = sp.get("tipo") ?? "hero";
  const [data, setData] = useState<PreviewMsg>({ __avaxPreview: true, tipo: tipoInicial });

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const m = e.data;
      if (m && typeof m === "object" && m.__avaxPreview) setData(m as PreviewMsg);
    };
    window.addEventListener("message", onMsg);
    window.parent?.postMessage({ __avaxPreviewReady: true }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const { tipo, titulo, subtitulo, productos = [], marcas = [], config = {} } = data;

  let node: React.ReactNode = null;

  switch (tipo) {
    case "hero":
      node = <HeroCarousel slides={productos.map(toSlide)} />;
      break;

    case "popular":
    case "destacados": {
      const items = productos.map(toProduct);
      node = (
        <section className="container-page py-14">
          <SectionHeader
            tag={{
              label: subtitulo ?? (tipo === "popular" ? "Trending ahora" : "Selección del equipo"),
              icon: tipo === "popular" ? <Flame size={14} /> : <Award size={14} />,
            }}
            title={titulo ?? (tipo === "popular" ? "Lo más popular esta semana" : "Productos Destacados")}
            className="mb-9"
          />
          {items.length === 0 ? (
            <Empty />
          ) : (
            <ProductCarousel>
              {items.map((p) => (
                <ProductCard key={p.id} product={p} size="sm" />
              ))}
            </ProductCarousel>
          )}
        </section>
      );
      break;
    }

    case "nuevos":
      node = <NewReleases titulo={titulo} subtitulo={subtitulo} productos={productos} />;
      break;

    case "promo_banner":
      node = (
        <PromoBanner
          titulo={titulo}
          subtitulo={subtitulo}
          etiqueta={config.etiqueta as string}
          botonTexto={config.boton_texto as string}
          botonLink={config.boton_link as string}
        />
      );
      break;

    case "marcas": {
      const marcasVis = marcas.slice(0, 12);
      node = (
        <section className="container-page py-10">
          <div className="relative rounded-[32px] bg-[var(--avax-black)] overflow-hidden p-8 md:p-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E63946] text-white text-[11px] font-extrabold tracking-[0.2em] uppercase w-fit mb-3">
              <Sparkles size={12} />
              {subtitulo?.trim() || "Marcas"}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
              {titulo ?? "Las mejores del mercado"}
            </h2>
            {marcasVis.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/20 py-14 text-center text-sm text-white/60">
                Selecciona marcas para previsualizar.
              </div>
            ) : (
              <MobileScroller
                desktopGrid={
                  marcasVis.length <= 3
                    ? "lg:grid-cols-3"
                    : marcasVis.length === 4
                      ? "lg:grid-cols-4"
                      : "lg:grid-cols-3 xl:grid-cols-4"
                }
                itemWidth="card"
              >
                {marcasVis.map((m, idx) => {
                  const brand: Brand = {
                    id: m.id,
                    name: m.nombre,
                    image: m.logo ?? undefined,
                    modelCount: m.productos_count,
                    pillColor: ["#1E1E1E", "#C8102E", "#0066CC"][idx % 3],
                  };
                  return <BrandCard key={m.id} brand={brand} />;
                })}
              </MobileScroller>
            )}
          </div>
        </section>
      );
      break;
    }

    case "testimonios":
      node = <Testimonials />;
      break;

    case "instagram":
      node = <InstagramFeed />;
      break;

    default:
      node = null;
  }

  return <div className="bg-white min-h-screen flex flex-col justify-center">{node}</div>;
}

function Empty() {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center text-sm text-[var(--foreground-muted)]">
      Selecciona productos para previsualizar.
    </div>
  );
}

export default function HomePreviewPage() {
  return (
    <Suspense fallback={<div className="bg-white min-h-screen" />}>
      <PreviewInner />
    </Suspense>
  );
}
