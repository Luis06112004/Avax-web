"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  CartItem,
  ConfirmedOrder,
  PaymentInfo,
  ShippingAddress,
  ShippingMethod,
} from "@/lib/cart";
import {
  SHIPPING_METHODS,
  estimatedDeliveryRange,
  generateOrderNumber,
  makeCartItemId,
} from "@/lib/cart";

const STORAGE_KEY = "avax_cart_v1";
const ORDER_KEY = "avax_last_order_v1";

// El estado del checkout (datos personales y de envío) NO se persiste:
// son datos privados que deben ingresarse manualmente cada compra. Solo
// vive en memoria mientras el usuario está navegando los pasos del flujo.

type CheckoutState = {
  address: ShippingAddress | null;
  shippingId: ShippingMethod["id"];
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartItem, "id">) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  // Checkout state
  address: ShippingAddress | null;
  setAddress: (a: ShippingAddress) => void;
  shippingMethod: ShippingMethod;
  setShippingMethodId: (id: ShippingMethod["id"]) => void;
  shippingCost: number;
  total: number;
  // Order
  lastOrder: ConfirmedOrder | null;
  confirmOrder: (payment: PaymentInfo, orderNumber?: string) => ConfirmedOrder;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkout, setCheckout] = useState<CheckoutState>({
    address: null,
    shippingId: "estandar",
  });
  const [lastOrder, setLastOrder] = useState<ConfirmedOrder | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount (cart items + last order only)
  useEffect(() => {
    try {
      const cartRaw = localStorage.getItem(STORAGE_KEY);
      if (cartRaw) setItems(JSON.parse(cartRaw));
      const orderRaw = localStorage.getItem(ORDER_KEY);
      if (orderRaw) setLastOrder(JSON.parse(orderRaw));
      // Limpiar persistencia legacy del checkout si existiera
      localStorage.removeItem("avax_checkout_v1");
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  // Persist cart only (checkout state stays in memory)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const addItem = useCallback<CartContextValue["addItem"]>((item) => {
    const id = makeCartItemId(item.productId, item.size, item.color);
    setItems((curr) => {
      const idx = curr.findIndex((i) => i.id === id);
      if (idx >= 0) {
        const next = [...curr];
        const merged = next[idx].qty + item.qty;
        next[idx] = {
          ...next[idx],
          qty: Math.min(merged, item.stock || merged),
        };
        return next;
      }
      return [...curr, { ...item, id }];
    });
    setDrawerOpen(true);
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setItems((curr) =>
      curr
        .map((i) =>
          i.id === id
            ? { ...i, qty: Math.max(1, Math.min(qty, i.stock || qty)) }
            : i,
        )
        .filter((i) => i.qty > 0),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((curr) => curr.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const setAddress = useCallback((a: ShippingAddress) => {
    setCheckout((c) => ({ ...c, address: a }));
  }, []);

  const setShippingMethodId = useCallback((id: ShippingMethod["id"]) => {
    setCheckout((c) => ({ ...c, shippingId: id }));
  }, []);

  const shippingMethod = useMemo<ShippingMethod>(() => {
    return (
      SHIPPING_METHODS.find((s) => s.id === checkout.shippingId) ??
      SHIPPING_METHODS[0]
    );
  }, [checkout.shippingId]);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0),
    [items],
  );

  const shippingCost = shippingMethod.price;
  const total = subtotal + shippingCost;

  const confirmOrder = useCallback<CartContextValue["confirmOrder"]>(
    (payment, orderNumber) => {
      const order: ConfirmedOrder = {
        number: orderNumber ?? generateOrderNumber(),
        createdAt: new Date().toISOString(),
        estimatedDelivery: estimatedDeliveryRange(shippingMethod.id),
        items,
        subtotal,
        shippingCost,
        shippingMethod,
        address: checkout.address!,
        payment,
        total,
      };
      setLastOrder(order);
      try {
        localStorage.setItem(ORDER_KEY, JSON.stringify(order));
      } catch {
        // ignore
      }
      // Clear cart and checkout state after confirmation so the next
      // visit to /checkout/datos-envio starts with empty inputs.
      setItems([]);
      setCheckout({ address: null, shippingId: "estandar" });
      return order;
    },
    [
      items,
      subtotal,
      shippingCost,
      shippingMethod,
      checkout.address,
      total,
    ],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalItems,
      subtotal,
      drawerOpen,
      openDrawer,
      closeDrawer,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      address: checkout.address,
      setAddress,
      shippingMethod,
      setShippingMethodId,
      shippingCost,
      total,
      lastOrder,
      confirmOrder,
    }),
    [
      items,
      totalItems,
      subtotal,
      drawerOpen,
      openDrawer,
      closeDrawer,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      checkout.address,
      setAddress,
      shippingMethod,
      setShippingMethodId,
      shippingCost,
      total,
      lastOrder,
      confirmOrder,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

/** Returns the cart context if available, otherwise null (e.g. inside admin routes). */
export function useCartOptional() {
  return useContext(CartContext);
}
