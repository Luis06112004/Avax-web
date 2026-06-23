/**
 * Cliente API para el módulo de sincronización con e-commerce externo.
 * Endpoints expuestos por avax-api (Laravel):
 *
 *   POST /api/admin/sync/run            crea y ejecuta el job (sincrono)
 *   POST /api/admin/sync/start          crea el job sin ejecutarlo
 *   POST /api/admin/sync/run-job/{id}   ejecuta un job ya creado
 *   GET  /api/admin/sync/status/{id}    estado actual + ultimos cambios
 *   GET  /api/admin/sync/{id}/cambios   lista paginada de cambios
 *   GET  /api/admin/sync/last           ultimo job realizado
 */

import { getAdminToken } from "@/lib/admin-auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export type SyncEstado = "en_progreso" | "completado" | "error" | "cancelado";

export type SyncJob = {
  id: number;
  codigo: string;
  estado: SyncEstado;
  iniciado_at: string;
  terminado_at: string | null;
  duracion_segundos: number | null;
  progreso_pct: number;
  fase_actual: string | null;
  total_productos: number;
  procesados: number;
  nuevos: number;
  actualizados: number;
  removidos: number;
  sin_cambios: number;
  total_requests_http: number;
  error_mensaje: string | null;
  iniciado_por: number | null;
  created_at: string;
  updated_at: string;
};

export type SyncCambioReciente = {
  id: number;
  tipo: "nuevo" | "actualizado" | "removido";
  subtipo: string | null;
  sku: string | null;
  nombre: string;
  created_at: string;
};

export type SyncCambio = SyncCambioReciente & {
  producto_id: number | null;
  ecommerce_id: number;
  antes: Record<string, unknown> | null;
  despues: Record<string, unknown> | null;
  updated_at: string;
};

export type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string;
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

/** Ejecuta el sync síncronamente (puede tardar minutos). */
export async function runSync(): Promise<ApiEnvelope<SyncJob>> {
  const res = await fetch(`${API_BASE}/admin/sync/run`, {
    method: "POST",
    headers: authHeaders(),
  });
  return handle<ApiEnvelope<SyncJob>>(res);
}

/** Devuelve el último job realizado (puede ser null). */
export async function getLastSync(): Promise<ApiEnvelope<SyncJob | null>> {
  const res = await fetch(`${API_BASE}/admin/sync/last`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  return handle<ApiEnvelope<SyncJob | null>>(res);
}

/** Lista paginada de cambios del job indicado. */
export async function getSyncCambios(
  jobId: number,
  opts: { tipo?: "nuevo" | "actualizado" | "removido"; per_page?: number; page?: number } = {},
): Promise<
  ApiEnvelope<{
    job: SyncJob;
    cambios: SyncCambio[];
    paginacion: {
      total: number;
      por_pagina: number;
      pagina_actual: number;
      ultima_pagina: number;
    };
  }>
> {
  const params = new URLSearchParams();
  if (opts.tipo) params.set("tipo", opts.tipo);
  if (opts.per_page) params.set("per_page", String(opts.per_page));
  if (opts.page) params.set("page", String(opts.page));

  const url = `${API_BASE}/admin/sync/${jobId}/cambios${params.toString() ? `?${params}` : ""}`;
  const res = await fetch(url, { headers: authHeaders(), cache: "no-store" });
  return handle<
    ApiEnvelope<{
      job: SyncJob;
      cambios: SyncCambio[];
      paginacion: {
        total: number;
        por_pagina: number;
        pagina_actual: number;
        ultima_pagina: number;
      };
    }>
  >(res);
}
