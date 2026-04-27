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

function toSlide(p: ShopProduct): HeroSlide {
  const { top, bottom } = splitName(p.name);
  return {
    id: p.id,
    brand: p.brand,
    nameTop: top || p.name,
    nameBottom: bottom,
    description:
      "Diseño icónico con materiales premium. Originales 100% verificados con garantía AVAX.",
    price: p.price,
    oldPrice: p.oldPrice,
    rating: p.rating,
    reviews: 248,
    image: p.image,
    thumbs: p.images.slice(0, 3),
  };
}

export async function Hero() {
  let slides: HeroSlide[] = [];
  try {
    const res = await listFeatured();
    slides = res.data.slice(0, 3).map(toSlide);
  } catch (err) {
    console.error("Hero fetch failed", err);
  }

  return <HeroCarousel slides={slides} />;
}
