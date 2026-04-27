"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthShell } from "../_components/AuthShell";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    // TODO: conectar con POST /api/auth/login del backend Laravel (JWT)
    console.log({ email, password, remember });
    await new Promise((r) => setTimeout(r, 600));
    router.push("/admin/dashboard");
  };

  return (
    <AuthShell
      eyebrow="Bienvenido al CMS"
      title="Iniciar sesión"
      subtitle="Ingresa tus credenciales para acceder al panel administrativo."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider"
          >
            Correo electrónico
          </label>
          <Input
            id="email"
            type="email"
            placeholder="admin@avax.pe"
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            className="!py-3.5"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider"
            >
              Contraseña
            </label>
            <Link
              href="/admin/recuperar"
              className="text-xs text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              icon={<Lock size={18} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              className="pr-12 !py-3.5"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)] transition-colors p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none text-sm">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--border-strong)] accent-[var(--primary)]"
          />
          <span className="text-[var(--foreground-muted)]">
            Mantener sesión iniciada
          </span>
        </label>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          icon={<ArrowRight size={18} />}
          iconPosition="right"
          disabled={loading}
          className="mt-2 shadow-lg shadow-[var(--primary)]/25"
        >
          {loading ? "Ingresando..." : "Ingresar al panel"}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
        <p className="text-sm text-[var(--foreground-muted)]">
          ¿Aún no tienes cuenta?{" "}
          <Link
            href="/admin/registro"
            className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold"
          >
            Solicita acceso
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
