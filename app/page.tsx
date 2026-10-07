import { LookbookGrid } from '@/components/home/LookbookGrid';
import { LookbookProducts } from '@/components/home/LookbookProducts';
import { LookbookTitle } from '@/components/home/LookbookTitle';
import { MainContainer } from '@/components/home/MainContainer';
import { getChapterProducts, getLookbook, getProductSummaries } from '@/lib/api';

export default async function Home() {
  const chapters = await getLookbook();
  const [productLists, summaries] = await Promise.all([Promise.all(chapters.map((c) => getChapterProducts(c))), getProductSummaries()]);
  const productNames = Object.fromEntries(Object.values(summaries).map((p) => [p.id, p.name]));

  return (
    <div className="pb-30">
      {/* 키 타이틀 서체(Anton)는 메인 룩북에서만 쓰므로 이 페이지에서만 불러온다 */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&display=swap" />
      <h1 className="sr-only">BELLAVE</h1>
      <MainContainer>
        {chapters.map((chapter, i) => (
          <section key={chapter.id} aria-label={chapter.title} className={i > 0 ? 'mt-16 md:mt-20 lg:mt-30' : ''}>
            <LookbookTitle chapter={chapter} first={i === 0} />
            <LookbookGrid images={chapter.images} productNames={productNames} />
            <LookbookProducts title={chapter.productsTitle} products={productLists[i]} />
          </section>
        ))}
      </MainContainer>
    </div>
  );
}
