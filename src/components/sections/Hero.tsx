import {
  Sparkles,
  Truck,
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { IconButton } from "@/components/ui/IconButton";
import { Badge } from "@/components/ui/Badge";
import { SneakerPlaceholder } from "@/components/ui/SneakerPlaceholder";
import { formatPrice } from "@/lib/utils";

export function Hero() {
  return (
    <section className="container-page pt-8 pb-10">
      <div className="relative overflow-hidden rounded-[32px] border border-[var(--border)] bg-gradient-to-br from-[#F7F8FB] via-[#EAF1FB] to-[#D9E5F8]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[420px] h-[420px] rounded-full bg-[var(--avax-blue-light)] opacity-25 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[380px] h-[380px] rounded-full bg-[var(--avax-blue-dark)] opacity-15 blur-3xl" />
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-12 lg:p-16 items-center min-h-[520px]">
          <div className="flex flex-col gap-6 max-w-xl">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--avax-black)] text-white text-[11px] font-extrabold tracking-[0.15em] uppercase">
                <Sparkles size={12} />
                Nueva colección
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[var(--border)] text-[var(--foreground-muted)] text-[11px] font-semibold">
                <Truck size={12} className="text-[var(--primary)]" />
                Envío gratis Lima
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight text-[var(--avax-black)]">
              Nike Air <br />
              <span className="bg-gradient-to-r from-[var(--avax-blue-light)] via-[var(--avax-blue-medium)] to-[var(--avax-blue-dark)] bg-clip-text text-transparent">
                Max SC
              </span>
            </h1>

            <p className="text-base md:text-lg text-[var(--foreground-muted)]">
              Diseño icónico que se mantiene fresco. Amortiguación Air-Sole
              visible y materiales premium para tu día a día.
            </p>

            <div className="flex items-center flex-wrap gap-3">
              <span className="text-3xl md:text-4xl font-black text-[var(--avax-black)]">
                {formatPrice(349)}
              </span>
              <div className="flex flex-col">
                <span className="text-sm line-through text-[var(--foreground-subtle)]">
                  {formatPrice(449)}
                </span>
                <span className="text-sm font-extrabold text-[#E63946]">
                  -22%
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[var(--border)] text-[11px] font-bold text-[var(--avax-black)]">
                <Star size={12} className="text-[var(--warning)]" fill="currentColor" />
                4.9 · 248 reseñas
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button variant="dark" size="lg" icon={<ShoppingBag size={18} />}>
                Comprar ahora
              </Button>
              <IconButton
                icon={<Heart size={20} />}
                variant="white"
                size="lg"
                label="Añadir a favoritos"
                className="!w-[54px] !h-[54px] !rounded-2xl"
              />
            </div>
            <Badge variant="hot" className="!hidden">.</Badge>
          </div>

          <div className="relative flex flex-col items-center lg:items-end gap-6">
            <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-3xl bg-white shadow-xl flex items-center justify-center overflow-hidden">
              <SneakerPlaceholder
                size={280}
                className="text-[var(--avax-blue-medium)] opacity-50"
              />

              <div className="absolute top-6 left-6 flex items-center gap-3 px-4 py-2.5 bg-white rounded-2xl border border-[var(--border)] shadow-lg">
                <ShieldCheck size={20} className="text-[var(--success)]" />
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-extrabold text-[var(--avax-black)]">
                    100% original
                  </span>
                  <span className="text-[10px] text-[var(--foreground-subtle)]">
                    Garantía AVAX
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full max-w-[480px] justify-between">
              <div className="flex items-center gap-3">
                <ArrowButton direction="prev" />
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Variante blanco"
                    className="w-14 h-14 rounded-2xl bg-white border-2 border-[var(--primary)] flex items-center justify-center shadow-sm cursor-pointer"
                  >
                    <SneakerPlaceholder size={32} className="text-[var(--avax-black)] opacity-70" />
                  </button>
                  <button
                    type="button"
                    aria-label="Variante negro"
                    className="w-14 h-14 rounded-2xl bg-[var(--avax-black)] border border-[var(--avax-black)] flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <SneakerPlaceholder size={32} className="text-white opacity-70" />
                  </button>
                  <button
                    type="button"
                    aria-label="Variante azul"
                    className="w-14 h-14 rounded-2xl bg-[var(--primary-soft)] border border-[var(--border)] flex items-center justify-center hover:border-[var(--primary)] transition-colors cursor-pointer"
                  >
                    <SneakerPlaceholder size={32} className="text-[var(--primary)] opacity-70" />
                  </button>
                </div>
              </div>
              <ArrowButton direction="next" variant="dark" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
