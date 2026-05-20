/**
 * Cliente de pedidos del cliente autenticado contra Laravel
 * (POST /api/shop/pedidos, GET /api/shop/pedidos).
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export type CreateOrderInput = {
  contacto: {
    nombres: string;
    apellidos: string;
    email: string;
    telefono: string;
  };
  envio: {
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    referencia?: string;
    notas?: string;
  };
  envio_metodo: {
    id: string;
    nombre: string;
    costo: number;
  };
  pago: {
    metodo: "tarjeta" | "yape" | "transferencia";
    referencia?: string;
  };
  items: {
    producto_id?: string | null;
    slug: string;
    nombre: string;
    marca?: string;
    imagen?: string;
    talla?: string;
    color?: string;
    precio_unitario: number;
    cantidad: number;
  }[];
};

export type OrderItem = {
  id: string;
  producto_id: string | null;
  slug: string;
  nombre: string;
  marca: string | null;
  imagen: string | null;
  talla: string | null;
  color: string | null;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
};

export type Order = {
  id: string;
  numero: string;
  estado: string;
  contacto: {
    nombres: string;
    apellidos: string;
    email: string;
    telefono: string;
  };
  envio: {
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    referencia: string | null;
    notas: string | null;
  };
  envio_metodo: { id: string; nombre: string; costo: number };
  pago: { metodo: "tarjeta" | "yape" | "transferencia"; referencia: string | null };
  subtotal: number;
  total: number;
  confirmado_at: string | null;
  created_at: string;
  items: OrderItem[];
};

export type OrderApiError = {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
};

export async function createOrder(
  input: CreateOrderInput,
  token: string,
): Promise<Order> {
  const res = await fetch(`${API_BASE}/shop/pedidos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
    cache: "no-store",
  });
  if (!res.ok) {
    let payload: { message?: string; errors?: Record<string, string[]> } = {};
    try {
      payload = await res.json();
    } catch {
      // ignore
    }
    const err: OrderApiError = {
      message: payload.message ?? `Error ${res.status}`,
      errors: payload.errors,
      status: res.status,
    };
    throw err;
  }
  const data = (await res.json()) as { data: Order };
  return data.data;
}

export async function listMyOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${API_BASE}/shop/pedidos`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = (await res.json()) as { data: Order[] };
  return data.data;
}
