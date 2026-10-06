import type { Category } from './types';

export const CATEGORIES: { slug: Category; label: string }[] = [
  { slug: 'outerwear', label: 'OUTERWEAR' },
  { slug: 'top', label: 'TOP' },
  { slug: 'bottom', label: 'BOTTOM' },
  { slug: 'dresses', label: 'DRESSES' },
  { slug: 'acc', label: 'ACC' },
];

export const SHOP_MENU = [{ href: '/shop', label: 'ALL' }, ...CATEGORIES.map((c) => ({ href: `/shop/${c.slug}`, label: c.label }))];

export const COMMUNITY_MENU = [
  { href: '/community/notice', label: 'NOTICE' },
  { href: '/community/faq', label: 'FAQ' },
  { href: '/community/review', label: 'REVIEW' },
];

export const MAIN_MENU = [
  { href: '/new-arrivals', label: 'NEW ARRIVALS', match: (p: string) => p.startsWith('/new-arrivals') },
  { href: '/shop', label: 'SHOP', match: (p: string) => p.startsWith('/shop') },
  { href: '/community/notice', label: 'COMMUNITY', match: (p: string) => p.startsWith('/community') },
];

// 1차는 비로그인 고정: ORDER도 로그인으로 유도한다.
export const GLOBAL_MENU = [
  { href: '/login', label: 'LOGIN' },
  { href: '/login', label: 'ORDER' },
];
