'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { COMMUNITY_MENU, SHOP_MENU } from '@/lib/menu';
import { SearchInput } from './SearchInput';

export function Sidebar({ menu }: { menu: 'shop' | 'community' }) {
  const pathname = usePathname();
  const links = menu === 'shop' ? SHOP_MENU : COMMUNITY_MENU;
  return (
    <aside className="sticky top-[56px] z-side hidden h-fit w-[160px] shrink-0 self-start pt-6 md:block lg:top-[80px] lg:w-[200px]">
      <nav aria-label={menu === 'shop' ? 'SHOP 메뉴' : 'COMMUNITY 메뉴'}>
        <ul className="flex flex-col gap-3">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link href={l.href} aria-current={active ? 'page' : undefined} className={`inline-flex min-h-[24px] items-center text-label uppercase hover:underline ${active ? 'font-semibold' : ''}`}>
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <SearchInput className="mt-8 w-[120px]" />
    </aside>
  );
}
