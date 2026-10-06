'use client';
import { Img as Image } from '@/components/ui/Img';
import Link from 'next/link';
import { CloseIcon, HeartIcon } from '@/components/ui/Icon';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { PriceText } from '@/components/product/PriceText';
import type { CartItem, ProductSummary } from '@/lib/types';
import { cartKey, useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';

export function CartItemCard({
  item,
  product,
  checked,
  onCheck,
}: {
  item: CartItem;
  product: ProductSummary;
  checked: boolean;
  onCheck: (checked: boolean) => void;
}) {
  const key = cartKey(item);
  const remove = useCartStore((s) => s.remove);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const wished = useWishlistStore((s) => s.productIds.includes(product.id));
  const toggleWish = useWishlistStore((s) => s.toggle);
  const href = `/product/${product.id}`;

  return (
    <article>
      <div className="relative aspect-[3/4] bg-gray-100">
        <Link href={href} className="absolute inset-0 block" aria-label={product.name}>
          <Image src={product.image} alt={product.name} fill sizes="(min-width:1024px) 18vw, (min-width:768px) 28vw, 46vw" className="object-cover" />
        </Link>
        <label className="absolute left-0 top-0 flex h-[44px] w-[44px] cursor-pointer items-center justify-center">
          <input type="checkbox" checked={checked} onChange={(e) => onCheck(e.target.checked)} aria-label={`${product.name} 선택`} className="peer sr-only" />
          <span className="flex h-[16px] w-[16px] items-center justify-center border border-black bg-white text-white peer-checked:bg-black peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-black">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" className={checked ? '' : 'hidden'}>
              <path d="M1.5 5.2l2.4 2.3L8.5 2.5" />
            </svg>
          </span>
        </label>
      </div>

      <div className="mt-3 flex items-start justify-between gap-1">
        <Link href={href} className="min-w-0 flex-1 truncate text-caption">
          {product.name}
        </Link>
        <div className="-mr-3 -mt-3 flex shrink-0">
          <button
            type="button"
            aria-label={wished ? '위시리스트에서 제거' : '위시리스트에 추가'}
            aria-pressed={wished}
            onClick={() => toggleWish(product.id)}
            className="flex h-[44px] w-[32px] items-center justify-center"
          >
            <HeartIcon filled={wished} size={14} />
          </button>
          <button type="button" aria-label={`${product.name} 삭제`} onClick={() => remove(key)} className="flex h-[44px] w-[32px] items-center justify-center">
            <CloseIcon size={14} />
          </button>
        </div>
      </div>
      <p className="text-caption">
        <PriceText price={product.price} salePrice={product.salePrice} />
      </p>
      <p className="mt-1 text-caption text-gray-600">
        {item.color} / {item.size}
      </p>
      <div className="mt-2">
        <QuantityStepper value={item.quantity} onChange={(n) => updateQuantity(key, n)} label={`${product.name} 수량`} />
      </div>
    </article>
  );
}
