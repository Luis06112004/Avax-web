/**
 * Cliente publico del catalogo (lectura) para la tienda.
 * Apunta al backend Laravel /api/shop/*.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8010/api";

export type ShopProduct = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number | null;
  discountLabel: string | null;
  image: string;
  images: string[];
  sizes: (number | string)[];
  colors: string[];
  badge: "HOT" | "NEW" | "SALE" | null;
  gender: "HOMBRE" | "MUJER" | "UNISEX" | null;
  stock: number;
  rating: number;
};

export type ShopProductDetail = ShopProduct & {
  description_long: string | null;
  tallas_detalle: { talla: string; precio_final: number; stock: number }[];
};

export type ShopBrand = {
  id: string;
  nombre: string;
  slug: string;
  logo: string | null;
  productos_count: number;
};

export type ShopCategory = {
  id: string;
  nombre: string;
  slug: string;
  imagen: string | null;
  productos_count: number;
};

export type Pagination = {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
};

const headers: HeadersInit = {
  Accept: "application/json",
};

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { ...headers, ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export type ListProductsParams = {
  q?: string;
  marca?: string;
  categoria?: string;
  genero?: "HOMBRE" | "MUJER" | "UNISEX";
  precio_min?: number;
  precio_max?: number;
  sort?: "nuevos" | "precio_asc" | "precio_desc" | "nombre";
  per_page?: number;
  page?: number;
};

export async function listProducts(
  params: ListProductsParams = {},
): Promise<{ data: ShopProduct[]; pagination: Pagination }> {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  }
  const url = `${API_BASE}/shop/productos${sp.toString() ? `?${sp}` : ""}`;
  return fetchJSON(url);
}

export async function listPopular(): Promise<{ data: ShopProduct[] }> {
  return fetchJSON(`${API_BASE}/shop/productos/populares`);
}

export async function listFeatured(): Promise<{ data: ShopProduct[] }> {
  return fetchJSON(`${API_BASE}/shop/productos/destacados`);
}

export async function listOnSale(): Promise<{ data: ShopProduct[] }> {
  return fetchJSON(`${API_BASE}/shop/productos/ofertas`);
}

export async function getProductBySlug(
  slug: string,
): Promise<{ data: ShopProductDetail }> {
  return fetchJSON(`${API_BASE}/shop/productos/${encodeURIComponent(slug)}`);
}

export async function listBrands(): Promise<{ data: ShopBrand[] }> {
  return fetchJSON(`${API_BASE}/shop/marcas`);
}

export async function listCategories(): Promise<{ data: ShopCategory[] }> {
  return fetchJSON(`${API_BASE}/shop/categorias`);
}
