import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LAB_VARIANTS } from '@/components/lab/variants';

export const metadata: Metadata = { title: 'LAB', robots: { index: false } };

export function generateStaticParams() {
  return LAB_VARIANTS.map((v) => ({ variant: v.id }));
}
export const dynamicParams = false;

export default function LabVariantPage({ params }: { params: { variant: string } }) {
  const v = LAB_VARIANTS.find((x) => x.id === params.variant);
  if (!v) notFound();
  return <v.Component />;
}
