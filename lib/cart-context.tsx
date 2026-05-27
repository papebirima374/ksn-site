"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Product, OrderItem } from "./admin-types";

type CartLine = OrderItem;

type CartState = {
  items: CartLine[];
  add: (product: Product, qty?: number) => void;
  update: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  subtotal: number;
  count: number;
  open: boolean;
  setOpen: (b: boolean) => void;
};

const CartContext = createContext<CartState | null>(null);

const STORAGE_KEY = "ksn-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setTimeout(() => setItems(parsed), 0);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {}
    } else {
      isMounted.current = true;
    }
  }, [items]);

  const add = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          category: product.category,
          price: product.price,
          quantity: qty,
        },
      ];
    });
  }, []);

  const update = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, quantity: Math.max(1, qty) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { subtotal, count } = useMemo(() => {
    let s = 0;
    let c = 0;
    for (const i of items) {
      s += i.price * i.quantity;
      c += i.quantity;
    }
    return { subtotal: s, count: c };
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, add, update, remove, clear, subtotal, count, open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    // Permissive fallback so server-rendered pages don't crash
    return {
      items: [] as CartLine[],
      add: () => {},
      update: () => {},
      remove: () => {},
      clear: () => {},
      subtotal: 0,
      count: 0,
      open: false,
      setOpen: () => {},
    } as CartState;
  }
  return ctx;
}
