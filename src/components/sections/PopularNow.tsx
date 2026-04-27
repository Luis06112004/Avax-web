import { Flame } from "lucide-react";
import { popularProducts } from "@/data/mock";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { PaginationDots } from "@/components/ui/PaginationDots";
import { SectionHeader } from "@/components/layout/SectionHeader";

export function PopularNow() {
  return (
    <section className="container-page py-14">
      <SectionHeader
        tag={{
          label: "Trending ahora",
          icon: <Flame size={14} />,
        }}
        title="Lo más popular esta semana"
        end={
          <div className="flex items-center gap-3">
            <PaginationDots count={3} active={0} />
            <ArrowButton direction="prev" />
            <ArrowButton direction="next" variant="dark" />
          </div>
        }
        className="mb-9"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {popularProducts.map((product) => (
          <ProductCard key={product.id} product={product} size="md" />
        ))}
      </div>
    </section>
  );
}
