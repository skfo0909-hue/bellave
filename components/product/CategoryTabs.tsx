'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SHOP_MENU } from '@/lib/menu';

// 모바일 상품 리스트: 사이드바 대신 2뎁스 가로 스크롤 탭
export function CategoryTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="카테고리" className="no-scrollbar -mx-4 mb-4 overflow-x-auto px-4 md:hidden">
      <ul className="flex gap-6 whitespace-nowrap">
        {SHOP_MENU.map((l) => {
          const active = pathname === l.href;
          return (
            <li key={l.href}>
              <Link href={l.href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-[44px] items-center text-label uppercase ${active ? 'font-semibold' : 'text-gray-600'}`}>
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
