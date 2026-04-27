import {
  ShoppingCart,
  ShoppingBag,
  Search,
  User,
  Heart,
  Mail,
  Sparkles,
  Flame,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Calendar,
} from "lucide-react";
import {
  Button,
  Badge,
  IconButton,
  ArrowButton,
  Input,
  Card,
  RatingStars,
  PaginationDots,
  TestimonialCard,
} from "@/components/ui";
import { ProductCard, BrandCard } from "@/components/product";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { brands, popularProducts, featuredProducts, testimonials } from "@/data/mock";

export const metadata = {
  title: "Componentes — AVAX Web",
  description: "Showcase del sistema de componentes UI premium",
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-6 py-10 border-b border-[var(--border)]">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-extrabold text-[var(--avax-black)]">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-[var(--foreground-muted)]">{description}</p>
        )}
      </header>
      {children}
    </section>
  );
}

export default function ComponentesPage() {
  return (
    <div className="container-page py-12">
      <header className="mb-8 pb-8 border-b border-[var(--border)]">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-extrabold tracking-[0.15em] uppercase bg-[var(--primary-soft)] text-[var(--primary)] mb-3">
          <Sparkles size={14} /> DESIGN SYSTEM
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-[var(--avax-black)] mb-2">
          AVAX Web — Sistema de componentes
        </h1>
        <p className="text-[var(--foreground-muted)] max-w-2xl">
          Componentes UI premium para el e-commerce. Mismo branding, mismas
          reglas de espaciado, mismo lenguaje visual.
        </p>
      </header>

      {/* BUTTONS */}
      <Section
        title="Buttons"
        description="Variantes: primary, accent, dark, white, outline, ghost, glass — en 3 tamaños."
      >
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="dark">Dark</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="white">White</Button>
          <Button variant="ghost">Ghost</Button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="dark" icon={<ShoppingBag size={16} />}>
            Comprar ahora
          </Button>
          <Button
            variant="primary"
            icon={<ArrowRight size={16} />}
            iconPosition="right"
          >
            Ver más
          </Button>
          <Button variant="dark" size="sm">
            Pequeño
          </Button>
          <Button variant="dark" size="lg">
            Grande
          </Button>
        </div>
      </Section>

      {/* BADGES */}
      <Section
        title="Badges"
        description="Etiquetas con icono opcional."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="hot" icon={<Flame size={10} />}>
            HOT
          </Badge>
          <Badge variant="new">NEW</Badge>
          <Badge variant="sale">SALE</Badge>
          <Badge variant="discount" shape="square">
            -30%
          </Badge>
          <Badge variant="success">EN STOCK</Badge>
          <Badge variant="verified" icon={<BadgeCheck size={10} />}>
            Verificado
          </Badge>
          <Badge variant="soft" icon={<Calendar size={10} />}>
            DROPS 2026
          </Badge>
        </div>
      </Section>

      {/* ICON BUTTONS */}
      <Section
        title="Icon Buttons"
        description="Botones circulares con variantes default, dark, primary, accent, white, glass."
      >
        <div className="flex flex-wrap items-center gap-4">
          <IconButton icon={<Search size={20} />} label="Buscar" />
          <IconButton
            icon={<ShoppingCart size={20} />}
            variant="dark"
            label="Carrito"
          />
          <IconButton icon={<User size={20} />} label="Mi cuenta" />
          <IconButton
            icon={<Heart size={20} />}
            variant="accent"
            label="Favoritos"
          />
          <IconButton
            icon={<Heart size={16} />}
            variant="white"
            label="Favoritos"
            size="sm"
          />
        </div>
      </Section>

      {/* ARROWS */}
      <Section
        title="Arrow Buttons"
        description="Controles de carrusel."
      >
        <div className="flex flex-wrap items-center gap-4">
          <ArrowButton direction="prev" shape="round" />
          <ArrowButton direction="next" shape="round" variant="dark" />
          <ArrowButton direction="prev" shape="square" />
          <ArrowButton direction="next" shape="square" variant="primary" />
        </div>
      </Section>

      {/* PAGINATION & RATING */}
      <Section title="Pagination & Rating">
        <div className="flex flex-wrap items-center gap-12">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
              Dots
            </span>
            <PaginationDots count={5} active={1} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider">
              Rating
            </span>
            <RatingStars value={5} />
          </div>
        </div>
      </Section>

      {/* INPUT */}
      <Section title="Inputs">
        <div className="flex flex-col gap-4 max-w-lg">
          <Input
            icon={<Search size={18} />}
            rounded="pill"
            placeholder="Buscar productos..."
            fullWidth
          />
          <Input
            icon={<Mail size={18} />}
            type="email"
            placeholder="correo@ejemplo.com"
            fullWidth
          />
        </div>
      </Section>

      {/* SECTION HEADER */}
      <Section
        title="Section Header"
        description="Header reutilizable con tag pill, título, subtítulo y slot derecho."
      >
        <SectionHeader
          tag={{
            label: "TRENDING AHORA",
            icon: <Flame size={14} />,
          }}
          title="Lo más popular esta semana"
          end={
            <div className="flex items-center gap-3">
              <PaginationDots count={3} active={0} />
              <ArrowButton direction="prev" />
              <ArrowButton direction="next" variant="dark" />
            </div>
          }
        />

        <SectionHeader
          tag={{
            label: "+12,000 CLIENTES",
            icon: <BadgeCheck size={14} />,
          }}
          title="Lo que dicen nuestros clientes"
          subtitle="Reseñas verificadas de compradores reales"
          align="center"
        />
      </Section>

      {/* PRODUCT CARDS - UNIFIED */}
      <Section
        title="Product Cards (unificado)"
        description="UN SOLO componente con dos tamaños: md (default) y sm. Todas las cards del sitio salen de aquí."
      >
        <div className="flex flex-col gap-3">
          <span className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-bold">
            Size: md
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularProducts.map((p) => (
              <ProductCard key={p.id} product={p} size="md" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <span className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider font-bold">
            Size: sm
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} size="sm" />
            ))}
          </div>
        </div>
      </Section>

      {/* BRAND CARDS */}
      <Section
        title="Brand Cards"
        description="Cards de marca con imagen, pill de logo y count de modelos."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((b) => (
            <BrandCard key={b.id} brand={b} />
          ))}
        </div>
      </Section>

      {/* TESTIMONIAL CARDS */}
      <Section
        title="Testimonial Cards"
        description="Avatar + verified badge + ubicación + tiempo de compra."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </Section>

      {/* GENERIC CARD */}
      <Section title="Card (genérica)">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padding="lg">
            <h3 className="font-extrabold mb-1">Card default</h3>
            <p className="text-sm text-[var(--foreground-muted)]">
              Fondo blanco con border.
            </p>
          </Card>
          <Card variant="soft" padding="lg">
            <h3 className="font-extrabold mb-1">Card soft</h3>
            <p className="text-sm text-[var(--foreground-muted)]">
              Fondo gris suave.
            </p>
          </Card>
          <Card variant="dark" padding="lg">
            <h3 className="font-extrabold mb-1">Card dark</h3>
            <p className="text-sm text-white/70">
              Fondo negro premium.
            </p>
            <div className="mt-3">
              <Button variant="white" size="sm" icon={<ArrowUpRight size={14} />}>
                Acción
              </Button>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
