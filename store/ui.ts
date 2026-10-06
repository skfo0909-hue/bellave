'use client';
import { create } from 'zustand';

interface UiState {
  cartDrawerOpen: boolean;
  mobileDrawerOpen: boolean;
  hydrated: boolean; // persist 스토어 복원 완료 여부
  setCartDrawerOpen: (open: boolean) => void;
  setMobileDrawerOpen: (open: boolean) => void;
  setHydrated: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  cartDrawerOpen: false,
  mobileDrawerOpen: false,
  hydrated: false,
  setCartDrawerOpen: (cartDrawerOpen) => set({ cartDrawerOpen }),
  setMobileDrawerOpen: (mobileDrawerOpen) => set({ mobileDrawerOpen }),
  setHydrated: () => set({ hydrated: true }),
}));
