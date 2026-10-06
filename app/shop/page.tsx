import type { Metadata } from 'next';
import { ProductListPage } from '@/components/product/ProductListPage';

export const metadata: Metadata = { title: 'SHOP' };

export default function Page({ searchParams }: { searchParams: { sort?: string; page?: string } }) {
  return <ProductListPage title="ALL" basePath="/shop" scope="all" sp={searchParams} />;
}
