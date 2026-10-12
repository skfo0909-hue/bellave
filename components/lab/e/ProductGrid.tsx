import Link from 'next/link';
import { Img } from '@/components/ui/Img';
import { ArrowIcon } from '@/components/ui/Icon';
import { formatPrice, unitPrice } from '@/lib/format';
import type { Product } from '@/lib/types';

/**
 * 상품 격자: 전체 폭, 얇은 검은 선으로 나뉜 정사각 칸(PC 4열, 모바일 2열). 칸 배경은 gray-100, 상품 컷은 가운데에 두고 이름과 가격을 아래에 가운데 정렬.
 * 위쪽 바에 "NEW ARRIVALS (n)"과 VIEW ALL 링크.
 */
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section aria-label="NEW ARRIVALS">
      <div className="flex h-[48px] items-center justify-between border-y border-black px-4 md:px-10">
        <h2 className="text-body uppercase">NEW ARRIVALS ({products.length})</h2>
        <Link href="/new-arrivals" className="inline-flex min-h-[44px] items-center gap-2 text-label uppercase hover:underline">
          VIEW ALL <ArrowIcon size={14} />
        </Link>
      </div>
      <ul className="grid grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <li key={p.id} className="border-b border-black max-lg:[&:nth-child(odd)]:border-r lg:[&:not(:nth-child(4n))]:border-r">
            <Link href={`/product/${p.id}`} className="group relative block aspect-square bg-gray-100">
              <div className="absolute inset-x-[19%] top-[10%] h-[58%]">
                <Img
                  src={p.images.product}
                  alt={p.name}
                  fill
                  sizes="(min-width:1024px) 14vw, 30vw"
                  className="bg-transparent object-contain mix-blend-multiply transition-transform duration-300 lg:group-hover:scale-[1.03]"
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
