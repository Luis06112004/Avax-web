import Image from "next/image";
import { Package } from "lucide-react";
import { SneakerPlaceholder } from "@/components/ui/SneakerPlaceholder";
import { cn } from "@/lib/utils";
import type { Brand } from "@/types";

type Props = {
  brand: Brand;
};

export function BrandCard({ brand }: Props) {
  const pillStyle = brand.pillColor
    ? { backgroundColor: brand.pillColor }
    : undefined;

  return (
    <article className="group relative overflow-hidden rounded-3xl bg-white aspect-[5/4] cursor-pointer hover:scale-[1.02] transition-transform duration-300">
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white to-[var(--surface-2)]">
        {brand.image ? (
          <Image
            src={brand.image}
            alt={brand.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain p-10"
          />
        ) : (
          <SneakerPlaceholder
            size={140}
            className="text-[var(--avax-blue-medium)]"
          />
        )}
      </div>

      <span
        className={cn(
          "absolute top-5 left-5 inline-flex items-center px-3.5 py-2 rounded-full text-[12px] font-extrabold text-white tracking-wider",
          !pillStyle && "bg-[var(--avax-black)]"
        )}
        style={pillStyle}
      >
        {brand.name.toUpperCase()}
      </span>

      {typeof brand.modelCount === "number" && (
        <span className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold">
          <Package size={12} />
          {brand.modelCount} modelos
        </span>
      )}
    </article>
  );
}
