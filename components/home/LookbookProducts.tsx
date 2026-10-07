'use client';
import { animate, inView } from 'motion';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ButtonLink } from '@/components/ui/Button';
import type { Product } from '@/lib/types';
import { ENTER_EASE } from './useMainMotion';

/**
 * 룩북 챕터의 상품 리스트. ProductGrid/ProductCard는 수정 없이 재사용하므로,
 * 카드 등장 연출은 래퍼에서 그리드의 li를 대상으로 처리한다. (요소의 20%가 보일 때 1회)
 */
export function LookbookProducts({ title, products }: { title: string; products: Product[] }) {
  const reduce = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const enter = { duration: reduce ? 0 : 0.6, ease: ENTER_EASE };

  useEffect(() => {
    const root = gridRef.current;
    if (!root || reduce) return;
    const width = window.innerWidth;
    const cols = width >= 1024 ? 4 : width >= 768 ? 3 : 2; // 지연은 한 줄 단위로 다시 시작한다
    const step = width >= 1024 ? 0.06 : width >= 768 ? 0.06 : 0.04; // 모바일 0.04초
    const stops = [...root.querySelectorAll<HTMLElement>(':scope > ul > li')].map((li, i) =>
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
    <section aria-label={title} className="mt-12 md:mt-16 lg:mt-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={enter}
        className="mb-6 flex items-baseline justify-between lg:mb-8"
      >
        <h2 className="text-section uppercase">{title}</h2>
        <p className="text-label text-gray-600">{products.length} {products.length === 1 ? 'ITEM' : 'ITEMS'}</p>
      </motion.div>

      <div ref={gridRef} className={reduce ? '' : '[&_li]:translate-y-[24px] [&_li]:opacity-0'}>
        <ProductGrid products={products} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: reduce ? 0 : 0.4, ease: ENTER_EASE }}
        className="mt-12 flex justify-center"
      >
        <ButtonLink href="/new-arrivals" variant="secondary" className="min-w-[200px]">
          VIEW ALL
        </ButtonLink>
      </motion.div>
    </section>
  );
}
