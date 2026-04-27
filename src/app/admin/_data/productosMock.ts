/**
 * Productos — Mock API (UI-only)
 *
 * Estas funciones simulan los endpoints que va a exponer Laravel.
 * Cuando el backend esté listo, reemplazar el cuerpo de cada función
 * por un fetch al endpoint correspondiente:
 *
 *   fetchProducts()         → GET    /api/admin/productos
 *   getProduct(id)          → GET    /api/admin/productos/{id}
 *   createProduct(data)     → POST   /api/admin/productos
 *   updateProduct(id, data) → PUT    /api/admin/productos/{id}
 *   deleteProduct(id)       → DELETE /api/admin/productos/{id}
 *
 * Todos los requests deben llevar:
 *   headers: { Authorization: `Bearer ${token}` }
 *
 * Para subida de imágenes usar FormData con el campo "images[]".
 */

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
  images: string[]; // URLs (en mock pueden ser blob: URLs)
  createdAt: string; // ISO
  updatedAt: string; // ISO
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

const NOW = "2026-04-26T20:00:00";

const MOCK: AdminProduct[] = [
  {
    id: "p1",
    sku: "NK-AM90-BK",
    name: "Nike Air Max 90 Negro",
    brand: "NIKE",
    category: "Lifestyle",
    description:
      "Diseño icónico Air Max con amortiguación visible y materiales premium.",
    price: 459,
    oldPrice: 549,
    stock: 24,
    sizes: [38, 39, 40, 41, 42],
    colors: ["black"],
    badge: "HOT",
    status: "active",
    images: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "p2",
    sku: "NK-AM90-RD",
    name: "Nike Air Max 90 Rojo",
    brand: "NIKE",
    category: "Lifestyle",
    description: "Variante en color rojo del clásico Air Max 90.",
    price: 479,
    oldPrice: null,
    stock: 12,
    sizes: [39, 40, 41, 42, 43],
    colors: ["red"],
    badge: "NEW",
    status: "active",
    images: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "p3",
    sku: "NK-AM90-WH",
    name: "Nike Air Max 90 Blanco",
    brand: "NIKE",
    category: "Lifestyle",
    description: "Air Max 90 en colorway blanco total.",
    price: 459,
    oldPrice: null,
    stock: 0,
    sizes: [40, 41, 42],
    colors: ["white"],
    badge: null,
    status: "out_of_stock",
    images: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "p4",
    sku: "AD-SAMBA-BK",
    name: "Adidas Samba OG",
    brand: "ADIDAS",
    category: "Casual",
    description: "Clásico Samba en negro con detalles en blanco.",
    price: 359,
    oldPrice: null,
    stock: 38,
    sizes: [38, 39, 40, 41, 42, 43],
    colors: ["black", "white"],
    badge: "NEW",
    status: "active",
    images: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "p5",
    sku: "NB-9060-GR",
    name: "New Balance 9060",
    brand: "NEW BALANCE",
    category: "Running",
    description: "Diseño retro futurista con tecnología ABZORB.",
    price: 459,
    oldPrice: 519,
    stock: 18,
    sizes: [40, 41, 42, 43],
    colors: ["gray"],
    badge: null,
    status: "active",
    images: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "p6",
    sku: "JR-1MID-BL",
    name: "Jordan 1 Mid",
    brand: "JORDAN",
    category: "Basketball",
    description: "Silueta legendaria en colorway azul.",
    price: 489,
    oldPrice: null,
    stock: 7,
    sizes: [40, 41, 42, 43, 44],
    colors: ["blue", "white"],
    badge: "HOT",
    status: "active",
    images: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "p7",
    sku: "PM-SUEDE-BL",
    name: "Puma Suede Classic",
    brand: "PUMA",
    category: "Lifestyle",
    description: "Modelo icónico de los 70 en gamuza azul.",
    price: 299,
    oldPrice: null,
    stock: 22,
    sizes: [39, 40, 41, 42, 43],
    colors: ["blue"],
    badge: null,
    status: "active",
    images: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "p8",
    sku: "CV-CT70-BK",
    name: "Converse Chuck 70",
    brand: "CONVERSE",
    category: "Casual",
    description: "Versión premium del clásico All Star.",
    price: 339,
    oldPrice: null,
    stock: 30,
    sizes: [38, 39, 40, 41, 42],
    colors: ["black"],
    badge: null,
    status: "draft",
    images: [],
    createdAt: NOW,
    updatedAt: NOW,
  },
];

let store: AdminProduct[] = [...MOCK];

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

const newId = () => `p${Date.now().toString(36)}`;

// ============================================================================
// API simulada — reemplazar por fetch a Laravel cuando esté listo
// ============================================================================

export async function fetchProducts(): Promise<AdminProduct[]> {
  // TODO Laravel: const res = await fetch(`${API}/api/admin/productos`, { headers });
  // TODO Laravel: return res.json();
  await delay();
  return [...store];
}

export async function getProduct(id: string): Promise<AdminProduct | null> {
  // TODO Laravel: const res = await fetch(`${API}/api/admin/productos/${id}`, { headers });
  // TODO Laravel: if (res.status === 404) return null;
  // TODO Laravel: return res.json();
  await delay();
  return store.find((p) => p.id === id) ?? null;
}

export async function createProduct(data: ProductInput): Promise<AdminProduct> {
  // TODO Laravel: const res = await fetch(`${API}/api/admin/productos`, {
  // TODO Laravel:   method: "POST", headers, body: JSON.stringify(data),
  // TODO Laravel: });
  // TODO Laravel: return res.json();
  await delay();
  const product: AdminProduct = {
    ...data,
    id: newId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store = [product, ...store];
  return product;
}

export async function updateProduct(
  id: string,
  data: ProductInput,
): Promise<AdminProduct> {
  // TODO Laravel: const res = await fetch(`${API}/api/admin/productos/${id}`, {
  // TODO Laravel:   method: "PUT", headers, body: JSON.stringify(data),
  // TODO Laravel: });
  // TODO Laravel: return res.json();
  await delay();
  const idx = store.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error(`Producto ${id} no existe`);
  const updated: AdminProduct = {
    ...store[idx],
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  };
  store = store.map((p) => (p.id === id ? updated : p));
  return updated;
}

export async function deleteProduct(id: string): Promise<void> {
  // TODO Laravel: await fetch(`${API}/api/admin/productos/${id}`, { method: "DELETE", headers });
  await delay();
  store = store.filter((p) => p.id !== id);
}
