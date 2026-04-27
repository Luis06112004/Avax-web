import { Award } from "lucide-react";
import { featuredProducts } from "@/data/mock";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "@/components/layout/SectionHeader";

const TABS = ["Todos", "Hombre", "Mujer"];

export function FeaturedProducts() {
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} size="sm" />
        ))}
      </div>
    </section>
  );
}
