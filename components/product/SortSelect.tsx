'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowIcon } from '@/components/ui/Icon';
import type { SortKey } from '@/lib/types';

const OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'new', label: '신상품순' },
  { value: 'price-asc', label: '낮은 가격순' },
  { value: 'price-desc', label: '높은 가격순' },
];

export function SortSelect({ value }: { value: SortKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <label className="relative inline-flex h-[44px] items-center text-label">
      <span className="sr-only">정렬</span>
      <select
        value={value}
        onChange={(e) => {
          const next = new URLSearchParams(params.toString());
          next.set('sort', e.target.value);
          next.delete('page'); // 정렬이 바뀌면 첫 페이지로
          router.push(`${pathname}?${next.toString()}`);
        }}
        className="appearance-none bg-transparent pr-4 text-label outline-none"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-0">
        <ArrowIcon dir="down" size={8} />
      </span>
    </label>
  );
}
