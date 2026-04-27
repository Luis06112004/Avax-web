import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { brands } from "@/data/mock";
import { BrandCard } from "@/components/product/BrandCard";

export function BrandsBanner() {
  return (
    <section className="container-page py-10">
      <div className="relative rounded-[32px] bg-[var(--avax-black)] overflow-hidden p-8 md:p-12 lg:p-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[380px] h-[380px] rounded-full bg-[var(--primary)] opacity-20 blur-3xl" />
          <div className="absolute top-32 -right-32 w-[340px] h-[340px] rounded-full bg-[var(--accent)] opacity-15 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-10">
          <div className="flex flex-col md:flex-row gap-4 md:items-end md:justify-between">
            <div className="flex flex-col gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E63946] text-white text-[11px] font-extrabold tracking-[0.2em] uppercase w-fit">
                <Sparkles size={12} />
                Marcas
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-[52px] font-black text-white leading-[1.05] tracking-tight">
                Las mejores del mercado
              </h2>
              <p className="text-sm md:text-base text-white/70">
                Trabajamos con las marcas más respetadas del sneaker game.
              </p>
            </div>
            <Link
              href="/marcas"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold hover:bg-white/15 transition-colors w-fit"
            >
              Ver todas las marcas
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
