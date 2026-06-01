import {
  Hero,
  BrandsBanner,
  PopularNow,
  PromoBanner,
  NewReleases,
  FeaturedProducts,
  Testimonials,
  InstagramFeed,
} from "@/components/sections";
import type { SeccionResuelta, ShopProduct, HomeMarca } from "./home-types";

/**
 * Render dinámico de la homepage de AVAX: respeta el orden y los componentes
 * ORIGINALES de la home, ahora controlados por el CMS (orden/activación/config).
 *
 * Orden original: Hero · Marcas · Popular · Promo · Nuevos · Destacados ·
 *                 Testimonios · Instagram
 *
 * Si no hay secciones (backend caído), cae al render estático original.
 */

const FALLBACK = (
  <>
    <Hero />
    <BrandsBanner />
    <PopularNow />
    <PromoBanner />
    <NewReleases />
    <FeaturedProducts />
    <Testimonials />
    <InstagramFeed />
  </>
);

function renderSeccion(s: SeccionResuelta) {
  const datos = (s.datos ?? {}) as Record<string, unknown>;
  const titulo = s.titulo ?? undefined;
  const subtitulo = s.subtitulo ?? undefined;
  const productos = (datos as { productos?: ShopProduct[] }).productos;

  switch (s.tipo) {
    case "hero":
      return <Hero key={s.id} productos={productos} />;
    case "marcas":
      return (
        <BrandsBanner
          key={s.id}
          titulo={titulo}
          subtitulo={subtitulo}
          marcas={(datos.marcas as HomeMarca[]) ?? undefined}
        />
      );
    case "popular":
      return (
        <PopularNow key={s.id} titulo={titulo} subtitulo={subtitulo} productos={productos} />
      );
    case "promo_banner":
      return (
        <PromoBanner
          key={s.id}
          titulo={titulo}
          subtitulo={subtitulo}
          etiqueta={(datos.etiqueta as string) ?? undefined}
          botonTexto={(datos.boton_texto as string) ?? undefined}
          botonLink={(datos.boton_link as string) ?? undefined}
        />
      );
    case "nuevos":
      return (
        <NewReleases key={s.id} titulo={titulo} subtitulo={subtitulo} productos={productos} />
      );
    case "destacados":
      return (
        <FeaturedProducts key={s.id} titulo={titulo} subtitulo={subtitulo} productos={productos} />
      );
    case "testimonios":
      return <Testimonials key={s.id} />;
    case "instagram":
      return <InstagramFeed key={s.id} />;
    default:
      return null;
  }
}

export function HomeSections({ secciones }: { secciones: SeccionResuelta[] }) {
  if (!secciones || secciones.length === 0) {
    return FALLBACK;
  }
  return <>{secciones.map((s) => renderSeccion(s))}</>;
}
