import type { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/ComingSoon';

export const metadata: Metadata = { title: 'ORDER' };

export default function Page() {
  return (
    <div className="page-x mx-auto max-w-page pb-30">
      <ComingSoon title="ORDER" />
    </div>
  );
}
