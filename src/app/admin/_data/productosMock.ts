/**
 * Productos — API client conectado al backend Laravel.
 *
 * Endpoints expuestos por avax-api (Laravel 12):
 *   fetchProducts()         → GET    /api/admin/productos
 *   getProduct(id)          → GET    /api/admin/productos/{id}
 *   createProduct(data)     → POST   /api/admin/productos
 *   updateProduct(id, data) → PUT    /api/admin/productos/{id}
 *   deleteProduct(id)       → DELETE /api/admin/productos/{id}
 *
 * El nombre del archivo se mantiene como "productosMock" por compatibilidad
 * con los imports actuales del CMS — internamente ya no es mock.
 */

import { getAdminToken } from "@/lib/admin-auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8010/api";

export type ProductStatus = "active" | "draft" | "out_of_stock";
export type ProductBadge = "HOT" | "NEW" | "SALE" | null;

export type AdminProduct = {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  sizes: number[];
  colors: string[];
  badge: ProductBadge;
  status: ProductStatus;
  images: string[];
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = Omit<AdminProduct, "id" | "createdAt" | "updatedAt">;

export const BRANDS = [
  "NIKE",
  "ADIDAS",
  "NEW BALANCE",
  "PUMA",
  "CONVERSE",
  "JORDAN",
  "REEBOK",
] as const;

export const CATEGORIES = [
  "Running",
  "Lifestyle",
  "Skate",
  "Basketball",
  "Casual",
  "Ropa",
  "Accesorios",
] as const;

export const SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45] as const;

export const COLORS = [
  { id: "black", label: "Negro", hex: "#1E1E1E" },
  { id: "white", label: "Blanco", hex: "#F2F2F2" },
  { id: "blue", label: "Azul", hex: "#4A7CCF" },
  { id: "red", label: "Rojo", hex: "#E63946" },
  { id: "green", label: "Verde", hex: "#16A34A" },
  { id: "gray", label: "Gris", hex: "#9CA3AF" },
] as const;

export const STATUS_LABEL: Record<ProductStatus, string> = {
  active: "Activo",
  draft: "Borrador",
  out_of_stock: "Sin stock",
};

/** Headers con el token admin (Bearer) — el grupo /admin requiere auth. */
function authHeaders(): HeadersInit {
  const token = getAdminToken();
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ============================================================================
// API
// ============================================================================

export async function fetchProducts(): Promise<AdminProduct[]> {
  const res = await fetch(`${API_BASE}/admin/productos`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  return handle<AdminProduct[]>(res);
}

export async function getProduct(id: string): Promise<AdminProduct | null> {
  const res = await fetch(`${API_BASE}/admin/productos/${id}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (res.status === 404) return null;
  return handle<AdminProduct>(res);
}

export async function createProduct(data: ProductInput): Promise<AdminProduct> {
  const res = await fetch(`${API_BASE}/admin/productos`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handle<AdminProduct>(res);
}

export async function updateProduct(
  id: string,
  data: ProductInput,
): Promise<AdminProduct> {
  const res = await fetch(`${API_BASE}/admin/productos/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handle<AdminProduct>(res);
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/productos/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  await handle<void>(res);
}
