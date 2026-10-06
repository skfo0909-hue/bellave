'use client';
import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useUiStore } from '@/store/ui';
import type { ProductSummary } from '@/lib/types';

const CatalogContext = createContext<Record<string, ProductSummary>>({});
export const useCatalog = () => useContext(CatalogContext);

export function Providers({ catalog, children }: { catalog: Record<string, ProductSummary>; children: ReactNode }) {
  const setHydrated = useUiStore((s) => s.setHydrated);
  // persist 복원은 마운트 후에 수행해 서버/클라이언트 첫 렌더를 일치시킨다.
  useEffect(() => {
    Promise.all([useCartStore.persist.rehydrate(), useWishlistStore.persist.rehydrate()]).then(setHydrated);
  }, [setHydrated]);
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}
