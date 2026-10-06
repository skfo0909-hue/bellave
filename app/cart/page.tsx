import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';

export const metadata: Metadata = { title: 'CART' };

export default function Page() {
  return (
    <div className="page-x mx-auto max-w-page pb-30 pt-6">
      <h1 className="mb-6 text-title uppercase">CART</h1>
      <CartView />
    </div>
  );
}
