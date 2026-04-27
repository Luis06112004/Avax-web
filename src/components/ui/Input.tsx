import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
  rounded?: "pill" | "md";
  fullWidth?: boolean;
};

export function Input({
  icon,
  rounded = "md",
  fullWidth,
  className,
  ...rest
}: Props) {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-3 px-4 py-3 bg-[var(--surface-2)] border border-transparent focus-within:border-[var(--primary)] focus-within:bg-white transition-colors",
        rounded === "pill" ? "rounded-full" : "rounded-[10px]",
        fullWidth && "w-full",
        className
      )}
    >
      {icon && (
        <span className="inline-flex text-[var(--foreground-subtle)] shrink-0">
          {icon}
        </span>
      )}
      <input
        {...rest}
        className="flex-1 bg-transparent outline-none text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)]"
      />
    </label>
  );
}
