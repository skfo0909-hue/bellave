'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  productIds: string[];
  toggle: (id: string) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      productIds: [],
      toggle: (id) =>
        set((s) => ({ productIds: s.productIds.includes(id) ? s.productIds.filter((p) => p !== id) : [...s.productIds, id] })),
    }),
    { name: 'bellave-wishlist', skipHydration: true },
  ),
);
