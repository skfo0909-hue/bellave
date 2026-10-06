import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BoardList } from '@/components/community/BoardList';
import { ReviewBoard } from '@/components/community/ReviewBoard';
import { PageWithSidebar } from '@/components/layout/PageWithSidebar';
import { getCommunityReviews, getFaqs, getNotices, getProductsByIds } from '@/lib/api';
import { COMMUNITY_MENU } from '@/lib/menu';

const boards = COMMUNITY_MENU.map((m) => m.href.split('/').pop()!);
export const dynamicParams = false;
export const generateStaticParams = () => boards.map((board) => ({ board }));

export function generateMetadata({ params }: { params: { board: string } }): Metadata {
  return { title: params.board.toUpperCase() };
}

async function Board({ board }: { board: string }) {
  if (board === 'notice') {
    const notices = await getNotices();
    return <BoardList items={notices.map((n) => ({ id: n.id, title: n.title, body: n.body, date: n.createdAt }))} />;
  }
  if (board === 'faq') {
    const faqs = await getFaqs();
    return <BoardList items={faqs.map((f) => ({ id: f.id, title: `Q. ${f.question}`, body: f.answer }))} />;
  }
  const reviews = await getCommunityReviews();
  const products = await getProductsByIds(reviews.map((r) => r.productId));
  return <ReviewBoard reviews={reviews} productNames={Object.fromEntries(products.map((p) => [p.id, p.name]))} />;
}

export default function Page({ params }: { params: { board: string } }) {
  if (!boards.includes(params.board)) notFound();
  return (
    <PageWithSidebar menu="community">
      <section className="pt-4 md:pt-6">
        <h1 className="mb-6 text-section uppercase">{params.board}</h1>
        <Board board={params.board} />
      </section>
    </PageWithSidebar>
  );
}
