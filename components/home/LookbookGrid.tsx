import { Img as Image } from '@/components/ui/Img';
import Link from 'next/link';
import type { Lookbook } from '@/lib/types';

// PC 3열 모자이크(large = 2열 x 2행), 모바일 2열(large는 전체 폭). 마지막에 시즌 타이틀 블록.
export function LookbookGrid({ lookbook }: { lookbook: Lookbook }) {
  return (
    <section aria-label={lookbook.title} className="page-x mx-auto max-w-page">
      <ul className="grid grid-flow-dense grid-cols-2 gap-2 lg:grid-cols-3 lg:gap-3">
        {lookbook.items.map((item, i) => {
          const large = item.size === 'large';
          const href = `/product/${item.productIds[0]}`;
          return (
            <li key={item.id} className={`aspect-[3/4] ${large ? 'col-span-2 row-span-2 aspect-[3/4]' : ''}`}>
              <Link href={href} className="relative block h-full w-full bg-gray-100" aria-label={`${lookbook.title} 룩 ${i + 1}`}>
                <Image
                  src={item.image}
                  alt={`${lookbook.title} 룩 ${i + 1}`}
                  fill
                  sizes={large ? '(min-width:1024px) 66vw, 100vw' : '(min-width:1024px) 33vw, 50vw'}
                  priority={i < 2}
                  className="object-cover"
                />
              </Link>
            </li>
          );
        })}
        <li className="col-span-2 flex items-end p-4 lg:col-span-1 lg:aspect-[3/4] lg:p-6">
          <div>
            <h1 className="text-display-sm md:text-display">{lookbook.title}</h1>
            <p className="mt-4 text-body text-gray-600">{lookbook.description}</p>
          </div>
        </li>
      </ul>
    </section>
  );
}
