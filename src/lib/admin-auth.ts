/**
 * Auth del CMS admin. Persistencia y endpoints separados de la auth de la
 * tienda — el panel solo es accesible para usuarios con role='admin'.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8010/api";

const ADMIN_TOKEN_KEY = "avax_admin_token_v1";
const ADMIN_USER_KEY = "avax_admin_user_v1";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "cliente" | "admin";
  cargo: string | null;
  created_at?: string;
};

export type AdminAuthError = {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
};

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    let payload: { message?: string; errors?: Record<string, string[]> } = {};
    try {
      payload = await res.json();
    } catch {
      // ignore
    }
    const err: AdminAuthError = {
      message: payload.message ?? `Error ${res.status}`,
      errors: payload.errors,
      status: res.status,
    };
    throw err;
  }
  return res.json() as Promise<T>;
}

type AuthResponse = { user: AdminUser; token: string };

export async function adminLogin(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return postJSON<AuthResponse>("/auth/admin/login", input);
}

export async function adminRegister(input: {
  name: string;
  email: string;
  password: string;
  cargo: string;
  admin_code: string;
}): Promise<AuthResponse> {
  return postJSON<AuthResponse>("/auth/admin/register", input);
}

export async function adminLogout(token: string): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

// Local storage helpers (cliente)
export function saveAdminSession(user: AdminUser, token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}
