import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "primary" | "accent" | "dark" | "white" | "glass";
type Size = "xs" | "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  variant?: Variant;
  size?: Size;
  label: string;
};

const variantClasses: Record<Variant, string> = {
  default:
    "bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--foreground)]",
  primary:
    "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white",
  accent:
    "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white",
  dark: "bg-[var(--avax-black)] hover:bg-black text-white",
  white: "bg-white text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--primary)] shadow-sm",
  glass: "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/15",
};

const sizeClasses: Record<Size, string> = {
  xs: "w-8 h-8 [&>svg]:w-3.5 [&>svg]:h-3.5",
  sm: "w-9 h-9",
  md: "w-11 h-11",
  lg: "w-12 h-12",
};

export function IconButton({
  icon,
  variant = "default",
  size = "md",
  label,
  className,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors duration-150 cursor-pointer",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {icon}
    </button>
  );
}
