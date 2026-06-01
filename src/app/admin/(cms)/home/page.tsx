"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Layout,
  Star,
  Gift,
  Rocket,
  Bookmark,
  Flame,
  MessageCircleHeart,
  Instagram,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Topbar } from "../../_components/Topbar";
import {
  getSecciones,
  reorderSecciones,
  toggleSeccion,
  type HomeSeccion,
} from "@/lib/home-api";
import { revalidateHome } from "@/lib/revalidate";

const TIPO_META: Record<
  string,
  { label: string; icon: React.ReactNode; description: string; ruta: string }
> = {
  hero: { label: "Hero", icon: <Layout size={18} />, description: "Carrusel principal de productos", ruta: "/admin/home/hero" },
  marcas: { label: "Marcas", icon: <Bookmark size={18} />, description: "Banner de marcas destacadas", ruta: "/admin/home/marcas" },
  popular: { label: "Popular ahora", icon: <Flame size={18} />, description: "Lo más popular de la semana", ruta: "/admin/home/popular" },
  promo_banner: { label: "Banner Promocional", icon: <Gift size={18} />, description: "Banner de oferta", ruta: "/admin/home/promo" },
  nuevos: { label: "Nuevos Lanzamientos", icon: <Rocket size={18} />, description: "Drops y nuevos productos", ruta: "/admin/home/nuevos" },
  destacados: { label: "Productos Destacados", icon: <Star size={18} />, description: "Selección del equipo", ruta: "/admin/home/destacados" },
  testimonios: { label: "Testimonios", icon: <MessageCircleHeart size={18} />, description: "Reseñas de clientes", ruta: "/admin/home/testimonios" },
  instagram: { label: "Instagram", icon: <Instagram size={18} />, description: "Feed de Instagram", ruta: "/admin/home/instagram" },
};

export default function AdminHomePage() {
  const [secciones, setSecciones] = useState<HomeSeccion[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(() => {
    setLoading(true);
    getSecciones()
      .then(setSecciones)
      .catch(() => setSecciones([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const meta = (tipo: string) =>
    TIPO_META[tipo] ?? { label: tipo, icon: <Layers size={18} />, description: "", ruta: "#" };

  const handleToggle = async (s: HomeSeccion) => {
    const next = !s.activo;
    setSecciones((prev) => prev.map((x) => (x.id === s.id ? { ...x, activo: next } : x)));
    try {
      await toggleSeccion(s.id, next);
      await revalidateHome();
    } catch {
      setSecciones((prev) => prev.map((x) => (x.id === s.id ? { ...x, activo: s.activo } : x)));
    }
  };

  const mover = async (id: number, dir: "up" | "down") => {
    const idx = secciones.findIndex((s) => s.id === id);
    if ((dir === "up" && idx === 0) || (dir === "down" && idx === secciones.length - 1)) return;

    const arr = [...secciones];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
    const reordenadas = arr.map((s, i) => ({ ...s, orden: i }));
    setSecciones(reordenadas);

    try {
      await reorderSecciones(reordenadas.map((s) => ({ id: s.id, orden: s.orden })));
      await revalidateHome();
    } catch {
      cargar();
    }
  };

  return (
    <>
      <Topbar
        title="Homepage"
        subtitle="Gestiona las secciones de tu página principal."
        breadcrumbs={[{ label: "AVAX CMS", href: "/admin/dashboard" }, { label: "Homepage" }]}
        actions={
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-white/5 px-4 py-2 text-[13px] font-semibold text-[var(--admin-fg-muted)] transition-colors hover:text-[var(--admin-fg)] hover:border-[var(--primary)]"
          >
            <ExternalLink size={14} />
            Ver tienda
          </a>
        }
      />

      <div className="px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-[860px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24">
              <Loader2 size={24} className="animate-spin text-[var(--admin-fg-subtle)]" />
              <span className="text-[13px] text-[var(--admin-fg-subtle)]">Cargando secciones...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {secciones.map((s, idx) => {
                const m = meta(s.tipo);
                return (
                  <div
                    key={s.id}
                    className={`admin-card-premium overflow-hidden transition-opacity ${s.activo ? "" : "opacity-50"}`}
                  >
                    <div className="flex items-center gap-4 px-5 py-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
                        {m.icon}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[14px] font-bold text-[var(--admin-fg)]">{m.label}</span>
                          <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-[var(--admin-fg-subtle)] tabular-nums">
                            #{idx + 1}
                          </span>
                        </div>
                        <span className="text-[12px] text-[var(--admin-fg-subtle)]">
                          {s.titulo ?? m.description}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => mover(s.id, "up")}
                            disabled={idx === 0}
                            className="flex h-5 w-7 items-center justify-center rounded text-[var(--admin-fg-subtle)] transition-colors hover:bg-white/5 hover:text-[var(--admin-fg)] disabled:opacity-20 cursor-pointer"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            onClick={() => mover(s.id, "down")}
                            disabled={idx === secciones.length - 1}
                            className="flex h-5 w-7 items-center justify-center rounded text-[var(--admin-fg-subtle)] transition-colors hover:bg-white/5 hover:text-[var(--admin-fg)] disabled:opacity-20 cursor-pointer"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleToggle(s)}
                          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors cursor-pointer ${
                            s.activo
                              ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                              : "bg-white/5 text-[var(--admin-fg-subtle)] hover:bg-white/10"
                          }`}
                          title={s.activo ? "Desactivar" : "Activar"}
                        >
                          {s.activo ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>

                        <Link
                          href={m.ruta}
                          className="flex items-center gap-2 rounded-xl bg-[var(--admin-fg)] px-4 py-2 text-[12px] font-bold text-[var(--admin-bg)] transition-colors hover:bg-[var(--primary)] hover:text-white"
                        >
                          Editar
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
