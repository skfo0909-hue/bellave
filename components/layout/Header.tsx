'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { IconButton } from '@/components/ui/IconButton';
import { MenuIcon, SearchIcon } from '@/components/ui/Icon';
import { GLOBAL_MENU, MAIN_MENU } from '@/lib/menu';
import { selectTotalQuantity, useCartStore } from '@/store/cart';
import { useUiStore } from '@/store/ui';

const item = (active: boolean) => `inline-flex h-[44px] items-center text-label uppercase ${active ? 'font-semibold' : ''} hover:underline`;

export function Header() {
  const pathname = usePathname();
  const count = useCartStore(selectTotalQuantity);
  const setMobileDrawerOpen = useUiStore((s) => s.setMobileDrawerOpen);
  const cartLabel = `CART (${count})`;

  return (
    <header className="fixed inset-x-0 top-0 z-header h-[56px] bg-white lg:h-[80px]">
      <div className="page-x mx-auto flex h-full max-w-page items-center justify-between">
        {/* 모바일: 햄버거 / 로고 / 검색, CART */}
        <div className="flex items-center md:hidden">
          <IconButton label="메뉴 열기" onClick={() => setMobileDrawerOpen(true)} className="-ml-3">
            <MenuIcon size={20} />
          </IconButton>
        </div>
        <div className="max-md:absolute max-md:left-1/2 max-md:-translate-x-1/2">
          <Logo />
        </div>
        <div className="flex items-center md:hidden">
          <IconButton label="검색" onClick={() => setMobileDrawerOpen(true)}>
            <SearchIcon />
          </IconButton>
          <Link href="/cart" className={`${item(pathname === '/cart')} -mr-2 px-2`} aria-label={`장바구니 ${count}개`}>
            {cartLabel}
          </Link>
        </div>

        {/* 태블릿, PC */}
        <nav aria-label="주 메뉴" className="hidden items-center md:flex">
          <ul className="flex items-center gap-6">
            {MAIN_MENU.map((m) => {
              const active = m.match(pathname);
              return (
                <li key={m.label}>
                  <Link href={m.href} aria-current={active ? 'page' : undefined} className={item(active)}>
                    {m.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul className="ml-12 flex items-center gap-5">
            {GLOBAL_MENU.map((m) => (
              <li key={m.label}>
                <Link href={m.href} className={item(false)}>
                  {m.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/cart" aria-current={pathname === '/cart' ? 'page' : undefined} className={item(pathname === '/cart')}>
                {cartLabel}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
