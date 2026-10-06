import type { Metadata } from 'next';
import { PageWithSidebar } from '@/components/layout/PageWithSidebar';
import { ComingSoon } from '@/components/layout/ComingSoon';

export const metadata: Metadata = { title: 'SEARCH' };

export default function Page() {
  return (
    <PageWithSidebar menu="shop">
      <ComingSoon title="SEARCH" />
    </PageWithSidebar>
  );
}
