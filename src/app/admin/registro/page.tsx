"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthShell } from "../_components/AuthShell";

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;
  const passwordMismatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password !== confirmPassword;

  const submit = async () => {
    setError(null);

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!acceptTerms) {
      setError("Debes aceptar los términos de uso del panel.");
      return;
    }

    setLoading(true);
    // TODO: conectar con POST /api/auth/register del backend Laravel (JWT)
    console.log({ nombre, apellido, email, password });
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <AuthShell
      eyebrow="Solicitud de acceso"
      title="Crear cuenta"
      subtitle="Regístrate para administrar el contenido del e-commerce de AVAX."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="flex flex-col gap-5"
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="nombre"
              className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider"
            >
              Nombre
            </label>
            <Input
              id="nombre"
              type="text"
              placeholder="Juan"
              icon={<User size={18} />}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              fullWidth
              className="!py-3.5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="apellido"
              className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider"
            >
              Apellido
            </label>
            <Input
              id="apellido"
              type="text"
              placeholder="Pérez"
              icon={<User size={18} />}
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
              fullWidth
              className="!py-3.5"
            />
          </div>
        </div>

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
          <label
            htmlFor="password"
            className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider"
          >
            Contraseña
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              icon={<Lock size={18} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
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

        <div className="flex flex-col gap-2">
          <label
            htmlFor="confirmPassword"
            className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider"
          >
            Confirmar contraseña
          </label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Repite tu contraseña"
            icon={<Lock size={18} />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            className="!py-3.5"
          />
          {passwordsMatch && (
            <p className="inline-flex items-center gap-1.5 text-xs text-[var(--success)] mt-0.5">
              <CheckCircle2 size={14} />
              Las contraseñas coinciden.
            </p>
          )}
          {passwordMismatch && (
            <p className="inline-flex items-center gap-1.5 text-xs text-[var(--danger)] mt-0.5">
              <AlertCircle size={14} />
              Las contraseñas no coinciden.
            </p>
          )}
        </div>

        <label className="inline-flex items-start gap-2.5 cursor-pointer select-none text-sm">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-[var(--border-strong)] accent-[var(--primary)] shrink-0"
          />
          <span className="text-[var(--foreground-muted)] leading-snug">
            Acepto los{" "}
            <Link
              href="/terminos"
              className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium"
            >
              términos de uso
            </Link>{" "}
            del panel administrativo.
          </span>
        </label>

        {error && (
          <div className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 text-[var(--danger)] text-sm">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

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
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
        <p className="text-sm text-[var(--foreground-muted)]">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/admin/login"
            className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
