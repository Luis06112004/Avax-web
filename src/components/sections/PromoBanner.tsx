import { Timer, ArrowRight, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SneakerPlaceholder } from "@/components/ui/SneakerPlaceholder";

export function PromoBanner() {
  return (
    <section className="container-page py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative overflow-hidden rounded-[32px] bg-[var(--avax-black)] p-10 md:p-14 text-white min-h-[380px] flex flex-col justify-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 right-20 w-[340px] h-[340px] rounded-full bg-[var(--primary)] opacity-25 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-[280px] h-[280px] rounded-full bg-[#E63946] opacity-20 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-3 max-w-md">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E63946] text-white text-[11px] font-extrabold tracking-[0.15em] uppercase w-fit">
              <Timer size={12} />
              Oferta limitada
            </span>
            <span className="text-4xl md:text-5xl font-black text-white/60 leading-none mt-2">
              HASTA
            </span>
            <h3 className="text-7xl md:text-8xl font-black leading-none tracking-tight">
              50% OFF
            </h3>
            <p className="text-sm text-white/70 mt-2">
              En todos los modelos seleccionados
            </p>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <Button variant="white" icon={<ArrowRight size={16} />} iconPosition="right">
                Ver ofertas
              </Button>
              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold tracking-[0.15em]">
                <TimerReset size={14} />
                02 : 14 : 36
              </span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[32px] min-h-[380px] bg-[var(--surface-2)]">
          <div className="absolute inset-0 grid grid-cols-3 gap-2 p-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center"
              >
                <SneakerPlaceholder
                  size={48}
                  className={
                    i % 3 === 0
                      ? "text-[var(--avax-blue-light)]"
                      : i % 3 === 1
                        ? "text-[var(--primary)]"
                        : "text-[var(--avax-blue-dark)]"
                  }
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-5 py-3 rounded-full bg-white shadow-xl text-sm font-extrabold text-[var(--avax-black)]">
              + 200 modelos disponibles
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
