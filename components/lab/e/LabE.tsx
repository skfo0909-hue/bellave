import { ButtonLink } from '@/components/ui/Button';
import { getChapterProducts, getLookbook } from '@/lib/api';
import type { LookbookImage } from '@/lib/types';
import { FeatureSlider } from './FeatureSlider';
import { HeroSplit } from './HeroSplit';
import { IntroCopy } from './IntroCopy';
import { ProductGrid } from './ProductGrid';
import { SpaceGrid } from './SpaceGrid';
import { TeasePair } from './TeasePair';
import { WideVisual } from './WideVisual';
import { Wordmark } from './Wordmark';

/** 소개 문구 교체용 카피 (CLAUDE.md 9-1장 예비 카피) */
const SPACE_COPY = {
  lead: 'Fall is short. Dress like it.',
  copy: "One week it's T-shirts, the next it's puffers. The days made for fall clothes are fewer than you think. Here is everything you can wear right now, before they're gone.",
};

/**
 * 시안 E: 에디토리얼 레이아웃.
 * 히어로(좌우 분할) → 소개 문구 → TEASE(이미지 2) → 워드마크 → ITEM(슬라이더) → SCENE(와이드) → NEW ARRIVALS(상품 격자) → SPACE(2×2) → VIEW ALL.
 * 헤더와 푸터는 공용을 그대로 쓴다. 이미지는 룩북 12컷을 해상도 순으로 나눠 쓴다: 큰 자리(히어로, 슬라이더, 와이드)에는 해상도가 높은 컷을 우선 배정한다.
 */
export async function LabE() {
  const [chapter] = await getLookbook();
  const products = await getChapterProducts(chapter);
  const all = chapter.images;
  const byWidth = [...all].sort((a, b) => b.width - a.width);
  const big = byWidth.filter((i) => i.width >= 1600);
  const mid = byWidth.filter((i) => i.width >= 700 && i.width < 1600);
  const small = byWidth.filter((i) => i.width < 700);
  // 해당 등급에 컷이 모자라면 전체에서 순서대로 가져온다
  const pick = (list: LookbookImage[], k: number) => list[k] ?? all[k % all.length];

  return (
    <div className="pb-20 lg:pb-30">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&display=swap" />
      <h1 className="sr-only">BELLAVE</h1>
      <HeroSplit chapter={chapter} image={pick(big, 0)} />
      <IntroCopy chapter={chapter} />
      <TeasePair images={[pick(mid, 0), pick(mid, 1)]} />
      <Wordmark />
      <FeatureSlider label="ITEM 01" images={[pick(big, 1), pick(big, 2), pick(mid, 2)]} />
      <div className="mt-20 lg:mt-30">
        <WideVisual image={pick(big, 0)} caption={`${chapter.title} — ${chapter.subline}`} />
      </div>
      <div className="mt-20 lg:mt-30">
        <ProductGrid products={products} />
      </div>
      <div className="mt-20 lg:mt-30">
        <SpaceGrid images={[0, 1, 2, 3].map((k) => pick(small, k))} lead={SPACE_COPY.lead} copy={SPACE_COPY.copy} />
      </div>
      <div className="mt-16 flex justify-center">
        <ButtonLink href="/new-arrivals" variant="secondary" className="min-w-[200px]">
          VIEW ALL
        </ButtonLink>
      </div>
    </div>
  );
}
