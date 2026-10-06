import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageWithSidebar } from '@/components/layout/PageWithSidebar';
import { ComingSoon } from '@/components/layout/ComingSoon';
import { COMMUNITY_MENU } from '@/lib/menu';

const boards = COMMUNITY_MENU.map((m) => m.href.split('/').pop()!);
export const dynamicParams = false;
export const generateStaticParams = () => boards.map((board) => ({ board }));

export function generateMetadata({ params }: { params: { board: string } }): Metadata {
  return { title: params.board.toUpperCase() };
}

export default function Page({ params }: { params: { board: string } }) {
  if (!boards.includes(params.board)) notFound();
  return (
    <PageWithSidebar menu="community">
      <ComingSoon title={params.board.toUpperCase()} />
    </PageWithSidebar>
  );
}
