"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container-page py-10 text-sm text-[var(--foreground-muted)]">
          Cargando…
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const { login, isAuthenticated, hydrated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hydrated && isAuthenticated) router.replace(redirect);
  }, [hydrated, isAuthenticated, redirect, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace(redirect);
    } catch (err) {
      const e = err as { message?: string };
      setError(e?.message ?? "No se pudo iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-10 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left: marketing */}
        <div className="hidden lg:flex flex-col gap-6 max-w-lg">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--avax-black)] text-white text-[11px] font-extrabold tracking-[0.2em] uppercase w-fit">
            Bienvenido a AVAX
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-[var(--avax-black)] leading-[1.05] tracking-tight">
            Tus sneakers favoritos,{" "}
            <span className="bg-gradient-to-r from-[var(--avax-blue-light)] via-[var(--avax-blue-medium)] to-[var(--avax-blue-dark)] bg-clip-text text-transparent">
              en un solo lugar
            </span>
          </h1>
          <p className="text-base text-[var(--foreground-muted)]">
            Inicia sesión para ver el estado de tus pedidos, guardar favoritos
            y completar tu compra más rápido.
          </p>
          <ul className="grid grid-cols-1 gap-3 text-sm text-[var(--foreground-muted)]">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
              Historial de pedidos siempre disponible
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
              Compra en un solo paso
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
              Acceso anticipado a drops y ofertas
            </li>
          </ul>
        </div>

        {/* Right: form */}
        <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
          <div className="rounded-3xl bg-white border border-[var(--border)] shadow-xl p-8">
            <h2 className="text-2xl font-extrabold text-[var(--avax-black)]">
              Iniciar sesión
            </h2>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">
              Ingresa con tu cuenta para continuar.
            </p>

            <form onSubmit={submit} className="flex flex-col gap-4 mt-6">
              <Field
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="tu@email.com"
                icon={<Mail size={16} />}
                required
              />
              <Field
                label="Contraseña"
                type={show ? "text" : "password"}
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                icon={<Lock size={16} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label={show ? "Ocultar" : "Mostrar"}
                    className="text-[var(--foreground-subtle)] hover:text-[var(--avax-black)]"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                required
              />

              {error && (
                <div className="text-sm font-semibold text-[var(--danger)] bg-[var(--danger)]/5 border border-[var(--danger)]/20 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                variant="dark"
                size="md"
                fullWidth
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                disabled={submitting}
              >
                {submitting ? "Ingresando..." : "INGRESAR"}
              </Button>
            </form>

            <p className="text-sm text-[var(--foreground-muted)] text-center mt-6">
              ¿Aún no tienes cuenta?{" "}
              <Link
                href={`/registro${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
                className="font-bold text-[var(--primary)] hover:underline"
              >
                Crea una gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  rightIcon,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-extrabold tracking-wider uppercase text-[var(--foreground-muted)]">
        {label}
      </label>
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-transparent focus-within:border-[var(--primary)] focus-within:bg-white transition-colors">
        {icon && (
          <span className="text-[var(--foreground-subtle)] shrink-0">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--foreground-subtle)] min-w-0"
        />
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </div>
    </div>
  );
}
