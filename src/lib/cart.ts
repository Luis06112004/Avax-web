export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  size: string;
  color?: string;
  unitPrice: number;
  qty: number;
  stock: number;
};

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  province: string;
  district: string;
  address: string;
  reference?: string;
  notes?: string;
};

export type ShippingMethod = {
  id: "estandar" | "express" | "mismo_dia" | "tienda";
  name: string;
  description: string;
  price: number;
};

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "estandar",
    name: "Envío estándar",
    description: "Entrega en 5-7 días hábiles",
    price: 0,
  },
  {
    id: "express",
    name: "Envío express",
    description: "Entrega en 2-3 días hábiles",
    price: 15,
  },
  {
    id: "mismo_dia",
    name: "Envío mismo día",
    description: "Entrega hoy antes de las 9pm (solo Lima)",
    price: 25,
  },
  {
    id: "tienda",
    name: "Recojo en tienda",
    description: "Disponible en 24 horas - AVAX Store Miraflores",
    price: 0,
  },
];

export type PaymentMethod = "tarjeta" | "yape" | "transferencia";

export type PaymentInfo = {
  method: PaymentMethod;
  cardNumber?: string;
  cardName?: string;
  cardExp?: string;
  cardCvv?: string;
  saveCard?: boolean;
  yapePhone?: string;
};

export type ConfirmedOrder = {
  number: string;
  createdAt: string;
  estimatedDelivery: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  shippingMethod: ShippingMethod;
  address: ShippingAddress;
  payment: PaymentInfo;
  total: number;
};

export function makeCartItemId(
  productId: string,
  size: string,
  color?: string,
): string {
  return `${productId}__${size}__${color ?? ""}`;
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `AVX-${year}-${rand}`;
}

export function estimatedDeliveryRange(method: ShippingMethod["id"]): string {
  const start = new Date();
  const end = new Date();
  const fmt = (d: Date) =>
    d.toLocaleDateString("es-PE", { day: "numeric", month: "long" });

  switch (method) {
    case "mismo_dia":
      return `Hoy, ${fmt(start)}`;
    case "express":
      start.setDate(start.getDate() + 2);
      end.setDate(end.getDate() + 3);
      return `${fmt(start)} - ${fmt(end)}`;
    case "tienda":
      end.setDate(end.getDate() + 1);
      return `Disponible ${fmt(end)}`;
    case "estandar":
    default:
      start.setDate(start.getDate() + 5);
      end.setDate(end.getDate() + 7);
      return `${fmt(start)} - ${fmt(end)}`;
  }
}
