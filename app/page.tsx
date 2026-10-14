import { LookbookCollage } from '@/components/home/LookbookCollage';
import { LookbookProducts } from '@/components/home/LookbookProducts';
import { LookbookTitle } from '@/components/home/LookbookTitle';
import { MainContainer } from '@/components/home/MainContainer';
import { getChapterProducts, getLookbook, getProductSummaries } from '@/lib/api';

export default async function Home() {
  const chapters = await getLookbook();
  const [productLists, summaries] = await Promise.all([Promise.all(chapters.map((c) => getChapterProducts(c))), getProductSummaries()]);
  const productNames = Object.fromEntries(Object.values(summaries).map((p) => [p.id, p.name]));

  return (
    // overflow-x-clip: 전체 폭 상품 리스트가 가로 스크롤을 만들지 않게 한다
    <div className="overflow-x-clip">
      {/* 페이지 배경: 화면에 고정된 위→아래 그라디언트 (스크롤해도 움직이지 않는다) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-mist-100 from-[8%] via-mist-300 via-[28%] to-white"
      />
      {/* 키 타이틀 서체(Archivo)는 메인 룩북에서만 쓰므로 이 페이지에서만 불러온다 */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,900&display=swap" />
      <h1 className="sr-only">BELLAVE</h1>
      {chapters.map((chapter, i) => (
        <section key={chapter.id} aria-label={chapter.title} className={i > 0 ? 'mt-16 md:mt-20 lg:mt-30' : ''}>
          <MainContainer>
            <LookbookTitle chapter={chapter} first={i === 0} />
            <LookbookCollage images={chapter.images} seed={chapter.seed} pinLarge={chapter.pinLarge} productNames={productNames} />
          </MainContainer>
          <LookbookProducts title={chapter.productsTitle} products={productLists[i]} />
        </section>
      ))}
    </div>
  );
}
