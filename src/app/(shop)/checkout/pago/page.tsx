"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Banknote,
  CreditCard,
  Lock,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { CheckoutStepper } from "../CheckoutStepper";
import { OrderSummary } from "../OrderSummary";
import { OrderSuccessModal } from "../OrderSuccessModal";
import { Button } from "@/components/ui/Button";
import type { PaymentInfo, PaymentMethod } from "@/lib/cart";
import { createOrder } from "@/lib/orders-api";
import { formatPrice, cn } from "@/lib/utils";

const TABS: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { id: "tarjeta", label: "Tarjeta", icon: <CreditCard size={16} /> },
  { id: "yape", label: "Yape", icon: <Smartphone size={16} /> },
  { id: "transferencia", label: "Transferencia", icon: <Banknote size={16} /> },
];

export default function PagoPage() {
  const router = useRouter();
  const { items, address, shippingMethod, total, confirmOrder } = useCart();
  const { isAuthenticated, hydrated: authHydrated, token } = useAuth();

  const [tab, setTab] = useState<PaymentMethod>("tarjeta");
  const [card, setCard] = useState({
    cardNumber: "",
    cardName: "",
    cardExp: "",
    cardCvv: "",
    saveCard: true,
  });
  const [yapePhone, setYapePhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [success, setSuccess] = useState<{
    numero: string;
    total: number;
    email: string;
  } | null>(null);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;
    // Una vez que el pago se confirmó (success != null) el carrito y
    // el address se vacían — no debemos rebotar al usuario, debe ver
    // el modal de éxito.
    if (success) return;
    if (items.length === 0) router.replace("/carrito");
    else if (!address) router.replace("/checkout/datos-envio");
  }, [hydrated, items.length, address, router, success]);

  useEffect(() => {
    if (!authHydrated) return;
    if (success) return;
    if (!isAuthenticated) {
      router.replace(
        `/login?redirect=${encodeURIComponent("/checkout/pago")}`,
      );
    }
  }, [authHydrated, isAuthenticated, router, success]);

  if (success) {
    return (
      <OrderSuccessModal
        open
        orderNumber={success.numero}
        total={success.total}
        email={success.email}
      />
    );
  }

  if (!address || !authHydrated || !isAuthenticated) return null;

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (tab === "tarjeta") {
      if (card.cardNumber.replace(/\s/g, "").length < 13)
        next.cardNumber = "Número inválido";
      if (!card.cardName.trim()) next.cardName = "Requerido";
      if (!/^\d{2}\s?\/\s?\d{2}$/.test(card.cardExp))
        next.cardExp = "MM/AA";
      if (card.cardCvv.length < 3) next.cardCvv = "CVV inválido";
    }
    if (tab === "yape") {
      if (yapePhone.replace(/\D/g, "").length < 9)
        next.yapePhone = "Número inválido";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onPay = async () => {
    if (!validate()) return;
    if (!token) {
      router.replace(`/login?redirect=${encodeURIComponent("/checkout/pago")}`);
      return;
    }
    setServerError(null);
    setSubmitting(true);

    const payment: PaymentInfo = {
      method: tab,
      ...(tab === "tarjeta"
        ? {
            cardNumber: card.cardNumber.slice(-4),
            cardName: card.cardName,
            cardExp: card.cardExp,
            saveCard: card.saveCard,
          }
        : {}),
      ...(tab === "yape" ? { yapePhone } : {}),
    };

    try {
      // Simulate payment processing
      await new Promise((r) => setTimeout(r, 700));

      const created = await createOrder(
        {
          contacto: {
            nombres: address!.firstName,
            apellidos: address!.lastName,
            email: address!.email,
            telefono: address!.phone,
          },
          envio: {
            departamento: address!.department,
            provincia: address!.province,
            distrito: address!.district,
            direccion: address!.address,
            referencia: address!.reference || undefined,
            notas: address!.notes || undefined,
          },
          envio_metodo: {
            id: shippingMethod.id,
            nombre: shippingMethod.name,
            costo: shippingMethod.price,
          },
          pago: {
            metodo: tab,
            referencia:
              tab === "tarjeta"
                ? `**** ${card.cardNumber.slice(-4)}`
                : tab === "yape"
                  ? yapePhone
                  : undefined,
          },
          items: items.map((it) => ({
            producto_id: it.productId,
            slug: it.slug,
            nombre: it.name,
            marca: it.brand,
            imagen: it.image,
            talla: it.size,
            color: it.color,
            precio_unitario: it.unitPrice,
            cantidad: it.qty,
          })),
        },
        token,
      );

      confirmOrder(payment, created.numero);
      setSuccess({
        numero: created.numero,
        total: created.total,
        email: address!.email,
      });
    } catch (err) {
      const e = err as { message?: string; status?: number };
      if (e?.status === 401) {
        router.replace(
          `/login?redirect=${encodeURIComponent("/checkout/pago")}`,
        );
        return;
      }
      setServerError(
        e?.message ?? "No se pudo registrar el pedido. Inténtalo de nuevo.",
      );
      setSubmitting(false);
    }
  };

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim().slice(0, 19);

  const formatExp = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  return (
    <div className="container-page py-6 md:py-10">
      <CheckoutStepper current={3} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-extrabold text-[var(--avax-black)]">
              Método de pago
            </h2>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">
              Selecciona cómo deseas pagar tu pedido.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 border-b border-[var(--border)] overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap",
                  tab === t.id
                    ? "border-[var(--avax-black)] text-[var(--avax-black)]"
                    : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--avax-black)]",
                )}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {tab === "tarjeta" && (
            <div className="flex flex-col gap-4">
              <PayField
                label="Número de tarjeta *"
                icon={<CreditCard size={16} />}
                rightIcon={<Lock size={16} className="text-[var(--success)]" />}
                value={card.cardNumber}
                onChange={(v) =>
                  setCard((c) => ({ ...c, cardNumber: formatCardNumber(v) }))
                }
                placeholder="1234 5678 9012 3456"
                error={errors.cardNumber}
              />
              <PayField
                label="Nombre del titular *"
                value={card.cardName}
                onChange={(v) => setCard((c) => ({ ...c, cardName: v }))}
                placeholder="Nombre como aparece en la tarjeta"
                error={errors.cardName}
              />
              <div className="grid grid-cols-2 gap-4">
                <PayField
                  label="Fecha de expiración *"
                  value={card.cardExp}
                  onChange={(v) => setCard((c) => ({ ...c, cardExp: formatExp(v) }))}
                  placeholder="MM / AA"
                  error={errors.cardExp}
                />
                <PayField
                  label="CVV *"
                  type="password"
                  value={card.cardCvv}
                  onChange={(v) =>
                    setCard((c) => ({
                      ...c,
                      cardCvv: v.replace(/\D/g, "").slice(0, 4),
                    }))
                  }
                  placeholder="123"
                  error={errors.cardCvv}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-[var(--foreground)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={card.saveCard}
                  onChange={(e) =>
                    setCard((c) => ({ ...c, saveCard: e.target.checked }))
                  }
                  className="w-4 h-4 rounded border-[var(--border-strong)] text-[var(--primary)]"
                />
                Guardar tarjeta para futuras compras
              </label>
            </div>
          )}

          {tab === "yape" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-[var(--foreground-muted)]">
                Te enviaremos un código al número que ingreses para confirmar
                el pago desde tu app Yape.
              </p>
              <PayField
                label="Número de celular Yape *"
                icon={<Smartphone size={16} />}
                value={yapePhone}
                onChange={setYapePhone}
                placeholder="+51 999 999 999"
                error={errors.yapePhone}
              />
            </div>
          )}

          {tab === "transferencia" && (
            <div className="flex flex-col gap-3 rounded-2xl bg-[var(--surface-2)] p-5 text-sm">
              <p className="font-bold text-[var(--avax-black)]">
                Datos para transferencia
              </p>
              <p>
                <span className="text-[var(--foreground-muted)]">BCP:</span>{" "}
                <span className="font-bold">194-2345678-0-12</span>
              </p>
              <p>
                <span className="text-[var(--foreground-muted)]">CCI:</span>{" "}
                <span className="font-bold">002-194-002345678012-91</span>
              </p>
              <p>
                <span className="text-[var(--foreground-muted)]">Titular:</span>{" "}
                <span className="font-bold">AVAX STYLE SAC</span>
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">
                Envíanos el comprobante por WhatsApp después de confirmar tu
                pedido.
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--success)]/10 border border-[var(--success)]/20">
            <ShieldCheck size={18} className="text-[var(--success)] shrink-0" />
            <div>
              <p className="text-sm font-bold text-[var(--avax-black)]">
                Pago seguro con encriptación SSL
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">
                Tu información está protegida con encriptación de 256 bits.
              </p>
            </div>
          </div>

          {serverError && (
            <div className="text-sm font-semibold text-[var(--danger)] bg-[var(--danger)]/5 border border-[var(--danger)]/20 rounded-lg px-3 py-2">
              {serverError}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <Link
              href="/checkout/metodo-envio"
              className="text-sm font-semibold text-[var(--foreground-muted)] hover:text-[var(--avax-black)]"
            >
              ← Volver al método de envío
            </Link>
            <Button
              variant="dark"
              size="md"
              icon={<Lock size={16} />}
              onClick={onPay}
              disabled={submitting}
            >
              {submitting ? "PROCESANDO..." : `PAGAR ${formatPrice(total)}`}
            </Button>
          </div>
        </div>

        <OrderSummary showShipping totalLabel="Total" />
      </div>
    </div>
  );
}

function PayField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
  rightIcon,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
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
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </div>
      {error && (
        <span className="text-xs font-semibold text-[var(--danger)]">
          {error}
        </span>
      )}
    </div>
  );
}

