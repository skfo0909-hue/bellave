import type { Metadata } from 'next';
import { ProductListPage } from '@/components/product/ProductListPage';

export const metadata: Metadata = { title: 'NEW ARRIVALS' };

export default function Page({ searchParams }: { searchParams: { sort?: string; page?: string } }) {
  return <ProductListPage title="NEW ARRIVALS" basePath="/new-arrivals" scope="new" sp={searchParams} />;
}
