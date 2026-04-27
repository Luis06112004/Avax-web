/**
 * Cliente de auth contra Laravel Sanctum (POST /api/auth/*).
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8010/api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  created_at?: string;
};

export type AuthResponse = {
  user: AuthUser;
  token: string;
};

export type AuthError = {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
};

async function postJSON<T>(
  path: string,
  body: unknown,
  token?: string,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    const err: AuthError = {
      message: payload.message ?? `Error ${res.status}`,
      errors: payload.errors,
      status: res.status,
    };
    throw err;
  }
  return res.json() as Promise<T>;
}

export function login(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return postJSON<AuthResponse>("/auth/login", input);
}

export function register(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return postJSON<AuthResponse>("/auth/register", input);
}

export async function logout(token: string): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}

export async function fetchMe(token: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const err: AuthError = {
      message: `Error ${res.status}`,
      status: res.status,
    };
    throw err;
  }
  const data = (await res.json()) as { user: AuthUser };
  return data.user;
}
