import { Flame } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ProductCarousel } from "@/components/layout/ProductCarousel";
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

export async function PopularNow(
  props: { titulo?: string; subtitulo?: string; productos?: ShopProduct[] } = {},
) {
  const titulo = props?.titulo;
  const subtitulo = props?.subtitulo;
  const productosPreset = props?.productos;

  let products: Product[] = [];
  if (productosPreset && productosPreset.length > 0) {
    products = productosPreset.map(toProduct);
  } else {
    try {
      const res = await listPopular();
      products = res.data.map(toProduct);
    } catch (err) {
      console.error("PopularNow fetch failed", err);
    }
  }

  return (
    <section className="container-page py-14">
      <SectionHeader
        tag={{ label: subtitulo ?? "Trending ahora", icon: <Flame size={14} /> }}
        title={titulo ?? "Lo más popular esta semana"}
        className="mb-9"
      />

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center text-sm text-[var(--foreground-muted)]">
          Aún no hay productos disponibles. Sincroniza el catálogo desde el panel admin.
        </div>
      ) : (
        <ProductCarousel>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} size="md" />
          ))}
        </ProductCarousel>
      )}
    </section>
  );
}
