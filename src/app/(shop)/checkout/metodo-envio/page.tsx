"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { CheckoutStepper } from "../CheckoutStepper";
import { OrderSummary } from "../OrderSummary";
import { Button } from "@/components/ui/Button";
import { SHIPPING_METHODS } from "@/lib/cart";
import { formatPrice, cn } from "@/lib/utils";

export default function MetodoEnvioPage() {
  const router = useRouter();
  const { items, address, shippingMethod, setShippingMethodId } = useCart();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0) router.replace("/carrito");
    else if (!address) router.replace("/checkout/datos-envio");
  }, [hydrated, items.length, address, router]);

  if (!address) return null;

  const onContinue = () => {
    router.push("/checkout/pago");
  };

  return (
    <div className="container-page py-6 md:py-10">
      <CheckoutStepper current={2} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="flex flex-col gap-6">
          {/* Address banner */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--success)]/10 border border-[var(--success)]/20">
            <div className="w-9 h-9 rounded-full bg-[var(--success)] text-white flex items-center justify-center shrink-0">
              <MapPin size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[var(--avax-black)]">
                Dirección de envío
              </p>
              <p className="text-xs text-[var(--foreground-muted)] mt-0.5 line-clamp-2">
                {address.address}
                {address.reference ? `, ${address.reference}` : ""},{" "}
                {address.district}, {address.province}, {address.department}
              </p>
            </div>
            <Link
              href="/checkout/datos-envio"
              className="text-sm font-semibold text-[var(--success)] hover:underline shrink-0"
            >
              Cambiar
            </Link>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-[var(--avax-black)]">
              Selecciona tu método de envío
            </h2>
            <p className="text-sm text-[var(--foreground-muted)] mt-1">
              Elige la opción que mejor se adapte a tus necesidades.
            </p>
          </div>

          <ul className="flex flex-col gap-3">
            {SHIPPING_METHODS.map((m) => {
              const active = shippingMethod.id === m.id;
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => setShippingMethodId(m.id)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-colors cursor-pointer",
                      active
                        ? "border-[var(--avax-black)] bg-white"
                        : "border-[var(--border)] hover:border-[var(--border-strong)] bg-white",
                    )}
                  >
                    <span
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                        active
                          ? "border-[var(--avax-black)]"
                          : "border-[var(--border-strong)]",
                      )}
                    >
                      {active && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[var(--avax-black)]" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--avax-black)]">
                        {m.name}
                      </p>
                      <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                        {m.description}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-sm font-black shrink-0",
                        m.price === 0
                          ? "text-[var(--success)]"
                          : "text-[var(--avax-black)]",
                      )}
                    >
                      {m.price === 0 ? "Gratis" : formatPrice(m.price)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <Link
              href="/checkout/datos-envio"
              className="text-sm font-semibold text-[var(--foreground-muted)] hover:text-[var(--avax-black)]"
            >
              ← Volver a datos de envío
            </Link>
            <Button
              variant="dark"
              size="md"
              icon={<ArrowRight size={16} />}
              iconPosition="right"
              onClick={onContinue}
            >
              CONTINUAR AL PAGO
            </Button>
          </div>
        </div>

        <OrderSummary showShipping />
      </div>
    </div>
  );
}
