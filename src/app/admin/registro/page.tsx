"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthShell } from "../_components/AuthShell";
import {
  adminRegister,
  getAdminToken,
  saveAdminSession,
} from "@/lib/admin-auth";

export default function RegistroPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (getAdminToken()) router.replace("/admin/dashboard");
  }, [router]);

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
    setFieldErrors({});

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!acceptTerms) {
      setError("Debes aceptar los términos de uso del panel.");
      return;
    }

    setLoading(true);
    try {
      const res = await adminRegister({
        name: `${nombre.trim()} ${apellido.trim()}`.trim(),
        email,
        password,
        cargo,
        admin_code: adminCode,
      });
      saveAdminSession(res.user, res.token);
      router.replace("/admin/dashboard");
    } catch (err) {
      const e = err as {
        message?: string;
        errors?: Record<string, string[]>;
      };
      if (e?.errors) {
        const flat: Record<string, string> = {};
        for (const [k, v] of Object.entries(e.errors)) flat[k] = v[0];
        setFieldErrors(flat);
      }
      setError(e?.message ?? "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Solicitud de acceso"
      title="Crear cuenta de personal"
      subtitle="Solo personal autorizado de AVAX puede crear una cuenta del panel. Necesitas el código de empresa."
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
            Correo electrónico corporativo
          </label>
          <Input
            id="email"
            type="email"
            placeholder="nombre@avax.pe"
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            className="!py-3.5"
          />
          {fieldErrors.email && (
            <p className="inline-flex items-center gap-1.5 text-xs text-[var(--danger)] mt-0.5">
              <AlertCircle size={14} />
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="cargo"
            className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider"
          >
            Cargo
          </label>
          <Input
            id="cargo"
            type="text"
            placeholder="Ej: Administrador, Gerente de Ventas, Editor de catálogo"
            icon={<Briefcase size={18} />}
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            required
            fullWidth
            className="!py-3.5"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="adminCode"
            className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider"
          >
            Código de empresa
          </label>
          <Input
            id="adminCode"
            type="text"
            placeholder="Solicítalo a tu supervisor"
            icon={<KeyRound size={18} />}
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            required
            fullWidth
            className="!py-3.5"
          />
          {fieldErrors.admin_code && (
            <p className="inline-flex items-center gap-1.5 text-xs text-[var(--danger)] mt-0.5">
              <AlertCircle size={14} />
              {fieldErrors.admin_code}
            </p>
          )}
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
              placeholder="Mínimo 6 caracteres"
              icon={<Lock size={18} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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

        {error && !Object.keys(fieldErrors).length && (
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
