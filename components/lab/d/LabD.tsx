import { getLookbook } from '@/lib/api';
import { shuffle } from '@/lib/seeded';
import { HeaderOverlay } from './HeaderOverlay';
import { HeroVisual } from './HeroVisual';
import { D_IMAGES, HERO02 } from './images';
import { IntroCopy } from './IntroCopy';
import { LookCarousel } from './LookCarousel';

const HERO01_ID = 'lab-d-hero-01';

/**
 * 시안 D: 비주얼 룩북 01 → 소개 문구 → 세부 룩 01 → 비주얼 룩북 02 → 세부 룩 02.
 * 헤더와 푸터는 공용을 그대로 쓴다. 이미지는 images.ts에서 교체한다 (비어 있으면 회색 자리).
 */
export async function LabD() {
  const [chapter] = await getLookbook();
  // 세부 룩 순서는 기존 seed 방식으로 섞는다 (같은 seed면 같은 순서)
  const looks01 = shuffle(D_IMAGES.looks01, chapter.seed);
  const looks02 = shuffle(D_IMAGES.looks02, chapter.seed + 1);

  return (
    <div className="overflow-x-clip pb-20">
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&display=swap" />
      <h1 className="sr-only">BELLAVE</h1>
      <HeaderOverlay heroId={HERO01_ID} />
      <HeroVisual id={HERO01_ID} image={D_IMAGES.hero01} label="비주얼 룩북 01 · 가로형" title={chapter.title} align="center" first />
      <IntroCopy chapter={chapter} />
      <LookCarousel images={looks01} label="세부 룩 01" />
      <HeroVisual
        id="lab-d-hero-02"
        image={D_IMAGES.hero02}
        label="비주얼 룩북 02 · 가로형"
        title={HERO02.title}
        copy={HERO02.copy}
        align="right"
      />
      <LookCarousel images={looks02} label="세부 룩 02" />
    </div>
  );
}
