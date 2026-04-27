import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "hot" | "new" | "sale" | "discount" | "success" | "verified" | "soft";
type Shape = "pill" | "square";

type Props = {
  children: ReactNode;
  variant?: Variant;
  shape?: Shape;
  icon?: ReactNode;
  className?: string;
};

const variantClasses: Record<Variant, string> = {
  hot: "bg-[#E63946] text-white",
  new: "bg-[var(--primary)] text-white",
  sale: "bg-[var(--warning)] text-white",
  discount: "bg-[#E63946] text-white",
  success: "bg-[var(--success)] text-white",
  verified: "bg-[var(--success)] text-white",
  soft: "bg-[var(--primary-soft)] text-[var(--primary)]",
};

const shapeClasses: Record<Shape, string> = {
  pill: "rounded-full",
  square: "rounded-md",
};

export function Badge({
  children,
  variant = "hot",
  shape = "pill",
  icon,
  className,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold tracking-wider uppercase",
        variantClasses[variant],
        shapeClasses[shape],
        className
      )}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
