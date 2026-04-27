"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Timer,
  ArrowRight,
  Flame,
  TimerReset,
  Percent,
  Tag,
} from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/Button";
import { listOnSale, type ShopProduct } from "@/lib/shop-api";
import type { Product } from "@/types";

function toProduct(p: ShopProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    price: p.price,
    oldPrice: p.oldPrice ?? undefined,
    discountLabel: p.discountLabel ?? undefined,
    image: p.image,
    badge: p.badge ?? undefined,
    rating: p.rating,
    stock: p.stock,
  };
}

function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return { h: pad(h), m: pad(m), s: pad(s) };
}

export default function OfertasPage() {
  const { h, m, s } = useCountdown(8 * 3600 + 14 * 60 + 36);
  const [offers, setOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await listOnSale();
        if (alive) setOffers(res.data.map(toProduct));
      } catch (err) {
        console.error("Ofertas fetch failed", err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <section className="container-page pt-10 pb-6">
        <nav className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] mb-6">
          <Link
            href="/"
            className="hover:text-[var(--avax-black)] transition-colors"
          >
            Inicio
          </Link>
          <span>/</span>
          <span className="text-[var(--avax-black)] font-semibold">Ofertas</span>
        </nav>

        <div className="relative overflow-hidden rounded-[32px] bg-[var(--avax-black)] p-10 md:p-14 lg:p-16 min-h-[420px] flex flex-col justify-center">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 right-20 w-[420px] h-[420px] rounded-full bg-[var(--primary)] opacity-30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-[320px] h-[320px] rounded-full bg-[#E63946] opacity-25 blur-3xl" />
          </div>

          <div className="relative max-w-2xl flex flex-col gap-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E63946] text-white text-[11px] font-extrabold tracking-[0.15em] uppercase w-fit">
              <Timer size={12} />
              Oferta limitada
            </span>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight text-white">
              Hasta{" "}
              <span className="bg-gradient-to-r from-[var(--avax-blue-light)] to-white bg-clip-text text-transparent">
                50% OFF
              </span>
            </h1>

            <p className="text-base md:text-lg text-white/70 max-w-lg">
              Descuentos en modelos seleccionados de Nike, Adidas, New Balance y
              más. Solo hasta agotar stock.
            </p>

            <div className="flex items-center gap-3 flex-wrap mt-2">
              <span className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur text-white font-mono text-lg font-bold tracking-wider">
                <TimerReset size={18} />
                {h} : {m} : {s}
              </span>
              <Button
                variant="white"
                size="lg"
                icon={<ArrowRight size={18} />}
                iconPosition="right"
                onClick={() =>
                  document
                    .getElementById("ofertas-grid")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Ver ofertas
              </Button>
            </div>

            <div className="flex items-center gap-5 flex-wrap mt-2 text-xs text-white/60">
              <span className="inline-flex items-center gap-1.5">
                <Percent size={12} className="text-[var(--avax-blue-light)]" />
                Hasta 50% en marcas top
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Tag size={12} className="text-[var(--avax-blue-light)]" />
                {offers.length} productos en oferta
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="ofertas-grid" className="container-page py-10 scroll-mt-24">
        <SectionHeader
          tag={{
            label: "Aprovecha ahora",
            icon: <Flame size={14} />,
            className: "bg-[#FEE2E2] text-[#B91C1C]",
          }}
          title="Productos en oferta"
          subtitle="Stock limitado. Una vez se agote no volvemos a tener estos precios."
          className="mb-9"
        />

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl bg-[var(--surface-2)] animate-pulse"
              />
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center text-sm text-[var(--foreground-muted)]">
            Aún no hay productos en oferta. Vuelve pronto.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {offers.map((p) => (
              <ProductCard key={p.id} product={p} size="sm" />
            ))}
          </div>
        )}
      </section>

      <section className="container-page pb-16">
        <div className="relative overflow-hidden rounded-[32px] gradient-promo p-10 md:p-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -left-20 w-[320px] h-[320px] rounded-full bg-white opacity-15 blur-3xl" />
          </div>
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="max-w-xl flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                ¿No encontraste lo tuyo?
              </h2>
              <p className="text-sm text-white/85">
                Explora el catálogo completo. Más de 440 modelos disponibles.
              </p>
            </div>
            <Link href="/tienda">
              <Button
                variant="white"
                size="lg"
                icon={<ArrowRight size={18} />}
                iconPosition="right"
              >
                Ver toda la tienda
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
