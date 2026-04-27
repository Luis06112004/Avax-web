"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

// Easing curva premium: arranca rápido, frena con elegancia.
const EASE = [0.65, 0, 0.35, 1] as const;

// Stagger inicial: cada elemento entra 80ms después del anterior.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 1.06 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: EASE },
  },
  exit: {
    opacity: 0,
    scale: 1.04,
    transition: { duration: 0.35, ease: EASE },
  },
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
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "calc(100vh - 80px)", minHeight: "640px" }}
    >
      {/* Fondo gradiente fijo (no cambia entre slides) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F7F8FB] via-[#EAF1FB] to-[#D9E5F8]" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-[var(--avax-blue-light)] opacity-30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[460px] h-[460px] rounded-full bg-[var(--avax-blue-dark)] opacity-20 blur-3xl" />
      </div>

      {/* Contenido — proporciones protegidas con max-width y aspect controlado */}
      <div className="relative h-full container-page py-6 lg:py-10">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Lado izquierdo: textos */}
          <motion.div
            key={`text-${slide.id}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-5 max-w-xl mx-auto lg:mx-0 w-full"
          >
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--avax-black)] text-white text-[11px] font-extrabold tracking-[0.15em] uppercase">
                <Sparkles size={12} />
                Nueva colección
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[var(--border)] text-[var(--foreground-muted)] text-[11px] font-semibold">
                <Truck size={12} className="text-[var(--primary)]" />
                Envío gratis Lima
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight text-[var(--avax-black)]"
            >
              {slide.nameTop} <br />
              <span className="bg-gradient-to-r from-[var(--avax-blue-light)] via-[var(--avax-blue-medium)] to-[var(--avax-blue-dark)] bg-clip-text text-transparent">
                {slide.nameBottom}
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-[var(--foreground-muted)] max-w-md"
            >
              {slide.description}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex items-center flex-wrap gap-3"
            >
              <span className="text-3xl md:text-4xl lg:text-5xl font-black text-[var(--avax-black)]">
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
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 pt-2"
            >
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
            </motion.div>
          </motion.div>

          {/* Lado derecho: imagen + thumbs */}
          <div className="relative flex flex-col items-center lg:items-end gap-4 lg:gap-6 h-full justify-center min-h-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
              className="relative w-full max-w-[560px] aspect-square min-h-0 max-h-[min(70vh,560px)] rounded-[32px] bg-white shadow-2xl overflow-hidden"
            >
              <AnimatePresence mode="sync" initial={false}>
                {slide.image ? (
                  <motion.img
                    key={slide.image}
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    src={slide.image}
                    alt={`${slide.nameTop} ${slide.nameBottom}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <SneakerPlaceholder
                      size={320}
                      className="text-[var(--avax-blue-medium)] opacity-50"
                    />
                  </div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, x: -20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.55, ease: EASE, delay: 0.5 }}
                className="absolute top-6 left-6 flex items-center gap-3 px-4 py-2.5 bg-white rounded-2xl border border-[var(--border)] shadow-lg"
              >
                <ShieldCheck size={20} className="text-[var(--success)]" />
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-extrabold text-[var(--avax-black)]">
                    100% original
                  </span>
                  <span className="text-[10px] text-[var(--foreground-subtle)]">
                    Garantía AVAX
                  </span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.6 }}
              className="flex items-center gap-3 w-full max-w-[560px] justify-between"
            >
              <div className="flex items-center gap-3">
                <ArrowButton direction="prev" onClick={goPrev} />
                <div className="flex gap-2">
                  {slides.map((s, i) => (
                    <motion.button
                      key={s.id}
                      type="button"
                      aria-label={`Ver ${s.nameTop} ${s.nameBottom}`}
                      onClick={() => setIndex(i)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm cursor-pointer overflow-hidden transition-colors",
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
                        <SneakerPlaceholder
                          size={32}
                          className="text-[var(--avax-black)] opacity-70"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
              <ArrowButton direction="next" variant="dark" onClick={goNext} />
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  );
}
