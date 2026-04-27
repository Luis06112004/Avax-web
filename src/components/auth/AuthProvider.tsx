"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  fetchMe,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  type AuthUser,
} from "@/lib/auth-api";

const TOKEN_KEY = "avax_auth_token_v1";
const USER_KEY = "avax_auth_user_v1";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  hydrated: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Hydrate from localStorage and re-validate token
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const t = localStorage.getItem(TOKEN_KEY);
        const u = localStorage.getItem(USER_KEY);
        if (t) {
          setToken(t);
          if (u) {
            try {
              setUser(JSON.parse(u) as AuthUser);
            } catch {
              // ignore
            }
          }
          // Re-validate against backend
          try {
            const fresh = await fetchMe(t);
            if (!alive) return;
            setUser(fresh);
            localStorage.setItem(USER_KEY, JSON.stringify(fresh));
          } catch {
            if (!alive) return;
            setToken(null);
            setUser(null);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
          }
        }
      } finally {
        if (alive) setHydrated(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await apiLogin({ email, password });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setLoading(true);
      try {
        const res = await apiRegister({ name, email, password });
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    if (token) {
      try {
        await apiLogout(token);
      } catch {
        // ignore — local logout still proceeds
      }
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      hydrated,
      loading,
      isAuthenticated: !!token && !!user,
      login,
      register,
      logout,
    }),
    [user, token, hydrated, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useAuthOptional() {
  return useContext(AuthContext);
}
