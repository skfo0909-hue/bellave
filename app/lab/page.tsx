import type { Metadata } from 'next';
import { LabCompare } from '@/components/lab/LabCompare';

export const metadata: Metadata = { title: 'LAB', robots: { index: false } };

export default function LabIndex() {
  return <LabCompare />;
}
