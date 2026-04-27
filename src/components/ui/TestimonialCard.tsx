import Image from "next/image";
import { Quote, BadgeCheck } from "lucide-react";
import { RatingStars } from "@/components/ui/RatingStars";
import type { Testimonial } from "@/types";

type Props = {
  testimonial: Testimonial;
};

export function TestimonialCard({ testimonial }: Props) {
  return (
    <article className="flex flex-col gap-4 p-7 bg-white rounded-2xl border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-lg transition-all duration-200 h-full">
      <Quote
        size={32}
        className="text-[var(--primary-soft)]"
        fill="currentColor"
        strokeWidth={0}
      />

      <RatingStars value={testimonial.rating} size={16} />

      <p className="text-[15px] leading-relaxed text-[var(--avax-black)] flex-1">
        {testimonial.comment}
      </p>

      <footer className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[var(--primary-soft)] shrink-0">
          {testimonial.avatar ? (
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-[var(--primary)] font-extrabold text-base">
              {testimonial.name.charAt(0)}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-[var(--avax-black)] truncate">
              {testimonial.name}
            </span>
            {testimonial.verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--success)] text-white text-[9px] font-bold">
                <BadgeCheck size={9} />
                Verificado
              </span>
            )}
          </div>
          {(testimonial.location || testimonial.purchasedAgo) && (
            <span className="text-[11px] text-[var(--foreground-subtle)] truncate">
              {[testimonial.location, testimonial.purchasedAgo]
                .filter(Boolean)
                .join(" · ")}
            </span>
          )}
        </div>
      </footer>
    </article>
  );
}
