import { listFeatured, type ShopProduct } from "@/lib/shop-api";
import { HeroCarousel, type HeroSlide } from "./HeroCarousel";

function splitName(full: string): { top: string; bottom: string } {
  const words = full.trim().split(/\s+/);
  if (words.length <= 2) return { top: words.join(" "), bottom: "" };
  const half = Math.ceil(words.length / 2);
  return {
    top: words.slice(0, half).join(" "),
    bottom: words.slice(half).join(" "),
  };
}

/**
 * ShopProduct (payload de listado) NO trae descripción corta — solo
 * description_long existe en el detalle. Para no repetir el mismo texto en
 * todos los slides, construimos una frase específica con brand + category del
 * producto. Si faltan ambos, cae a un genérico de marca AVAX.
 */
export function heroDescription(p: ShopProduct): string {
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
    // No hay sistema de reseñas real; 0 oculta el contador falso en el render.
    reviews: 0,
    image: p.image,
    thumbs: p.images.slice(0, 3),
  };
}

export async function Hero(props: { productos?: ShopProduct[] } = {}) {
  const productos = props?.productos;

  let slides: HeroSlide[] = [];
  if (productos && productos.length > 0) {
    // Respeta TODOS los productos elegidos en el admin (sin recorte).
    slides = productos.map(toSlide);
  } else {
    try {
      const res = await listFeatured();
      slides = res.data.slice(0, 5).map(toSlide);
    } catch (err) {
      console.error("Hero fetch failed", err);
    }
  }

  return <HeroCarousel slides={slides} />;
}
