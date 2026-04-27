import { Instagram, Plus, ImageIcon } from "lucide-react";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { listFeatured, listOnSale } from "@/lib/shop-api";

export async function InstagramFeed() {
  let images: string[] = [];
  try {
    const [feat, sale] = await Promise.all([listFeatured(), listOnSale()]);
    images = Array.from(
      new Set([...feat.data, ...sale.data].map((p) => p.image).filter(Boolean)),
    ).slice(0, 5);
  } catch (err) {
    console.error("InstagramFeed fetch failed", err);
  }

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
            href="https://www.instagram.com/avax_pe/"
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => {
          const img = images[i];
          return (
            <a
              key={i}
              href="https://www.instagram.com/avax_pe/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group aspect-square overflow-hidden rounded-2xl bg-white cursor-pointer"
            >
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-3)]">
                  <ImageIcon
                    size={48}
                    strokeWidth={1.25}
                    className="text-[var(--foreground-subtle)] opacity-50"
                  />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <Instagram
                  size={28}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
