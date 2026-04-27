import Link from "next/link";
import { ArrowUpRight, Package } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { cn } from "@/lib/utils";
import type { Brand } from "@/types";

type Props = {
  brand: Brand;
};

export function BrandCard({ brand }: Props) {
  const pillStyle = brand.pillColor
    ? { backgroundColor: brand.pillColor }
    : undefined;

  const href = `/tienda?q=${encodeURIComponent(brand.name)}`;

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-3xl bg-white aspect-[5/4] cursor-pointer hover:scale-[1.02] transition-transform duration-300 shadow-sm hover:shadow-xl"
    >
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white via-white to-[var(--surface-2)]">
        {brand.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.image}
            alt={brand.name}
            className="absolute inset-0 w-full h-full object-contain p-10"
            loading="lazy"
          />
        ) : (
          <BrandLogo name={brand.name} size="lg" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
      </div>

      <span
        className={cn(
          "absolute top-5 left-5 inline-flex items-center px-3.5 py-2 rounded-full text-[12px] font-extrabold text-white tracking-wider",
          !pillStyle && "bg-[var(--avax-black)]",
        )}
        style={pillStyle}
      >
        {brand.name.toUpperCase()}
      </span>

      <span className="absolute top-5 right-5 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-md text-[var(--avax-black)] opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight size={16} />
      </span>

      {typeof brand.modelCount === "number" && brand.modelCount > 0 && (
        <span className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-sm text-white text-[11px] font-semibold">
          <Package size={12} />
          {brand.modelCount} modelos
        </span>
      )}
    </Link>
  );
}
