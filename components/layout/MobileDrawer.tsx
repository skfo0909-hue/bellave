'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IconButton } from '@/components/ui/IconButton';
import { CloseIcon, MinusIcon, PlusIcon } from '@/components/ui/Icon';
import { COMMUNITY_MENU, GLOBAL_MENU, SHOP_MENU } from '@/lib/menu';
import { useDrawerA11y } from '@/lib/useDrawerA11y';
import { selectTotalQuantity, useCartStore } from '@/store/cart';
import { useUiStore } from '@/store/ui';
import { SearchInput } from './SearchInput';

export function MobileDrawer() {
  const open = useUiStore((s) => s.mobileDrawerOpen);
  const setOpen = useUiStore((s) => s.setMobileDrawerOpen);
  const count = useCartStore(selectTotalQuantity);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<'shop' | 'community' | null>(null);
  const close = () => setOpen(false);

  useDrawerA11y(open, ref, close);
  // 메뉴 이동 시 자동으로 닫는다.
  useEffect(() => setOpen(false), [pathname, setOpen]);
  // 데스크톱 폭으로 커지면 잠금이 남지 않도록 닫는다.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const h = () => mq.matches && setOpen(false);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [setOpen]);

  if (!open) return null;

  const toggle = (k: 'shop' | 'community') => setExpanded((v) => (v === k ? null : k));
  const group = (key: 'shop' | 'community', title: string, links: { href: string; label: string }[]) => {
    const isOpen = expanded === key;
    return (
      <li>
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => toggle(key)}
          className="flex min-h-[44px] w-full items-center justify-between text-left text-title uppercase"
        >
          {title}
          {isOpen ? <MinusIcon /> : <PlusIcon />}
        </button>
        {isOpen && (
          <ul className="flex flex-col gap-6 pb-2 pt-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={`inline-flex min-h-[44px] items-center text-body uppercase ${pathname === l.href ? 'font-semibold' : ''}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label="메뉴" tabIndex={-1} className="fixed inset-0 z-drawer overflow-y-auto bg-white md:hidden">
      <div className="flex h-[56px] items-center justify-end px-4">
        <IconButton label="메뉴 닫기" onClick={close} className="-mr-3">
          <CloseIcon size={20} />
        </IconButton>
      </div>
      <nav aria-label="모바일 메뉴" className="px-4 pb-16">
        <ul className="flex flex-col gap-6">
          <li>
            <Link href="/new-arrivals" className="inline-flex min-h-[44px] items-center text-title uppercase">
              NEW ARRIVALS
            </Link>
          </li>
          {group('shop', 'SHOP', SHOP_MENU)}
          {group('community', 'COMMUNITY', COMMUNITY_MENU)}
        </ul>
        <hr className="my-8 border-t border-gray-200" />
        <ul className="flex flex-col gap-4">
          {GLOBAL_MENU.map((m) => (
            <li key={m.label}>
              <Link href={m.href} className="inline-flex min-h-[44px] items-center text-label uppercase">
                {m.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/cart" className="inline-flex min-h-[44px] items-center text-label uppercase">
              CART ({count})
            </Link>
          </li>
        </ul>
        <SearchInput className="mt-8" />
      </nav>
    </div>
  );
}
