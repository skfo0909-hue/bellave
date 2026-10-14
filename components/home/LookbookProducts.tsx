'use client';
import { animate, inView } from 'motion';
import { useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowIcon } from '@/components/ui/Icon';
import { Img } from '@/components/ui/Img';
import { formatPrice, unitPrice } from '@/lib/format';
import type { Product } from '@/lib/types';
import { ENTER_EASE } from './useMainMotion';

/**
 * 룩북 챕터의 상품 리스트. 화면 전체 폭(좌우 여백 없음), 얇은 선으로 나뉜 정사각 칸(PC 4열, 태블릿과 모바일 2열).
 * 칸은 흰 바탕, 상품 컷은 칸 폭의 약 69% 정사각 영역 안에 가운데 두고, 이름과 가격을 아래에 가운데 정렬한다.
 * 위쪽 바: 왼쪽 `NEW ARRIVALS (n)`, 오른쪽 `VIEW ALL →` (/new-arrivals).
 * 카드 등장 연출은 칸(li)을 대상으로 처리한다. (요소의 20%가 보일 때 1회)
 */
export function LookbookProducts({ title, products }: { title: string; products: Product[] }) {
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = listRef.current;
    if (!root || reduce) return;
    const width = window.innerWidth;
    const cols = width >= 1024 ? 4 : 2; // 지연은 한 줄 단위로 다시 시작한다
    const step = width >= 1024 ? 0.06 : 0.04; // 모바일 0.04초
    const stops = [...root.querySelectorAll<HTMLElement>(':scope > li')].map((li, i) =>
      inView(
        li,
        () => {
          animate(li, { opacity: 1, y: 0 }, { duration: 0.6, delay: (i % cols) * step, ease: ENTER_EASE });
        },
        { amount: 0.2 },
      ),
    );
    return () => stops.forEach((stop) => stop());
  }, [reduce, products]);

  return (
    <section aria-label={title} className="mt-20 lg:mt-30">
      <div className="flex items-center justify-between border-b border-gray-600 px-4 pb-3 pt-8 md:px-10 lg:pt-12">
        <h2 className="text-body uppercase">NEW ARRIVALS ({products.length})</h2>
        <Link href="/new-arrivals" className="inline-flex min-h-[44px] items-center gap-2 text-label uppercase hover:underline">
          VIEW ALL <ArrowIcon size={14} />
        </Link>
      </div>
      <ul ref={listRef} className={`grid grid-cols-2 lg:grid-cols-4 ${reduce ? '' : '[&>li]:translate-y-[24px] [&>li]:opacity-0'}`}>
        {products.map((p) => (
          <li key={p.id} className="border-b border-gray-600 max-lg:[&:nth-child(odd)]:border-r lg:[&:not(:nth-child(4n))]:border-r">
            <Link href={`/product/${p.id}`} className="relative block aspect-square bg-white">
              <div className="absolute inset-x-[15.5%] top-[6%] aspect-square">
                <Img
                  src={p.images.product}
                  alt={p.name}
                  fill
                  sizes="(min-width:1024px) 17vw, 34vw"
                  className="bg-transparent object-contain"
                />
              </div>
              <div className="absolute inset-x-2 bottom-4 text-center md:bottom-6">
                <p className="text-body uppercase">{p.name}</p>
                <p className="mt-1 text-caption text-gray-600">{formatPrice(unitPrice(p))}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
