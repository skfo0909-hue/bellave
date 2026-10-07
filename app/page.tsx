import { LookbookCollage } from '@/components/home/LookbookCollage';
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
            {/* 룩북 레이아웃은 lookbook.json의 layout 값으로 전환한다 ('collage' 기본, 'grid'는 기존 모자이크). 같은 12컷, 같은 seed 순서를 받는다. */}
            {chapter.layout === 'grid' ? (
              <LookbookGrid images={chapter.images} productNames={productNames} />
            ) : (
              <LookbookCollage images={chapter.images} seed={chapter.seed} pinLarge={chapter.pinLarge} productNames={productNames} />
            )}
            <LookbookProducts title={chapter.productsTitle} products={productLists[i]} />
          </section>
        ))}
      </MainContainer>
    </div>
  );
}
