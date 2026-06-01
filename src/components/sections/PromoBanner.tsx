import Link from "next/link";
import { Timer, ArrowRight, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MobileScroller } from "@/components/layout/MobileScroller";

export function PromoBanner({
  titulo,
  subtitulo,
  etiqueta,
  botonTexto,
  botonLink,
}: {
  titulo?: string;
  subtitulo?: string;
  etiqueta?: string;
  botonTexto?: string;
  botonLink?: string;
} = {}) {
  const href = botonLink ?? "/ofertas";

  return (
    <section className="container-page py-10">
      <MobileScroller desktopGrid="lg:grid-cols-2" itemWidth="wide">
        {/* Card 50% OFF */}
        <div className="relative overflow-hidden rounded-[32px] bg-[var(--avax-black)] p-8 sm:p-10 md:p-14 text-white min-h-[360px] sm:min-h-[380px] flex flex-col justify-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 right-20 w-[340px] h-[340px] rounded-full bg-[var(--primary)] opacity-25 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-[280px] h-[280px] rounded-full bg-[#E63946] opacity-20 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-3 max-w-md">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E63946] text-white text-[11px] font-extrabold tracking-[0.15em] uppercase w-fit">
              <Timer size={12} />
              {etiqueta ?? "Oferta limitada"}
            </span>
            {titulo ? (
              <h3 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mt-2 whitespace-pre-line">
                {titulo}
              </h3>
            ) : (
              <>
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white/60 leading-none mt-2">
                  HASTA
                </span>
                <h3 className="text-6xl sm:text-7xl md:text-8xl font-black leading-none tracking-tight">
                  50% OFF
                </h3>
              </>
            )}
            <p className="text-sm text-white/70 mt-2">
              {subtitulo ?? "En todos los modelos seleccionados"}
            </p>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <Link href={href}>
                <Button
                  variant="white"
                  icon={<ArrowRight size={16} />}
                  iconPosition="right"
                >
                  {botonTexto ?? "Ver ofertas"}
                </Button>
              </Link>
              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold tracking-[0.15em]">
                <TimerReset size={14} />
                02 : 14 : 36
              </span>
            </div>
          </div>
        </div>

        {/* Card lifestyle */}
        <Link
          href={href}
          className="relative overflow-hidden rounded-[32px] min-h-[360px] sm:min-h-[380px] block group cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/sections/promo-lifestyle.png"
            alt="Estilo de calle con sneakers premium"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-3">
            <span className="px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-xl text-sm font-extrabold text-[var(--avax-black)]">
              Lookbook urbano · 2026
            </span>
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white text-[var(--avax-black)] shadow-md group-hover:bg-[var(--avax-black)] group-hover:text-white transition-colors">
              <ArrowRight size={16} />
            </span>
          </div>
        </Link>
      </MobileScroller>
    </section>
  );
}
