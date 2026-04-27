import { cn } from "@/lib/utils";

type Props = {
  size?: number;
  className?: string;
  /** Color del icono. Por defecto usa currentColor del padre. */
  color?: string;
};

/**
 * Placeholder visual para una zapatilla mientras no haya imagen real.
 * Inspirado en lucide pero con trazo más completo y profesional.
 */
export function SneakerPlaceholder({ size = 120, className, color }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={color ?? "currentColor"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("opacity-30", className)}
      aria-hidden="true"
    >
      <path d="M4 44 L4 50 L60 50 L60 44 L48 44 L40 36 L28 36 L20 40 L12 40 L8 42 Z" />
      <path d="M20 40 L20 36 L24 32 L28 36" />
      <path d="M28 36 L34 30 L40 36" />
      <path d="M14 44 L14 50" />
      <path d="M22 44 L22 50" />
      <path d="M30 44 L30 50" />
      <path d="M38 44 L38 50" />
      <path d="M46 44 L46 50" />
      <path d="M54 44 L54 50" />
      <circle cx="48" cy="40" r="1.5" />
      <circle cx="52" cy="40" r="1.5" />
    </svg>
  );
}
