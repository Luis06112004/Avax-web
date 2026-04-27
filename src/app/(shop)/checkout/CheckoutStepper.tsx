"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = {
  id: number;
  label: string;
  href: string;
};

const STEPS: Step[] = [
  { id: 1, label: "Datos de envío", href: "/checkout/datos-envio" },
  { id: 2, label: "Método de envío", href: "/checkout/metodo-envio" },
  { id: 3, label: "Pago", href: "/checkout/pago" },
  { id: 4, label: "Confirmación", href: "/checkout/confirmacion" },
];

type Props = { current: 1 | 2 | 3 | 4 };

export function CheckoutStepper({ current }: Props) {
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4 mb-8 overflow-x-auto">
      {STEPS.map((s, i) => {
        const done = current > s.id;
        const active = current === s.id;
        const isLast = i === STEPS.length - 1;
        return (
          <li key={s.id} className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-colors shrink-0",
                  done && "bg-[var(--avax-black)] text-white",
                  active && "bg-[var(--avax-black)] text-white",
                  !done && !active && "bg-[var(--surface-3)] text-[var(--foreground-muted)]",
                  current === 4 && s.id === 4 && "!bg-[var(--success)]",
                )}
              >
                {done ? <Check size={14} /> : s.id}
              </span>
              <span
                className={cn(
                  "text-xs sm:text-sm font-bold whitespace-nowrap",
                  active
                    ? "text-[var(--avax-black)]"
                    : done
                      ? "text-[var(--avax-black)]"
                      : "text-[var(--foreground-muted)]",
                  current === 4 && s.id === 4 && "!text-[var(--success)]",
                )}
              >
                {s.label}
              </span>
            </div>
            {!isLast && (
              <span
                className={cn(
                  "h-px w-6 sm:w-12",
                  current > s.id ? "bg-[var(--avax-black)]" : "bg-[var(--border-strong)]",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
