import {
  Truck,
  ShieldCheck,
  CreditCard,
  RefreshCw,
  Headphones,
  Award,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { BeneficioItem } from "./home-types";

const ICONS: Record<string, LucideIcon> = {
  Truck,
  ShieldCheck,
  CreditCard,
  RefreshCw,
  Headphones,
  Award,
  Sparkles,
};

const DEFAULT_ITEMS: BeneficioItem[] = [
  { icono: "Truck", titulo: "Envío gratis en Lima" },
  { icono: "ShieldCheck", titulo: "100% originales" },
  { icono: "CreditCard", titulo: "Yape · Plin · Tarjeta" },
  { icono: "RefreshCw", titulo: "Cambios y devoluciones" },
];

export function Benefits({ items }: { items?: BeneficioItem[] } = {}) {
  const list = items && items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <section className="container-page py-10">
      <div className="rounded-[28px] bg-[var(--avax-black)] px-6 py-8 sm:px-10 sm:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
          {list.map((item, idx) => {
            const Icon = ICONS[item.icono] ?? Sparkles;
            return (
              <div
                key={`${item.icono}-${idx}`}
                className="flex items-center gap-3.5"
              >
                <span className="inline-flex shrink-0 items-center justify-center w-11 h-11 rounded-2xl bg-white/10 border border-white/15 text-white">
                  <Icon size={20} strokeWidth={2} />
                </span>
                <span className="text-sm sm:text-[15px] font-bold text-white leading-snug">
                  {item.titulo}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
