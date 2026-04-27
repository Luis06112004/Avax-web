import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  max?: number;
  size?: number;
  className?: string;
};

export function RatingStars({ value, max = 5, size = 18, className }: Props) {
  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      aria-label={`${value} de ${max} estrellas`}
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.round(value);
        return (
          <Star
            key={i}
            size={size}
            className={
              filled
                ? "text-[var(--warning)]"
                : "text-[var(--border-strong)]"
            }
            fill={filled ? "currentColor" : "none"}
            strokeWidth={2}
          />
        );
      })}
    </div>
  );
}
