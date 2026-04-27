"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

type Props = {
  open: boolean;
  orderNumber: string;
  total: number;
  email: string;
  onClose?: () => void;
};

export function OrderSuccessModal({
  open,
  orderNumber,
  total,
  email,
  onClose,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Compra realizada"
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con gradiente */}
        <div className="relative px-6 pt-10 pb-6 text-center bg-gradient-to-br from-[var(--success)]/10 via-white to-[var(--primary-soft)]">
          <div className="mx-auto w-20 h-20 rounded-full bg-[var(--success)] text-white flex items-center justify-center shadow-lg shadow-[var(--success)]/30 mb-4 animate-in zoom-in duration-300">
            <Check size={40} strokeWidth={3} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[var(--avax-black)] tracking-tight">
            ¡Compra realizada!
          </h2>
          <p className="text-sm text-[var(--foreground-muted)] mt-2 max-w-xs mx-auto">
            Gracias por tu compra. Hemos enviado la confirmación a{" "}
            <span className="font-bold text-[var(--avax-black)]">{email}</span>.
          </p>
        </div>

        {/* Detalle */}
        <div className="px-6 py-5 grid grid-cols-2 gap-px bg-[var(--border)] border-y border-[var(--border)]">
          <div className="bg-white px-4 py-3 flex flex-col">
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-[var(--foreground-subtle)]">
              N° de orden
            </span>
            <span className="text-sm font-black text-[var(--avax-black)] mt-1">
              #{orderNumber}
            </span>
          </div>
          <div className="bg-white px-4 py-3 flex flex-col">
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-[var(--foreground-subtle)]">
              Total pagado
            </span>
            <span className="text-sm font-black text-[var(--avax-black)] mt-1">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="px-6 py-5 flex flex-col gap-3">
          <Link
            href="/checkout/confirmacion"
            onClick={onClose}
            className="block"
          >
            <Button
              variant="dark"
              size="md"
              fullWidth
              icon={<FileText size={16} />}
            >
              Ver detalle del pedido
            </Button>
          </Link>
          <Link href="/tienda" onClick={onClose} className="block">
            <Button
              variant="ghost"
              size="md"
              fullWidth
              icon={<ArrowRight size={16} />}
              iconPosition="right"
            >
              Seguir comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
