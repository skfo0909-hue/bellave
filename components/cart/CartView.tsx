'use client';
import { useEffect, useMemo, useState } from 'react';
import { useCatalog } from '@/components/layout/Providers';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { unitPrice } from '@/lib/format';
import { cartKey, useCartStore } from '@/store/cart';
import { useUiStore } from '@/store/ui';
import { CartItemCard } from './CartItemCard';
import { CartSummary } from './CartSummary';

export function CartView() {
  const hydrated = useUiStore((s) => s.hydrated);
  const items = useCartStore((s) => s.items);
  const removeMany = useCartStore((s) => s.removeMany);
  const catalog = useCatalog();
  // 체크 해제된 항목만 기억 → 새로 담긴 항목은 기본 선택
  const [unchecked, setUnchecked] = useState<Set<string>>(new Set());

  const keys = useMemo(() => items.map(cartKey), [items]);
  useEffect(() => {
    setUnchecked((prev) => new Set([...prev].filter((k) => keys.includes(k))));
  }, [keys]);

  const selected = items.filter((i) => !unchecked.has(cartKey(i)));
  const allChecked = items.length > 0 && selected.length === items.length;
  const total = selected.reduce((sum, i) => sum + (catalog[i.productId] ? unitPrice(catalog[i.productId]) * i.quantity : 0), 0);

  if (!hydrated) return <div className="min-h-[50vh]" aria-busy="true" />;
  if (items.length === 0) return <EmptyState message="장바구니가 비어 있습니다." href="/shop" cta="SHOP" />;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <label className="flex min-h-[44px] cursor-pointer items-center gap-2 text-label uppercase">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={(e) => setUnchecked(e.target.checked ? new Set() : new Set(keys))}
            className="peer sr-only"
          />
          <span className="flex h-[16px] w-[16px] items-center justify-center border border-black bg-white text-white peer-checked:bg-black peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-black">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" className={allChecked ? '' : 'hidden'}>
              <path d="M1.5 5.2l2.4 2.3L8.5 2.5" />
            </svg>
          </span>
          전체 선택
        </label>
        <Button variant="text" disabled={selected.length === 0} onClick={() => removeMany(selected.map(cartKey))} className="min-h-[44px] px-2">
          선택 삭제
        </Button>
      </div>

      <ul className="grid grid-cols-2 gap-x-2 gap-y-8 md:grid-cols-3 md:gap-x-3 md:gap-y-10 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-12">
        {items.map((item) => {
          const product = catalog[item.productId];
          if (!product) return null;
          const key = cartKey(item);
          return (
            <li key={key}>
              <CartItemCard
                item={item}
                product={product}
                checked={!unchecked.has(key)}
                onCheck={(c) =>
                  setUnchecked((prev) => {
                    const next = new Set(prev);
                    if (c) next.delete(key);
                    else next.add(key);
                    return next;
                  })
                }
              />
            </li>
          );
        })}
      </ul>

      <CartSummary total={total} selectedCount={selected.length} />
    </>
  );
}
