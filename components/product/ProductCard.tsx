'use client';
import { Img as Image } from '@/components/ui/Img';
import Link from 'next/link';
import { ColorDot } from '@/components/ui/ColorChip';
import { MinusIcon, PlusIcon } from '@/components/ui/Icon';
import { useWishlistStore } from '@/store/wishlist';
import type { Product } from '@/lib/types';
import { PriceText } from './PriceText';

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const wished = useWishlistStore((s) => s.productIds.includes(product.id));
  const toggle = useWishlistStore((s) => s.toggle);
  const sizes = '(min-width:1024px) 20vw, (min-width:768px) 28vw, 46vw';
  const href = `/product/${product.id}`;

  return (
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <Link href={href} className="absolute inset-0 block" aria-label={product.name}>
          <Image src={product.images.product} alt={product.name} fill sizes={sizes} priority={priority} className="object-cover" />
          {/* 호버 가능한 기기에서만 착용 컷을 0.3초 페이드로 겹친다 */}
          <Image
            src={product.images.worn}
            alt=""
            fill
            sizes={sizes}
            className="object-cover opacity-0 transition-opacity duration-300 ease-out [@media(hover:hover)]:group-hover:opacity-100"
          />
        </Link>
        {/* 카드 이동과 분리된 위시리스트 토글 (터치 영역 44px) */}
        <button
          type="button"
          aria-label={wished ? `${product.name} 위시리스트에서 제거` : `${product.name} 위시리스트에 추가`}
          aria-pressed={wished}
          onClick={() => toggle(product.id)}
          className="absolute bottom-0 right-0 flex h-[44px] w-[44px] items-center justify-center"
        >
          {wished ? <MinusIcon /> : <PlusIcon />}
        </button>
      </div>
      <Link href={href} className="block">
        <h3 className="mt-3 truncate text-caption">{product.name}</h3>
        <p className="mt-1 text-caption">
          <PriceText price={product.price} salePrice={product.salePrice} />
        </p>
      </Link>
      <div className="mt-2 flex gap-1">
        {product.colors.map((c) => (
          <ColorDot key={c.name} hex={c.hex} name={c.name} />
        ))}
      </div>
    </article>
  );
}
