import { Instagram, Plus } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { MobileScroller } from "@/components/layout/MobileScroller";

const POSTS = [
  "/images/sections/ig-1.png",
  "/images/sections/ig-2.png",
  "/images/sections/ig-3.png",
  "/images/sections/ig-4.png",
  "/images/sections/ig-5.png",
];

const IG_URL = "https://www.instagram.com/avax_pe/";

export function InstagramFeed() {
  return (
    <section className="container-page py-14">
      <SectionHeader
        tag={{
          label: "@avax_pe",
          icon: <Instagram size={14} className="text-white" />,
          className:
            "bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white",
        }}
        title="Síguenos en Instagram"
        subtitle="Inspiración diaria · Lookbook · Drops exclusivos"
        end={
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--avax-black)] text-white text-sm font-bold hover:bg-black transition-colors cursor-pointer"
          >
            Seguir
            <Plus size={14} />
          </a>
        }
        className="mb-8"
      />

      <MobileScroller desktopGrid="lg:grid-cols-5" itemWidth="third">
        {POSTS.map((src, i) => (
          <a
            key={src}
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group aspect-square overflow-hidden rounded-2xl bg-white cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Post ${i + 1} de @avax_pe`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <Instagram
                size={28}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </a>
        ))}
      </MobileScroller>
    </section>
  );
}
