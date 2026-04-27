"use client";

import Link from "next/link";
import { useState } from "react";
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
import { SneakerPlaceholder } from "@/components/ui/SneakerPlaceholder";
import { formatPrice, cn } from "@/lib/utils";

export type HeroSlide = {
  id: string;
  brand: string;
  nameTop: string;
  nameBottom: string;
  description: string;
  price: number;
  oldPrice: number | null;
  rating: number;
  reviews: number;
  image: string;
  thumbs: string[];
};

type Props = {
  slides: HeroSlide[];
};

export function HeroCarousel({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  if (!slide) {
    return (
      <section className="container-page pt-8 pb-10">
        <div className="rounded-[32px] gradient-hero border border-[var(--border)] min-h-[480px] flex items-center justify-center">
          <span className="text-[var(--foreground-muted)]">
            Sincroniza el catálogo para mostrar productos.
          </span>
        </div>
      </section>
    );
  }

  const goPrev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const goNext = () => setIndex((i) => (i + 1) % slides.length);

  const discount =
    slide.oldPrice && slide.oldPrice > slide.price
      ? `-${Math.round((1 - slide.price / slide.oldPrice) * 100)}%`
      : null;

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
              {slide.nameTop} <br />
              <span className="bg-gradient-to-r from-[var(--avax-blue-light)] via-[var(--avax-blue-medium)] to-[var(--avax-blue-dark)] bg-clip-text text-transparent">
                {slide.nameBottom}
              </span>
            </h1>

            <p className="text-base md:text-lg text-[var(--foreground-muted)]">
              {slide.description}
            </p>

            <div className="flex items-center flex-wrap gap-3">
              <span className="text-3xl md:text-4xl font-black text-[var(--avax-black)]">
                {formatPrice(slide.price)}
              </span>
              {slide.oldPrice && (
                <div className="flex flex-col">
                  <span className="text-sm line-through text-[var(--foreground-subtle)]">
                    {formatPrice(slide.oldPrice)}
                  </span>
                  {discount && (
                    <span className="text-sm font-extrabold text-[#E63946]">
                      {discount}
                    </span>
                  )}
                </div>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[var(--border)] text-[11px] font-bold text-[var(--avax-black)]">
                <Star
                  size={12}
                  className="text-[var(--warning)]"
                  fill="currentColor"
                />
                {slide.rating.toFixed(1)} · {slide.reviews} reseñas
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link href="/tienda">
                <Button variant="dark" size="lg" icon={<ShoppingBag size={18} />}>
                  Comprar ahora
                </Button>
              </Link>
              <IconButton
                icon={<Heart size={20} />}
                variant="white"
                size="lg"
                label="Añadir a favoritos"
                className="!w-[54px] !h-[54px] !rounded-2xl"
              />
            </div>
          </div>

          <div className="relative flex flex-col items-center lg:items-end gap-6">
            <div className="relative w-full max-w-[480px] aspect-[4/3] rounded-3xl bg-white shadow-xl overflow-hidden">
              {slide.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slide.image}
                  alt={`${slide.nameTop} ${slide.nameBottom}`}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  key={slide.image}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <SneakerPlaceholder
                    size={280}
                    className="text-[var(--avax-blue-medium)] opacity-50"
                  />
                </div>
              )}

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
                <ArrowButton direction="prev" onClick={goPrev} />
                <div className="flex gap-2">
                  {slides.map((s, i) => (
                    <button
                      key={s.id}
                      type="button"
                      aria-label={`Ver ${s.nameTop} ${s.nameBottom}`}
                      onClick={() => setIndex(i)}
                      className={cn(
                        "w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm cursor-pointer overflow-hidden transition-all",
                        i === index
                          ? "border-2 border-[var(--primary)] scale-105"
                          : "border border-[var(--border)] hover:border-[var(--primary)]",
                      )}
                    >
                      {s.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={s.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <SneakerPlaceholder size={32} className="text-[var(--avax-black)] opacity-70" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <ArrowButton direction="next" variant="dark" onClick={goNext} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
