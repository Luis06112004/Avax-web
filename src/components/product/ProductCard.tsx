"use client";

import Image from "next/image";
import { Heart, ShoppingBag, Plus, Star, Flame } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { SneakerPlaceholder } from "@/components/ui/SneakerPlaceholder";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/types";

type Size = "sm" | "md";

type Props = {
  product: Product;
  size?: Size;
  onAdd?: (product: Product) => void;
  onFavorite?: (product: Product) => void;
};

const imageHeight: Record<Size, string> = {
  sm: "h-[220px]",
  md: "h-[280px]",
};

const titleClass: Record<Size, string> = {
  sm: "text-sm",
  md: "text-lg",
};

const priceClass: Record<Size, string> = {
  sm: "text-base",
  md: "text-xl",
};

export function ProductCard({
  product,
  size = "md",
  onAdd,
  onFavorite,
}: Props) {
  const isSm = size === "sm";

  const renderBadge = () => {
    if (product.discountLabel) {
      return (
        <Badge variant="discount" shape="square">
          {product.discountLabel}
        </Badge>
      );
    }
    if (!product.badge) return null;
    if (product.badge === "HOT") {
      return (
        <Badge variant="hot" icon={<Flame size={10} />}>
          HOT
        </Badge>
      );
    }
    if (product.badge === "NEW") return <Badge variant="new">NEW</Badge>;
    if (product.badge === "SALE") return <Badge variant="sale">SALE</Badge>;
    return null;
  };

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-[var(--border)] overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-[var(--primary)] transition-all duration-200">
      <div
        className={cn(
          "relative w-full flex items-center justify-center bg-gradient-to-br from-[#FAFBFD] to-[#EDF2FA] overflow-hidden",
          imageHeight[size]
        )}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <SneakerPlaceholder
            size={isSm ? 90 : 130}
            className="text-[var(--avax-blue-medium)]"
          />
        )}

        <div className="absolute top-3 left-3 z-10">{renderBadge()}</div>

        <div className="absolute top-3 right-3 z-10">
          <IconButton
            icon={<Heart size={isSm ? 14 : 16} />}
            variant="white"
            size={isSm ? "xs" : "sm"}
            label={`Agregar ${product.name} a favoritos`}
            onClick={() => onFavorite?.(product)}
          />
        </div>
      </div>

      <div className={cn("flex flex-col gap-2", isSm ? "p-4" : "p-5")}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold tracking-[0.15em] text-[var(--foreground-subtle)] uppercase">
            {product.brand}
          </span>
          {product.rating !== undefined && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--avax-black)]">
              <Star
                size={12}
                className="text-[var(--warning)]"
                fill="currentColor"
              />
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>

        <h3
          className={cn(
            "font-extrabold text-[var(--avax-black)] line-clamp-1",
            titleClass[size]
          )}
        >
          {product.name}
        </h3>

        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "font-black text-[var(--avax-black)]",
                priceClass[size]
              )}
            >
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-[11px] line-through text-[var(--foreground-subtle)]">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          {isSm ? (
            <button
              type="button"
              aria-label={`Agregar ${product.name} al carrito`}
              onClick={() => onAdd?.(product)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--avax-black)] text-white hover:bg-black transition-colors cursor-pointer"
            >
              <Plus size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onAdd?.(product)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--avax-black)] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
            >
              <ShoppingBag size={14} />
              Añadir
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
