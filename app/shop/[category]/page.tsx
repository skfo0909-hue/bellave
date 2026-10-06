import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductListPage } from '@/components/product/ProductListPage';
import { CATEGORIES } from '@/lib/menu';

export const dynamicParams = false;
export const generateStaticParams = () => CATEGORIES.map((c) => ({ category: c.slug }));

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  return { title: CATEGORIES.find((c) => c.slug === params.category)?.label };
}

export default function Page({ params, searchParams }: { params: { category: string }; searchParams: { sort?: string; page?: string } }) {
  const cat = CATEGORIES.find((c) => c.slug === params.category);
  if (!cat) notFound();
  return <ProductListPage title={cat.label} basePath={`/shop/${cat.slug}`} scope={cat.slug} sp={searchParams} />;
}
