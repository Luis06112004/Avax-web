import Link from "next/link";
import { Calendar, ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SneakerPlaceholder } from "@/components/ui/SneakerPlaceholder";

export function NewReleases() {
  return (
    <section className="container-page py-14">
      <SectionHeader
        tag={{
          label: "Drops 2026",
          icon: <Calendar size={14} />,
        }}
        title="Nuevos Lanzamientos"
        end={
          <Link
            href="/lanzamientos"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[var(--border-strong)] text-sm font-bold text-[var(--avax-black)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
          >
            Ver todo
            <ArrowUpRight size={14} />
          </Link>
        }
        className="mb-9"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article className="group relative overflow-hidden rounded-[28px] bg-[var(--avax-black)] min-h-[420px] flex flex-col justify-end p-9 cursor-pointer">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-[320px] h-[320px] rounded-full bg-[var(--primary)] opacity-30 blur-3xl" />
          </div>

          <div className="absolute top-6 right-6 transition-transform duration-300 group-hover:scale-110">
            <SneakerPlaceholder size={200} className="text-white opacity-40" />
          </div>

          <div className="relative flex flex-col gap-2.5 z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-[10px] font-extrabold tracking-[0.15em] text-[var(--avax-black)] w-fit">
              AIR JORDAN
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-white leading-none">
              Air Jordan 3 Retro
            </h3>
            <p className="text-sm text-white/70">
              Edición limitada · Stock mínimo
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[var(--avax-black)] text-sm font-extrabold w-fit mt-2 hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
            >
              Comprar S/ 599
              <ArrowRight size={14} />
            </button>
          </div>
        </article>

        <article className="group relative overflow-hidden rounded-[28px] bg-[var(--surface-2)] min-h-[420px] flex flex-col justify-end p-9 cursor-pointer">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 right-12 w-[300px] h-[300px] rounded-full bg-[var(--primary)] opacity-20 blur-3xl" />
          </div>

          <div className="absolute top-6 right-6 transition-transform duration-300 group-hover:scale-110">
            <SneakerPlaceholder size={200} className="text-[var(--avax-black)] opacity-30" />
          </div>

          <div className="relative flex flex-col gap-2.5 z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--avax-black)] text-[10px] font-extrabold tracking-[0.15em] text-white w-fit">
              YEEZY
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-[var(--avax-black)] leading-none">
              Yeezy Boost 350 V2
            </h3>
            <p className="text-sm text-[var(--foreground-muted)]">
              Comodidad y diseño premium
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--avax-black)] text-white text-sm font-extrabold w-fit mt-2 hover:bg-black transition-colors cursor-pointer"
            >
              Comprar S/ 899
              <ArrowRight size={14} />
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
