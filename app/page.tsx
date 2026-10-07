import { LookbookProducts } from '@/components/home/LookbookProducts';
import { LookbookScene } from '@/components/home/LookbookScene';
import { getChapterProducts, getLookbook } from '@/lib/api';

export default async function Home() {
  const chapters = await getLookbook();
  const products = await Promise.all(chapters.map((c) => getChapterProducts(c)));
  return (
    <div className="pb-30">
      {/* 스크립트체는 메인 룩북에서만 쓰므로 이 페이지에서만 불러온다 */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap" />
      <h1 className="sr-only">BELLAVE</h1>
      {chapters.map((chapter, i) => (
        <div key={chapter.id} className={i > 0 ? 'mt-16 md:mt-20 lg:mt-30' : ''}>
          <LookbookScene chapter={chapter} priority={i === 0} />
          <LookbookProducts title={chapter.productsTitle} products={products[i]} showViewAll={i === chapters.length - 1} />
        </div>
      ))}
    </div>
  );
}
