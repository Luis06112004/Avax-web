"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { CheckoutStepper } from "../CheckoutStepper";
import { OrderSummary } from "../OrderSummary";
import { Button } from "@/components/ui/Button";
import type { ShippingAddress } from "@/lib/cart";

const DEPARTAMENTOS = [
  "Lima", "Arequipa", "Cusco", "La Libertad", "Piura", "Lambayeque",
  "Junín", "Áncash", "Ica", "Loreto", "Puno", "San Martín",
];

export default function DatosEnvioPage() {
  const router = useRouter();
  const { items, address, setAddress } = useCart();
  const { hydrated: authHydrated } = useAuth();

  const [form, setForm] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    province: "",
    district: "",
    address: "",
    reference: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const [hydrated, setHydrated] = useState(false);

  // Solo restauramos los campos si el usuario ya pasó por aquí en este
  // checkout (volvió desde el paso 2). Después de confirmar la compra
  // el address se limpia, así que el formulario aparece en blanco.
  useEffect(() => {
    if (address) setForm(address);
    setHydrated(true);
  }, [address]);

  // Modo invitado permitido: NO se exige login para comprar.
  useEffect(() => {
    if (hydrated && items.length === 0) router.replace("/carrito");
  }, [hydrated, items.length, router]);

  if (!authHydrated) {
    return (
      <div className="container-page py-10 text-sm text-[var(--foreground-muted)]">
        Cargando…
      </div>
    );
  }

  const update = (k: keyof ShippingAddress, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.firstName.trim()) next.firstName = "Requerido";
    if (!form.lastName.trim()) next.lastName = "Requerido";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Email inválido";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 9)
      next.phone = "Teléfono inválido";
    if (!form.department) next.department = "Requerido";
    if (!form.province.trim()) next.province = "Requerido";
    if (!form.district.trim()) next.district = "Requerido";
    if (!form.address.trim()) next.address = "Requerido";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setAddress(form);
    router.push("/checkout/metodo-envio");
  };

  return (
    <div className="container-page py-6 md:py-10">
      <CheckoutStepper current={1} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <form onSubmit={onSubmit} className="flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[var(--avax-black)]">
                Información de contacto
              </h2>
              <p className="text-sm text-[var(--foreground-muted)] mt-1">
                Usaremos esta información para enviarte actualizaciones de tu
                pedido.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Nombres *"
                value={form.firstName}
                onChange={(v) => update("firstName", v)}
                placeholder="Tu nombre"
                error={errors.firstName}
              />
              <Field
                label="Apellidos *"
                value={form.lastName}
                onChange={(v) => update("lastName", v)}
                placeholder="Tu apellido"
                error={errors.lastName}
              />
            </div>

            <Field
              label="Correo electrónico *"
              icon={<Mail size={16} />}
              type="email"
              value={form.email}
              onChange={(v) => update("email", v)}
              placeholder="correo@ejemplo.com"
              error={errors.email}
            />

            <Field
              label="Teléfono *"
              icon={<Phone size={16} />}
              type="tel"
              value={form.phone}
              onChange={(v) => update("phone", v)}
              placeholder="+51 999 999 999"
              error={errors.phone}
            />
          </section>

          <section className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-[var(--avax-black)]">
                Dirección de envío
              </h2>
              <p className="text-sm text-[var(--foreground-muted)] mt-1">
                Ingresa la dirección donde deseas recibir tu pedido.
              </p>
            </div>

            <SelectField
              label="Departamento *"
              value={form.department}
              onChange={(v) => update("department", v)}
              options={DEPARTAMENTOS}
              placeholder="Seleccionar departamento"
              error={errors.department}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Provincia *"
                value={form.province}
                onChange={(v) => update("province", v)}
                placeholder="Seleccionar provincia"
                error={errors.province}
              />
              <Field
                label="Distrito *"
                value={form.district}
                onChange={(v) => update("district", v)}
                placeholder="Seleccionar distrito"
                error={errors.district}
              />
            </div>

            <Field
              label="Dirección *"
              icon={<MapPin size={16} />}
              value={form.address}
              onChange={(v) => update("address", v)}
              placeholder="Av. / Jr. / Calle y número"
              error={errors.address}
            />

            <Field
              label="Referencia"
              value={form.reference ?? ""}
              onChange={(v) => update("reference", v)}
              placeholder="Ej: Frente al parque, casa azul"
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[var(--avax-black)]">
                Notas adicionales (opcional)
              </label>
              <textarea
                value={form.notes ?? ""}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                placeholder="Instrucciones especiales de entrega..."
                className="px-4 py-3 rounded-xl bg-[var(--surface-2)] border border-transparent focus:border-[var(--primary)] focus:bg-white outline-none text-sm transition-colors resize-none"
              />
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <Link
              href="/carrito"
              className="text-sm font-semibold text-[var(--foreground-muted)] hover:text-[var(--avax-black)]"
            >
              ← Volver al carrito
            </Link>
            <Button
              variant="dark"
              size="md"
              icon={<ArrowRight size={16} />}
              iconPosition="right"
              type="submit"
            >
              CONTINUAR
            </Button>
          </div>
        </form>

        <OrderSummary />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-[var(--avax-black)]">
        {label}
      </label>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--surface-2)] border transition-colors ${
          error
            ? "border-[var(--danger)]"
            : "border-transparent focus-within:border-[var(--primary)] focus-within:bg-white"
        }`}
      >
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
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--foreground-subtle)] min-w-0"
        />
      </div>
      {error && (
        <span className="text-xs font-semibold text-[var(--danger)]">
          {error}
        </span>
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-[var(--avax-black)]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`px-4 py-3 rounded-xl bg-[var(--surface-2)] border outline-none text-sm transition-colors ${
          error
            ? "border-[var(--danger)]"
            : "border-transparent focus:border-[var(--primary)] focus:bg-white"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs font-semibold text-[var(--danger)]">
          {error}
        </span>
      )}
    </div>
  );
}
