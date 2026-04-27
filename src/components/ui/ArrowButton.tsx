import type { ButtonHTMLAttributes } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Direction = "prev" | "next";
type Shape = "round" | "square";
type Variant = "default" | "primary" | "accent" | "dark" | "glass";
type Size = "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  direction: Direction;
  shape?: Shape;
  variant?: Variant;
  size?: Size;
};

const variantClasses: Record<Variant, string> = {
  default:
    "bg-white border border-[var(--border-strong)] text-[var(--avax-black)] hover:border-[var(--primary)] hover:text-[var(--primary)] shadow-sm",
  primary:
    "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-md",
  accent:
    "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-md",
  dark: "bg-[var(--avax-black)] hover:bg-black text-white shadow-md",
  glass:
    "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/15",
};

const sizeClasses: Record<Size, string> = {
  md: "w-11 h-11",
  lg: "w-12 h-12",
};

export function ArrowButton({
  direction,
  shape = "round",
  variant = "default",
  size = "lg",
  className,
  ...rest
}: Props) {
  const Icon =
    shape === "round"
      ? direction === "prev"
        ? ChevronLeft
        : ChevronRight
      : direction === "prev"
        ? ArrowLeft
        : ArrowRight;

  return (
    <button
      {...rest}
      aria-label={direction === "prev" ? "Anterior" : "Siguiente"}
      className={cn(
        "inline-flex items-center justify-center transition-all duration-150 cursor-pointer",
        shape === "round" ? "rounded-full" : "rounded-xl",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      <Icon size={shape === "round" ? 20 : 18} />
    </button>
  );
}
