import { Flame } from "lucide-react";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { listPopular, type ShopProduct } from "@/lib/shop-api";
import type { Product } from "@/types";

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

export async function PopularNow() {
  let products: Product[] = [];
  try {
    const res = await listPopular();
    products = res.data.map(toProduct);
  } catch (err) {
    console.error("PopularNow fetch failed", err);
  }

  return (
    <section className="container-page py-14">
      <SectionHeader
        tag={{ label: "Trending ahora", icon: <Flame size={14} /> }}
        title="Lo más popular esta semana"
        className="mb-9"
      />
      <ProductCarousel products={products} size="md" perPage={3} />
    </section>
  );
}
