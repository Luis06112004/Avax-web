"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  MessageCircle,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ShopProduct, ShopProductDetail } from "@/lib/shop-api";
import { ProductCard } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/Badge";
import { RatingStars } from "@/components/ui/RatingStars";
import { SneakerPlaceholder } from "@/components/ui/SneakerPlaceholder";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/types";

const COLOR_HEX: Record<string, string> = {
  negro: "#1E1E1E",
  blanco: "#F2F2F2",
  azul: "#4A7CCF",
  rojo: "#E63946",
  verde: "#16A34A",
  gris: "#9CA3AF",
  cafe: "#7B4B2A",
  beige: "#D2B48C",
  amarillo: "#FACC15",
};

function colorHex(name: string) {
  const k = name.toLowerCase().trim();
  return COLOR_HEX[k] ?? "#cbd5e1";
}

function toCardProduct(p: ShopProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    price: p.price,
    oldPrice: p.oldPrice ?? undefined,
    discountLabel: p.discountLabel ?? undefined,
    image: p.image,
    badge: p.badge ?? undefined,
    rating: p.rating,
    stock: p.stock,
  };
}

type Props = {
  product: ShopProductDetail;
  related: ShopProduct[];
};

type Tab = "descripcion" | "especificaciones" | "resenas";

export function ProductDetail({ product, related }: Props) {
  const router = useRouter();
  const { addItem } = useCart();

  const images = product.images && product.images.length > 0 ? product.images : [];
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState<string | null>(
    product.tallas_detalle.find((t) => t.stock > 0)?.talla ?? null,
  );
  const [color, setColor] = useState<string | null>(
    product.colors[0] ?? null,
  );
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("descripcion");

  const sizeOptions = useMemo(() => {
    if (product.tallas_detalle.length > 0) return product.tallas_detalle;
    return product.sizes.map((s) => ({
      talla: String(s),
      precio_final: product.price,
      stock: 1,
    }));
  }, [product]);

  const selectedSizeStock =
    sizeOptions.find((s) => s.talla === size)?.stock ?? product.stock;

  const handleAdd = (openDrawer = true) => {
    if (!size) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.image,
      size,
      color: color ?? undefined,
      unitPrice: product.price,
      qty,
      stock: selectedSizeStock,
    });
    if (!openDrawer) router.push("/checkout/datos-envio");
  };

  return (
    <div className="container-page py-6 md:py-10">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--foreground-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--avax-black)] transition-colors">
          Inicio
        </Link>
        <ChevronRight size={12} />
        <Link href="/tienda" className="hover:text-[var(--avax-black)] transition-colors">
          Tienda
        </Link>
        <ChevronRight size={12} />
        <Link
          href={`/tienda?q=${encodeURIComponent(product.brand)}`}
          className="hover:text-[var(--avax-black)] transition-colors"
        >
          {product.brand}
        </Link>
        <ChevronRight size={12} />
        <span className="text-[var(--avax-black)] font-semibold line-clamp-1">
          {product.name}
        </span>
      </nav>

      {/* Top section: gallery + info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square rounded-3xl bg-[var(--surface-2)] overflow-hidden flex items-center justify-center">
            {images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images[activeImage]}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <SneakerPlaceholder
                size={220}
                className="text-[var(--avax-blue-medium)]"
              />
            )}
            {product.badge && (
              <div className="absolute top-4 left-4">
                <Badge
                  variant={
                    product.badge === "HOT"
                      ? "hot"
                      : product.badge === "NEW"
                        ? "new"
                        : "sale"
                  }
                >
                  {product.badge}
                </Badge>
              </div>
            )}
            {product.discountLabel && (
              <div className="absolute top-4 right-4">
                <Badge variant="discount" shape="square">
                  {product.discountLabel}
                </Badge>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {images.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative aspect-square rounded-xl overflow-hidden bg-[var(--surface-2)] border-2 transition-all cursor-pointer",
                    activeImage === i
                      ? "border-[var(--avax-black)]"
                      : "border-transparent hover:border-[var(--border-strong)]",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-extrabold tracking-[0.2em] uppercase text-[var(--foreground-subtle)]">
              {product.brand}
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-[var(--avax-black)] tracking-tight mt-1">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <RatingStars value={product.rating} size={16} />
              <span className="text-xs font-bold text-[var(--avax-black)]">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-xs text-[var(--foreground-muted)]">
                (158 reseñas)
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl md:text-4xl font-black text-[var(--avax-black)]">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-base line-through text-[var(--foreground-subtle)]">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            {product.discountLabel && (
              <Badge variant="discount" shape="square">
                {product.discountLabel}
              </Badge>
            )}
          </div>

          {/* Color */}
          {product.colors.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold text-[var(--avax-black)]">
                Color: <span className="font-normal">{color}</span>
              </p>
              <div className="flex items-center gap-2">
                {product.colors.map((c) => {
                  const active = c === color;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      aria-label={c}
                      title={c}
                      className={cn(
                        "w-9 h-9 rounded-full border-2 transition-all cursor-pointer",
                        active
                          ? "border-[var(--avax-black)] scale-110"
                          : "border-[var(--border)] hover:border-[var(--foreground-subtle)]",
                      )}
                      style={{ backgroundColor: colorHex(c) }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Size */}
          {sizeOptions.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[var(--avax-black)]">
                  Talla
                </p>
                <Link
                  href="/tallas"
                  className="text-xs font-semibold text-[var(--primary)] hover:underline"
                >
                  Guía de tallas
                </Link>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {sizeOptions.map((s) => {
                  const active = s.talla === size;
                  const disabled = s.stock <= 0;
                  return (
                    <button
                      key={s.talla}
                      type="button"
                      disabled={disabled}
                      onClick={() => setSize(s.talla)}
                      className={cn(
                        "h-11 rounded-xl border text-sm font-bold transition-colors cursor-pointer",
                        active
                          ? "bg-[var(--avax-black)] text-white border-[var(--avax-black)]"
                          : "bg-white text-[var(--avax-black)] border-[var(--border-strong)] hover:border-[var(--avax-black)]",
                        disabled &&
                          "opacity-40 line-through cursor-not-allowed hover:border-[var(--border-strong)]",
                      )}
                    >
                      {s.talla}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold text-[var(--avax-black)]">
              Cantidad
            </p>
            <div className="inline-flex items-center rounded-xl border border-[var(--border-strong)] overflow-hidden w-max">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Restar"
                className="w-11 h-11 flex items-center justify-center hover:bg-[var(--surface-2)] cursor-pointer"
              >
                <Minus size={14} />
              </button>
              <span className="w-12 text-center text-base font-bold">{qty}</span>
              <button
                type="button"
                onClick={() =>
                  setQty((q) => Math.min(selectedSizeStock || q + 1, q + 1))
                }
                aria-label="Sumar"
                className="w-11 h-11 flex items-center justify-center hover:bg-[var(--surface-2)] cursor-pointer"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`https://wa.me/51939592593?text=${encodeURIComponent(
                  `Hola, me interesa: ${product.name} (${product.sku})`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white text-sm font-bold hover:bg-[#1ebd5a] transition-colors cursor-pointer"
              >
                <MessageCircle size={16} />
                AGREGAR WHATSAPP
              </a>
              <button
                type="button"
                disabled={!size}
                onClick={() => handleAdd(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--avax-black)] text-white text-sm font-bold hover:bg-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={16} />
                AGREGAR AL CARRITO
              </button>
            </div>
            <button
              type="button"
              disabled={!size}
              onClick={() => handleAdd(false)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border-2 border-[var(--avax-black)] text-[var(--avax-black)] text-sm font-bold hover:bg-[var(--surface-2)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap size={16} />
              COMPRAR AHORA
            </button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2 p-4 rounded-2xl bg-[var(--surface-2)]">
            <Benefit
              icon={<Truck size={18} />}
              title="Envío gratis"
              desc="En compras desde S/ 200"
            />
            <Benefit
              icon={<RotateCcw size={18} />}
              title="Devolución gratuita"
              desc="30 días para cambios"
            />
            <Benefit
              icon={<ShieldCheck size={18} />}
              title="Producto original"
              desc="100% autenticidad garantizada"
            />
          </div>
        </div>
      </div>

      {/* Specs strip */}
      <section className="mt-12 md:mt-16">
        <h2 className="text-xl md:text-2xl font-extrabold text-[var(--avax-black)] mb-4">
          Especificaciones
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-[var(--border)] rounded-2xl overflow-hidden border border-[var(--border)]">
          <Spec label="Marca" value={product.brand} />
          <Spec label="Modelo" value={product.name} />
          <Spec
            label="Material"
            value="Cuero premium"
          />
          <Spec label="Suela" value="Goma" />
          <Spec
            label="Tipo"
            value={product.category || "Casual"}
          />
        </div>
      </section>

      {/* Tabs */}
      <section className="mt-10 md:mt-14">
        <div className="border-b border-[var(--border)] flex items-center gap-6 overflow-x-auto">
          {(
            [
              { id: "descripcion", label: "Descripción" },
              { id: "especificaciones", label: "Especificaciones" },
              { id: "resenas", label: "Reseñas (158)" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer whitespace-nowrap",
                tab === t.id
                  ? "border-[var(--avax-black)] text-[var(--avax-black)]"
                  : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--avax-black)]",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="py-6 text-sm text-[var(--foreground-muted)] leading-relaxed">
          {tab === "descripcion" && (
            <div className="max-w-3xl">
              <h3 className="text-base font-extrabold text-[var(--avax-black)] mb-3">
                Sobre este producto
              </h3>
              <p>
                {product.description_long ||
                  `Las ${product.name} son un ícono moderno de ${product.brand}. Diseñadas con materiales premium y una construcción duradera, ofrecen comodidad para el día a día y un estilo que combina con todo. Producto 100% original con garantía AVAX.`}
              </p>
            </div>
          )}
          {tab === "especificaciones" && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-3xl">
              <li>• Marca: <span className="text-[var(--avax-black)] font-semibold">{product.brand}</span></li>
              <li>• Modelo: <span className="text-[var(--avax-black)] font-semibold">{product.name}</span></li>
              <li>• Categoría: <span className="text-[var(--avax-black)] font-semibold">{product.category || "—"}</span></li>
              <li>• Género: <span className="text-[var(--avax-black)] font-semibold">{product.gender || "Unisex"}</span></li>
              <li>• Material exterior: <span className="text-[var(--avax-black)] font-semibold">Cuero/Mesh</span></li>
              <li>• Suela: <span className="text-[var(--avax-black)] font-semibold">Goma antideslizante</span></li>
            </ul>
          )}
          {tab === "resenas" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl">
              {[
                {
                  name: "María C.",
                  rating: 5,
                  title: "Increíbles, superan mis expectativas",
                  text: "Muy cómodas desde el primer uso. La calidad se nota.",
                },
                {
                  name: "Juan R.",
                  rating: 5,
                  title: "Excelente relación calidad-precio",
                  text: "Perfectas. El envío fue rápido y el packaging impecable.",
                },
                {
                  name: "Luis F.",
                  rating: 4,
                  title: "Mi nuevo par favorito sin duda",
                  text: "Combinan con todo y son durísimas. Recomendado.",
                },
              ].map((r) => (
                <div
                  key={r.name}
                  className="rounded-2xl border border-[var(--border)] p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < r.rating
                            ? "text-[var(--warning)]"
                            : "text-[var(--border-strong)]"
                        }
                        fill={i < r.rating ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-[var(--avax-black)]">
                    {r.title}
                  </p>
                  <p className="text-xs mt-1">{r.text}</p>
                  <p className="text-[11px] font-bold text-[var(--foreground-subtle)] mt-3">
                    — {r.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12 md:mt-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl md:text-2xl font-extrabold text-[var(--avax-black)]">
              También te puede gustar
            </h2>
            <Link
              href="/tienda"
              className="text-sm font-semibold text-[var(--primary)] hover:underline"
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={toCardProduct(p)} size="sm" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Benefit({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-white text-[var(--primary)] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-[var(--avax-black)]">
          {title}
        </span>
        <span className="text-[11px] text-[var(--foreground-muted)]">
          {desc}
        </span>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-4 flex flex-col gap-1">
      <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-[var(--foreground-subtle)]">
        {label}
      </span>
      <span className="text-sm font-bold text-[var(--avax-black)] line-clamp-1">
        {value}
      </span>
    </div>
  );
}

