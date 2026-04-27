import { Instagram, Plus, ImageIcon } from "lucide-react";
import { instagramPosts } from "@/data/mock";
import { SectionHeader } from "@/components/layout/SectionHeader";

export function InstagramFeed() {
  return (
    <section className="container-page py-14">
      <SectionHeader
        tag={{
          label: "@avax.style",
          icon: <Instagram size={14} className="text-white" />,
          className:
            "bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white",
        }}
        title="Síguenos en Instagram"
        subtitle="Inspiración diaria · Lookbook · Drops exclusivos"
        end={
          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--avax-black)] text-white text-sm font-bold hover:bg-black transition-colors cursor-pointer"
          >
            Seguir
            <Plus size={14} />
          </button>
        }
        className="mb-8"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {instagramPosts.map((post) => (
          <a
            key={post.id}
            href={post.link ?? "#"}
            className="relative group aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-3)] cursor-pointer"
          >
            <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ImageIcon
                size={48}
                strokeWidth={1.25}
                className="text-[var(--foreground-subtle)] opacity-50"
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <Instagram
                size={28}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
