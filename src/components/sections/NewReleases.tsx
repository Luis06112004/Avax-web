import Link from "next/link";
import { Calendar, ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SneakerPlaceholder } from "@/components/ui/SneakerPlaceholder";
import { listFeatured, type ShopProduct } from "@/lib/shop-api";
import { formatPrice } from "@/lib/utils";

export async function NewReleases() {
  let products: ShopProduct[] = [];
  try {
    const res = await listFeatured();
    products = res.data.slice(0, 2);
  } catch (err) {
    console.error("NewReleases fetch failed", err);
  }

  const [first, second] = products;

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
            href="/tienda"
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

          <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
            {first?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={first.image}
                alt={first.name}
                className="absolute right-0 top-0 h-full w-2/3 object-cover opacity-90"
                loading="lazy"
              />
            ) : (
              <SneakerPlaceholder
                size={240}
                className="absolute right-8 top-12 text-white opacity-40"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--avax-black)] via-[var(--avax-black)]/70 to-transparent" />
          </div>

          <div className="relative flex flex-col gap-2.5 z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-[10px] font-extrabold tracking-[0.15em] text-[var(--avax-black)] w-fit">
              {first?.brand || "AIR JORDAN"}
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-white leading-none line-clamp-2">
              {first?.name || "Air Jordan 3 Retro"}
            </h3>
            <p className="text-sm text-white/70">
              Edición limitada · Stock mínimo
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[var(--avax-black)] text-sm font-extrabold w-fit mt-2 hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
            >
              Comprar {formatPrice(first?.price ?? 599)}
              <ArrowRight size={14} />
            </button>
          </div>
        </article>

        <article className="group relative overflow-hidden rounded-[28px] bg-[var(--surface-2)] min-h-[420px] flex flex-col justify-end p-9 cursor-pointer">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 right-12 w-[300px] h-[300px] rounded-full bg-[var(--primary)] opacity-20 blur-3xl" />
          </div>

          <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
            {second?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={second.image}
                alt={second.name}
                className="absolute right-0 top-0 h-full w-2/3 object-cover"
                loading="lazy"
              />
            ) : (
              <SneakerPlaceholder
                size={240}
                className="absolute right-8 top-12 text-[var(--avax-black)] opacity-30"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface-2)] via-[var(--surface-2)]/70 to-transparent" />
          </div>

          <div className="relative flex flex-col gap-2.5 z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--avax-black)] text-[10px] font-extrabold tracking-[0.15em] text-white w-fit">
              {second?.brand || "YEEZY"}
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-[var(--avax-black)] leading-none line-clamp-2">
              {second?.name || "Yeezy Boost 350 V2"}
            </h3>
            <p className="text-sm text-[var(--foreground-muted)]">
              Comodidad y diseño premium
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--avax-black)] text-white text-sm font-extrabold w-fit mt-2 hover:bg-black transition-colors cursor-pointer"
            >
              Comprar {formatPrice(second?.price ?? 899)}
              <ArrowRight size={14} />
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}
