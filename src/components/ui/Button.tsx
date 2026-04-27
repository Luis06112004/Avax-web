import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "outline" | "ghost" | "dark" | "white" | "glass";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white shadow-sm",
  accent:
    "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-sm",
  outline:
    "bg-transparent border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-soft)]",
  ghost:
    "bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--foreground)]",
  dark: "bg-[var(--avax-black)] hover:bg-black text-white shadow-sm",
  white: "bg-white text-[var(--avax-black)] hover:bg-[var(--surface-2)] shadow-sm",
  glass:
    "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/15",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-xs gap-1.5 rounded-[10px]",
  md: "px-5 py-3 text-sm gap-2 rounded-xl",
  lg: "px-7 py-4 text-base gap-2.5 rounded-2xl",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth,
  className,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
    >
      {icon && iconPosition === "left" && (
        <span className="inline-flex">{icon}</span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="inline-flex">{icon}</span>
      )}
    </button>
  );
}
