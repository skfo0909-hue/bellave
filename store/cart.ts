'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/lib/types';

export const cartKey = (i: Pick<CartItem, 'productId' | 'color' | 'size'>) => `${i.productId}|${i.color}|${i.size}`;

interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (key: string) => void;
  removeMany: (keys: string[]) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
}

// hydration 불일치를 막기 위해 skipHydration. StoreHydrator가 마운트 후 복원한다.
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      // 같은 상품, 컬러, 사이즈면 수량을 합산하고, 방금 담은 상품이 맨 위로 온다.
      add: (item) =>
        set((s) => {
          const key = cartKey(item);
          const existing = s.items.find((i) => cartKey(i) === key);
          const merged = existing ? { ...existing, quantity: existing.quantity + item.quantity } : item;
          return { items: [merged, ...s.items.filter((i) => cartKey(i) !== key)] };
        }),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => cartKey(i) !== key) })),
      removeMany: (keys) => set((s) => ({ items: s.items.filter((i) => !keys.includes(cartKey(i))) })),
      updateQuantity: (key, quantity) =>
        set((s) => ({ items: s.items.map((i) => (cartKey(i) === key ? { ...i, quantity: Math.max(1, quantity) } : i)) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'bellave-cart', skipHydration: true },
  ),
);

export const selectTotalQuantity = (s: CartState) => s.items.reduce((sum, i) => sum + i.quantity, 0);
