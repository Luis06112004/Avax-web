/**
 * Cliente del CMS de homepage (panel admin).
 * Usa fetch nativo + Bearer token del admin (localStorage).
 */

import { getAdminToken } from "./admin-auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";
const STORAGE_URL =
  process.env.NEXT_PUBLIC_STORAGE_URL ?? "http://127.0.0.1:8000/storage";

export type DeviceKey = "desktop" | "tablet" | "mobile";

export interface HomeSeccion {
  id: number;
  tipo: string;
  titulo: string | null;
  subtitulo: string | null;
  configuracion: Record<string, unknown>;
  orden: number;
  activo: boolean;
}

function authHeaders(): HeadersInit {
  const token = getAdminToken();
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

/** Lista todas las secciones (incluye inactivas) — para el admin. */
export async function getSecciones(): Promise<HomeSeccion[]> {
  const res = await fetch(`${API_BASE}/admin/home/secciones`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  const json = await handle<{ data: HomeSeccion[] }>(res);
  return json.data ?? [];
}

/** Carga una sección por tipo (helper para los editores). */
export async function getSeccionPorTipo(
  tipo: string,
): Promise<HomeSeccion | null> {
  const secciones = await getSecciones();
  return secciones.find((s) => s.tipo === tipo) ?? null;
}

export async function updateSeccion(
  id: number,
  payload: Partial<Pick<HomeSeccion, "titulo" | "subtitulo" | "configuracion" | "orden" | "activo">>,
): Promise<HomeSeccion> {
  const res = await fetch(`${API_BASE}/admin/home/secciones/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const json = await handle<{ data: HomeSeccion }>(res);
  return json.data;
}

export async function reorderSecciones(
  orden: { id: number; orden: number }[],
): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/home/secciones/reordenar`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ orden }),
  });
  await handle(res);
}

export async function toggleSeccion(
  id: number,
  activo: boolean,
): Promise<void> {
  await updateSeccion(id, { activo });
}

/** Prefija el storage del backend a rutas relativas. */
export function getStorageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("/")) {
    return path;
  }
  return `${STORAGE_URL}/${path}`;
}
