'use client';
import { Img as Image } from '@/components/ui/Img';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { ColorSelector } from '@/components/ui/ColorChip';
import { HeartIcon } from '@/components/ui/Icon';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { SizeSelector } from '@/components/ui/SizeSelector';
import { formatPrice, unitPrice } from '@/lib/format';
import type { Product } from '@/lib/types';
import { useCartStore } from '@/store/cart';
import { useUiStore } from '@/store/ui';
import { useWishlistStore } from '@/store/wishlist';
import { PriceText } from './PriceText';

const DELIVERY = '주문 후 2~4일 이내 발송됩니다(영업일 기준). 5만원 이상 구매 시 무료배송입니다. 수령 후 7일 이내 교환 및 반품이 가능하며, 착용 또는 세탁한 상품은 제외됩니다.';

export function ProductInfoPanel({ product, styledWith }: { product: Product; styledWith: Product[] }) {
  const router = useRouter();
  const addToCart = useCartStore((s) => s.add);
  const setCartDrawerOpen = useUiStore((s) => s.setCartDrawerOpen);
  const wished = useWishlistStore((s) => s.productIds.includes(product.id));
  const toggleWish = useWishlistStore((s) => s.toggle);

  const [color, setColor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [attempted, setAttempted] = useState(false);

  // 컬러와 사이즈를 고르지 않으면 해당 영역 아래에 안내 문구를 표시한다.
  const commit = () => {
    if (!color || !size) {
      setAttempted(true);
      return false;
    }
    addToCart({ productId: product.id, color, size, quantity });
    return true;
  };
  const onAdd = () => commit() && setCartDrawerOpen(true);
  const onBuy = () => commit() && router.push('/login'); // 1차: 로그인 유도

  const actions = (
    <>
      <Button className="flex-1" onClick={onBuy}>
        BUY NOW
      </Button>
      <Button variant="secondary" className="flex-1" onClick={onAdd}>
        ADD TO CART
      </Button>
    </>
  );

  return (
    <div className="pt-6 md:pl-6 md:pt-0 lg:pl-10">
      <h1 className="text-title">{product.name}</h1>
      <p className="mt-2 text-body">
        <PriceText price={product.price} salePrice={product.salePrice} showRate />
      </p>

      <div className="mt-8">
        <ColorSelector colors={product.colors} value={color} onChange={setColor} />
        {attempted && !color && <p className="mt-1 text-caption text-error">컬러를 선택해 주세요.</p>}
      </div>

      <div className="mt-6">
        <SizeSelector sizes={product.sizes} value={size} onChange={setSize} />
        {attempted && !size && <p className="mt-1 text-caption text-error">사이즈를 선택해 주세요.</p>}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4">
        <QuantityStepper value={quantity} onChange={setQuantity} />
        <p className="text-body">
          <span className="mr-3 text-label uppercase text-gray-600">Total</span>
          {formatPrice(unitPrice(product) * quantity)}
        </p>
      </div>

      {/* 모바일에서는 하단 고정 바로 이동 */}
      <div className="mt-6 flex items-stretch gap-2">
        <div className="hidden flex-1 gap-2 md:flex">{actions}</div>
        <button
          type="button"
          aria-label={wished ? '위시리스트에서 제거' : '위시리스트에 추가'}
          aria-pressed={wished}
          onClick={() => toggleWish(product.id)}
          className="flex h-[48px] w-[48px] items-center justify-center border border-gray-200 hover:border-black max-md:w-full"
        >
          <HeartIcon filled={wished} size={20} />
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-header flex gap-2 bg-white p-2 md:hidden">{actions}</div>

      <div className="mt-8">
        <Accordion title="Details">{product.description}</Accordion>
        <Accordion title="Size Guide">{product.sizeGuide}</Accordion>
        <Accordion title="Delivery & Returns">{DELIVERY}</Accordion>
      </div>

      {styledWith.length > 0 && (
        <section className="mt-10" aria-labelledby="styled-with">
          <h2 id="styled-with" className="section-title mb-4">
            Styled With
          </h2>
          <ul className="grid grid-cols-4 gap-2">
            {styledWith.slice(0, 4).map((p) => (
              <li key={p.id}>
                <Link href={`/product/${p.id}`} className="block">
                  <div className="relative aspect-[3/4] bg-gray-100">
                    <Image src={p.images.product} alt={p.name} fill sizes="10vw" className="object-cover" />
                  </div>
                  <p className="mt-2 truncate text-caption">{p.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
