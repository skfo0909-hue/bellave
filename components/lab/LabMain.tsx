import type { ReactNode } from 'react';
import { LookbookProducts } from '@/components/home/LookbookProducts';
import { LookbookTitle } from '@/components/home/LookbookTitle';
import { MainContainer } from '@/components/home/MainContainer';
import { getChapterProducts, getLookbook, getProductSummaries } from '@/lib/api';
import type { LookbookChapter } from '@/lib/types';

/**
 * 시안 공통 골격: 메인(/)과 같은 타이틀, 상품 리스트, 컨테이너를 쓰고 룩북 영역만 시안이 채운다.
 * 시안 컴포넌트는 components/lab/<id>/ 아래에 두고, 채택하지 않은 시안은 그 폴더와 variants.ts의 한 줄만 지우면 된다.
 */
export interface LabLookbookProps {
  chapter: LookbookChapter;
  productNames: Record<string, string>;
}

export async function LabMain({
  lookbook,
  before,
  productsWrap,
  className = 'pb-30',
  title,
}: {
  lookbook: (props: LabLookbookProps) => ReactNode;
  before?: ReactNode;
  /** 상품 리스트 구간을 감싸는 래퍼 (배경 처리 등) */
  productsWrap?: (children: ReactNode) => ReactNode;
  className?: string;
  /** 키 타이틀을 시안 전용 컴포넌트로 바꿀 때 (기본: 공용 LookbookTitle) */
  title?: (chapter: LookbookChapter, first: boolean) => ReactNode;
}) {
  const chapters = await getLookbook();
  const [productLists, summaries] = await Promise.all([Promise.all(chapters.map((c) => getChapterProducts(c))), getProductSummaries()]);
  const productNames = Object.fromEntries(Object.values(summaries).map((p) => [p.id, p.name]));

  return (
    <div className={className}>
      {before}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&display=swap" />
      <h1 className="sr-only">BELLAVE</h1>
      <MainContainer>
        {chapters.map((chapter, i) => (
          <section key={chapter.id} aria-label={chapter.title} className={i > 0 ? 'mt-16 md:mt-20 lg:mt-30' : ''}>
            {title ? title(chapter, i === 0) : <LookbookTitle chapter={chapter} first={i === 0} />}
            {lookbook({ chapter, productNames })}
            {(productsWrap ?? ((c: ReactNode) => c))(<LookbookProducts title={chapter.productsTitle} products={productLists[i]} />)}
          </section>
        ))}
      </MainContainer>
    </div>
  );
}
