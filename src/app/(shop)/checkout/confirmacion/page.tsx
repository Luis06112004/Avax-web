"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  CreditCard,
  MapPin,
  Truck,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { CheckoutStepper } from "../CheckoutStepper";
import { Button } from "@/components/ui/Button";
import { SneakerPlaceholder } from "@/components/ui/SneakerPlaceholder";
import { formatPrice } from "@/lib/utils";

export default function ConfirmacionPage() {
  const router = useRouter();
  const { lastOrder } = useCart();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && !lastOrder) router.replace("/");
  }, [hydrated, lastOrder, router]);

  if (!lastOrder) return null;

  const o = lastOrder;
  const subtotal = o.subtotal;
  const totalItems = o.items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="container-page py-6 md:py-10">
      <CheckoutStepper current={4} />

      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
        <div className="w-16 h-16 rounded-full bg-[var(--success)] text-white flex items-center justify-center mb-4">
          <Check size={32} strokeWidth={3} />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-[var(--avax-black)]">
          ¡Pedido confirmado!
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] mt-2 max-w-md">
          Gracias por tu compra. Hemos enviado la confirmación a tu correo
          electrónico{" "}
          <span className="font-bold text-[var(--avax-black)]">
            {o.address.email}
          </span>
          .
        </p>

        <div className="mt-6 grid grid-cols-2 gap-px rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--border)] w-full max-w-md">
          <div className="bg-white px-4 py-3 flex flex-col">
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-[var(--foreground-subtle)]">
              Número de orden
            </span>
            <span className="text-sm font-black text-[var(--avax-black)] mt-1">
              #{o.number}
            </span>
          </div>
          <div className="bg-white px-4 py-3 flex flex-col">
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-[var(--foreground-subtle)]">
              Fecha estimada
            </span>
            <span className="text-sm font-black text-[var(--avax-black)] mt-1">
              {o.estimatedDelivery}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="flex flex-col gap-4">
          <SectionCard
            icon={<MapPin size={18} />}
            title="Datos de envío"
          >
            <p className="font-bold text-[var(--avax-black)]">
              {o.address.firstName} {o.address.lastName}
            </p>
            <p>{o.address.address}</p>
            {o.address.reference && <p>{o.address.reference}</p>}
            <p>
              {o.address.district}, {o.address.province}, {o.address.department}
            </p>
            <p>{o.address.phone}</p>
            <p>{o.address.email}</p>
          </SectionCard>

          <SectionCard
            icon={<CreditCard size={18} />}
            title="Método de pago"
          >
            {o.payment.method === "tarjeta" && (
              <p>
                Tarjeta terminada en{" "}
                <span className="font-bold text-[var(--avax-black)]">
                  {o.payment.cardNumber}
                </span>
              </p>
            )}
            {o.payment.method === "yape" && (
              <p>
                Yape:{" "}
                <span className="font-bold text-[var(--avax-black)]">
                  {o.payment.yapePhone}
                </span>
              </p>
            )}
            {o.payment.method === "transferencia" && (
              <p>Transferencia bancaria</p>
            )}
          </SectionCard>

          <SectionCard
            icon={<Truck size={18} />}
            title="Método de envío"
            right={
              o.shippingCost === 0 ? (
                <span className="text-sm font-black text-[var(--success)]">
                  Gratis
                </span>
              ) : (
                <span className="text-sm font-black text-[var(--avax-black)]">
                  {formatPrice(o.shippingCost)}
                </span>
              )
            }
          >
            <p className="font-bold text-[var(--avax-black)]">
              {o.shippingMethod.name}
            </p>
            <p>{o.shippingMethod.description}</p>
          </SectionCard>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/" className="flex-1">
              <Button variant="ghost" size="md" fullWidth>
                SEGUIR MI PEDIDO
              </Button>
            </Link>
            <Link href="/tienda" className="flex-1">
              <Button
                variant="dark"
                size="md"
                fullWidth
                icon={<ArrowRight size={16} />}
                iconPosition="right"
              >
                SEGUIR COMPRANDO
              </Button>
            </Link>
          </div>
        </div>

        {/* Static order summary (no useCart since cart was cleared) */}
        <aside className="rounded-2xl border border-[var(--border)] bg-white p-5 flex flex-col gap-4 lg:sticky lg:top-24 self-start">
          <h2 className="text-base font-extrabold text-[var(--avax-black)]">
            Resumen del pedido
          </h2>
          <ul className="flex flex-col gap-3">
            {o.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <div className="relative w-12 h-12 shrink-0 rounded-lg bg-[var(--surface-2)] overflow-hidden flex items-center justify-center">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <SneakerPlaceholder
                      size={26}
                      className="text-[var(--avax-blue-medium)]"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--avax-black)] line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-[var(--foreground-muted)]">
                    Talla: {item.size} · Qty: {item.qty}
                  </p>
                </div>
                <span className="text-sm font-black text-[var(--avax-black)] shrink-0">
                  {formatPrice(item.unitPrice * item.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-[var(--border)] pt-3 flex flex-col gap-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--foreground-muted)]">
                Subtotal ({totalItems} item{totalItems === 1 ? "" : "s"})
              </span>
              <span className="font-bold text-[var(--avax-black)]">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--foreground-muted)]">Envío</span>
              <span
                className={
                  o.shippingCost === 0
                    ? "font-bold text-[var(--success)]"
                    : "font-bold text-[var(--avax-black)]"
                }
              >
                {o.shippingCost === 0 ? "Gratis" : formatPrice(o.shippingCost)}
              </span>
            </div>
          </div>
          <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between">
            <span className="text-sm font-bold text-[var(--avax-black)]">
              Total pagado
            </span>
            <span className="text-xl font-black text-[var(--avax-black)]">
              {formatPrice(o.total)}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  right,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="text-[var(--avax-black)]">{icon}</span>
          <h3 className="text-base font-extrabold text-[var(--avax-black)]">
            {title}
          </h3>
        </div>
        {right}
      </div>
      <div className="text-sm text-[var(--foreground-muted)] flex flex-col gap-1">
        {children}
      </div>
    </div>
  );
}

