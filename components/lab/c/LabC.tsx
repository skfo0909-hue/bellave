import { LookbookCollage } from '@/components/home/LookbookCollage';
import { LabMain } from '../LabMain';
import { HeaderWhite } from './HeaderWhite';
import { LabTitle } from './LabTitle';
import { SteelBackground } from './SteelBackground';
import { WhiteProducts } from './WhiteProducts';

/** 컷이 선명해지는 정도: 시작 블러(px), 시작 확대 비율, 선명해지는 지점 (컷 윗변이 화면 높이 28%에 닿을 때). 기본(16px)보다 강하다. */
const BLUR_REVEAL = { blur: 36, scale: 1.12, end: 28 };
/** 컷을 기울이는 최대 각도(도). 컷마다 40~100% 사이 값, 방향은 좌우 무작위. 0이면 반듯하게. */
const TILT = 2.4;

/** 시안 C: B와 같은 collage 레이아웃 + 고정 Steel 배경, 상품 리스트부터 흰 배경 */
export function LabC() {
  return (
    <LabMain
      before={
        <>
          <SteelBackground />
          <HeaderWhite />
        </>
      }
      title={(chapter) => <LabTitle chapter={chapter} />}
      className="overflow-x-clip"
      productsWrap={(children) => <WhiteProducts>{children}</WhiteProducts>}
      lookbook={({ chapter, productNames }) => (
        // 룩북 구간 위아래 여백: 타이틀 블록과 상품 리스트 사이에 충분한 숨 쉴 공간을 둔다 (모바일 64 / 태블릿 80 / PC 120px)
        <div className="py-16 md:py-20 lg:py-30">
          <LookbookCollage
            images={chapter.images}
            seed={chapter.seed}
            pinLarge={chapter.pinLarge}
            productNames={productNames}
            frame
            blurReveal={BLUR_REVEAL}
            tilt={TILT}
          />
        </div>
      )}
    />
  );
}
