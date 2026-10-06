export function formatPrice(n: number): string {
  return `₩ ${n.toLocaleString('en-US')}`;
}

export function unitPrice(p: { price: number; salePrice?: number }): number {
  return p.salePrice ?? p.price;
}

export function discountRate(p: { price: number; salePrice?: number }): number | null {
  if (!p.salePrice || p.salePrice >= p.price) return null;
  return Math.round((1 - p.salePrice / p.price) * 100);
}

export function formatDate(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, '.');
}
