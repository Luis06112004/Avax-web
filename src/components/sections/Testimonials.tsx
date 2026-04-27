import { MessageCircleHeart, Star } from "lucide-react";
import { testimonials } from "@/data/mock";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { MobileScroller } from "@/components/layout/MobileScroller";

export function Testimonials() {
  return (
    <section className="bg-[var(--background-soft)] py-20">
      <div className="container-page">
        <SectionHeader
          tag={{
            label: "+ 12,000 clientes felices",
            icon: <MessageCircleHeart size={14} />,
            className: "bg-white border border-[var(--border)] text-[var(--primary)]",
          }}
          title="Lo que dicen nuestros clientes"
          subtitle="Reseñas verificadas de compradores reales"
          align="center"
          className="mb-6"
          end={
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm pt-4">
              <span className="inline-flex items-center gap-2 font-bold text-[var(--avax-black)]">
                <Star size={18} className="text-[var(--warning)]" fill="currentColor" />
                4.9 / 5.0
              </span>
              <span className="w-px h-5 bg-[var(--border-strong)]" />
              <span className="font-semibold text-[var(--foreground-muted)]">
                + 12,847 reseñas
              </span>
              <span className="w-px h-5 bg-[var(--border-strong)]" />
              <span className="font-semibold text-[var(--foreground-muted)]">
                98% recomendarían
              </span>
            </div>
          }
        />

        <div className="mt-12">
          <MobileScroller desktopGrid="lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </MobileScroller>
        </div>
      </div>
    </section>
  );
}
