"use client";

import { cn } from "@/lib/utils";

type Props = {
  count: number;
  active: number;
  onSelect?: (index: number) => void;
  className?: string;
};

export function PaginationDots({ count, active, onSelect, className }: Props) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === active;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect?.(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className={cn(
              "rounded-full transition-all duration-200",
              isActive
                ? "w-6 h-2 bg-[var(--primary)]"
                : "w-2 h-2 bg-[var(--border-strong)] hover:bg-[var(--foreground-subtle)]"
            )}
          />
        );
      })}
    </div>
  );
}
