'use client';
import { Img as Image } from '@/components/ui/Img';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { CloseIcon } from '@/components/ui/Icon';
import { useCatalog } from '@/components/layout/Providers';
import { PriceText } from '@/components/product/PriceText';
import { cartKey, selectTotalQuantity, useCartStore } from '@/store/cart';
import { useUiStore } from '@/store/ui';
import { useDrawerA11y } from '@/lib/useDrawerA11y';

export function CartDrawer() {
  const open = useUiStore((s) => s.cartDrawerOpen);
  const setOpen = useUiStore((s) => s.setCartDrawerOpen);
  const items = useCartStore((s) => s.items);
  const total = useCartStore(selectTotalQuantity);
  const catalog = useCatalog();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  useDrawerA11y(open, ref, close);
  useEffect(() => setOpen(false), [pathname, setOpen]);

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-overlay bg-overlay" onClick={close} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="장바구니"
        tabIndex={-1}
        className="fixed bottom-0 right-0 top-0 z-drawer flex w-full flex-col bg-white md:w-[420px]"
      >
        <div className="flex h-[56px] shrink-0 items-center justify-between px-6">
          <h2 className="text-section uppercase">ADD TO CART ({total})</h2>
          <IconButton label="장바구니 닫기" onClick={close} className="-mr-3">
            <CloseIcon size={20} />
          </IconButton>
        </div>

        {/* 길어지면 본문만 스크롤. 방금 담은 상품이 맨 위 */}
        <ul className="flex-1 overflow-y-auto px-6">
          {items.map((item) => {
            const p = catalog[item.productId];
            if (!p) return null;
            return (
              <li key={cartKey(item)} className="flex gap-4 border-b border-gray-200 py-4 first:pt-2">
                <Link href={`/product/${p.id}`} className="relative aspect-[3/4] w-[80px] shrink-0 bg-gray-100">
                  <Image src={p.image} alt={p.name} fill sizes="80px" className="object-cover" />
                </Link>
                <div className="min-w-0 flex-1 text-caption">
                  <p className="truncate">{p.name}</p>
                  <p className="mt-1 text-gray-600">
                    {item.color} / {item.size}
                  </p>
                  <p className="mt-1 text-gray-600">수량 {item.quantity}</p>
                  <p className="mt-2">
                    <PriceText price={p.price * item.quantity} salePrice={p.salePrice ? p.salePrice * item.quantity : undefined} />
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 gap-2 p-6">
          <ButtonLink href="/cart" variant="secondary" className="flex-1" onClick={close}>
            장바구니 바로가기
          </ButtonLink>
          <ButtonLink href="/login" className="flex-1" onClick={close}>
            구매하기
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
