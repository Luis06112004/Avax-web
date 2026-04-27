import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "soft" | "dark";
type Padding = "none" | "md" | "lg";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  variant?: Variant;
  padding?: Padding;
  hover?: boolean;
};

const variantClasses: Record<Variant, string> = {
  default: "bg-white border-[var(--border)] text-[var(--foreground)]",
  soft: "bg-[var(--surface-2)] border-transparent text-[var(--foreground)]",
  dark: "bg-[var(--avax-black)] border-transparent text-white",
};

const paddingClasses: Record<Padding, string> = {
  none: "",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  children,
  variant = "default",
  padding = "none",
  hover,
  className,
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      className={cn(
        "rounded-2xl border overflow-hidden transition-all duration-200",
        variantClasses[variant],
        paddingClasses[padding],
        hover && "hover:-translate-y-1 hover:shadow-xl hover:border-[var(--primary)]",
        className
      )}
    >
      {children}
    </div>
  );
}
