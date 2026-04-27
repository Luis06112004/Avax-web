import { Award } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { listFeatured, type ShopProduct } from "@/lib/shop-api";
import type { Product } from "@/types";

const TABS = ["Todos", "Hombre", "Mujer"];

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

export async function FeaturedProducts() {
  let products: Product[] = [];
  try {
    const res = await listFeatured();
    products = res.data.slice(0, 8).map(toProduct);
  } catch (err) {
    console.error("FeaturedProducts fetch failed", err);
  }

  return (
    <section className="container-page py-14">
      <SectionHeader
        tag={{
          label: "Selección del equipo",
          icon: <Award size={14} />,
          className: "bg-[#FEF3C7] text-[#92400E]",
        }}
        title="Productos Destacados"
        end={
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--surface-2)]">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                type="button"
                className={
                  i === 0
                    ? "px-4 py-2 rounded-full bg-[var(--avax-black)] text-white text-xs font-bold cursor-pointer"
                    : "px-4 py-2 rounded-full text-[var(--foreground-muted)] text-xs font-semibold hover:text-[var(--avax-black)] cursor-pointer"
                }
              >
                {tab}
              </button>
            ))}
          </div>
        }
        className="mb-9"
      />

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center text-sm text-[var(--foreground-muted)]">
          Aún no hay productos destacados. Sincroniza el catálogo desde el panel admin.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} size="sm" />
          ))}
        </div>
      )}
    </section>
  );
}
