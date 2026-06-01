import type { ShopProduct } from "@/lib/shop-api";

export type DeviceKey = "desktop" | "tablet" | "mobile";

/** Sección resuelta que devuelve el endpoint público /home/secciones. */
export interface SeccionResuelta {
  id: number;
  tipo: string;
  titulo: string | null;
  subtitulo: string | null;
  orden: number;
  datos: Record<string, unknown>;
}

export interface HomeCategoria {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen: string | null;
  productos_count: number;
}

export interface HomeMarca {
  id: string;
  nombre: string;
  slug: string;
  logo: string | null;
  productos_count: number;
}

export interface BeneficioItem {
  icono: string;
  titulo: string;
}

export interface ExploracionItem {
  titulo: string;
  imagen: string;
  link: string;
}

export type { ShopProduct };
