import Link from "next/link";
import {
  Award,
  ShieldCheck,
  Truck,
  RefreshCw,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { BrandCard } from "@/components/product/BrandCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { listBrands, type ShopBrand } from "@/lib/shop-api";
import type { Brand } from "@/types";

const PILL_COLORS = ["#1E1E1E", "#C8102E", "#0066CC", "#E63946", "#000000"];

function toBrand(b: ShopBrand, idx: number): Brand {
  return {
    id: b.id,
    name: b.nombre,
    image: b.logo ?? undefined,
    modelCount: b.productos_count,
    pillColor: PILL_COLORS[idx % PILL_COLORS.length],
  };
}

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "100% Originales",
    text: "Garantía oficial de cada marca, con número de serie verificable.",
  },
  {
    icon: Truck,
    title: "Envío gratis Lima",
    text: "Pedidos sobre S/ 200 con seguimiento en tiempo real.",
  },
  {
    icon: RefreshCw,
    title: "30 días para devolver",
    text: "Si no te convence, te devolvemos el dinero sin preguntas.",
  },
];

export default async function MarcasPage() {
  let brands: Brand[] = [];
  let totalModels = 0;
  try {
    const res = await listBrands();
    brands = res.data
      .sort((a, b) => b.productos_count - a.productos_count)
      .map(toBrand);
    totalModels = res.data.reduce((sum, b) => sum + b.productos_count, 0);
  } catch (err) {
    console.error("Marcas fetch failed", err);
  }

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
          <span className="text-[var(--avax-black)] font-semibold">Marcas</span>
        </nav>

        <div className="relative overflow-hidden rounded-[32px] gradient-hero border border-[var(--border)] p-10 md:p-14">
          <div className="pointer-events-none absolute -top-32 -right-20 w-[420px] h-[420px] rounded-full bg-[var(--avax-blue-light)] opacity-20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 w-[380px] h-[380px] rounded-full bg-[var(--avax-blue-dark)] opacity-15 blur-3xl" />

          <div className="relative max-w-2xl flex flex-col gap-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--avax-black)] text-white text-[11px] font-extrabold tracking-[0.15em] uppercase w-fit">
              <Award size={12} />
              Catálogo oficial
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-[var(--avax-black)]">
              Las marcas que mueven{" "}
              <span className="bg-gradient-to-r from-[var(--avax-blue-light)] via-[var(--avax-blue-medium)] to-[var(--avax-blue-dark)] bg-clip-text text-transparent">
                el deporte
              </span>
            </h1>
            <p className="text-base md:text-lg text-[var(--foreground-muted)] max-w-xl">
              Trabajamos con las marcas más reconocidas del mercado. Productos
              originales, garantía verificada y los últimos lanzamientos
              disponibles para Perú.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <SectionHeader
          tag={{ label: "Catálogo de marcas", icon: <Award size={14} /> }}
          title="Marcas disponibles"
          subtitle={`Más de ${totalModels} modelos en stock entre todas nuestras marcas oficiales.`}
          end={
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[var(--border-strong)] text-sm font-bold text-[var(--avax-black)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
            >
              Ver toda la tienda
              <ArrowUpRight size={14} />
            </Link>
          }
          className="mb-9"
        />

        {brands.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center text-sm text-[var(--foreground-muted)]">
            Aún no hay marcas. Sincroniza el catálogo desde el panel admin.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        )}
      </section>

      <section className="container-page py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex flex-col gap-3 p-7 rounded-2xl bg-white border border-[var(--border)] hover:border-[var(--primary)] hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            >
              <span className="inline-flex w-12 h-12 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] items-center justify-center">
                <Icon size={20} />
              </span>
              <h3 className="text-lg font-extrabold text-[var(--avax-black)]">
                {title}
              </h3>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="relative overflow-hidden rounded-[32px] bg-[var(--avax-black)] p-10 md:p-14">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 right-20 w-[340px] h-[340px] rounded-full bg-[var(--primary)] opacity-30 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-[280px] h-[280px] rounded-full bg-[var(--avax-blue-light)] opacity-20 blur-3xl" />
          </div>

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl flex flex-col gap-3">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                ¿Listo para encontrar las tuyas?
              </h2>
              <p className="text-sm md:text-base text-white/70">
                Explora el catálogo completo y filtra por marca, talla, color y
                precio.
              </p>
            </div>
            <Link href="/tienda">
              <Button
                variant="white"
                size="lg"
                icon={<ArrowRight size={18} />}
                iconPosition="right"
              >
                Ir al catálogo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
