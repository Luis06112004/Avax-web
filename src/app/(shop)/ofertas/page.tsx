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
import type { Product } from "@/types";

const OFFERS: Product[] = [
  {
    id: "o1",
    slug: "nike-air-max-sc",
    name: "Nike Air Max SC",
    brand: "NIKE",
    price: 349,
    oldPrice: 449,
    discountLabel: "-22%",
    image: "",
    rating: 4.9,
    badge: "HOT",
  },
  {
    id: "o2",
    slug: "adidas-forum-low",
    name: "Adidas Forum Low",
    brand: "ADIDAS",
    price: 329,
    oldPrice: 399,
    discountLabel: "-18%",
    image: "",
    rating: 4.8,
  },
  {
    id: "o3",
    slug: "nb-574",
    name: "New Balance 574",
    brand: "NEW BALANCE",
    price: 299,
    oldPrice: 359,
    discountLabel: "-17%",
    image: "",
    rating: 4.7,
  },
  {
    id: "o4",
    slug: "nike-dunk-low",
    name: "Nike Dunk Low",
    brand: "NIKE",
    price: 379,
    oldPrice: 459,
    discountLabel: "-30%",
    image: "",
    rating: 4.9,
    badge: "HOT",
  },
  {
    id: "o5",
    slug: "puma-suede-classic",
    name: "Puma Suede Classic",
    brand: "PUMA",
    price: 219,
    oldPrice: 299,
    discountLabel: "-27%",
    image: "",
    rating: 4.5,
  },
  {
    id: "o6",
    slug: "converse-chuck-70",
    name: "Converse Chuck 70",
    brand: "CONVERSE",
    price: 269,
    oldPrice: 339,
    discountLabel: "-21%",
    image: "",
    rating: 4.6,
  },
  {
    id: "o7",
    slug: "reebok-classic",
    name: "Reebok Classic",
    brand: "REEBOK",
    price: 229,
    oldPrice: 299,
    discountLabel: "-23%",
    image: "",
    rating: 4.7,
  },
  {
    id: "o8",
    slug: "adidas-superstar",
    name: "Adidas Superstar",
    brand: "ADIDAS",
    price: 289,
    oldPrice: 359,
    discountLabel: "-19%",
    image: "",
    rating: 5.0,
  },
];

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
  // 8 horas en segundos para demo del countdown
  const { h, m, s } = useCountdown(8 * 3600 + 14 * 60 + 36);

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
                {OFFERS.length} productos en oferta
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {OFFERS.map((p) => (
            <ProductCard key={p.id} product={p} size="sm" />
          ))}
        </div>
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
