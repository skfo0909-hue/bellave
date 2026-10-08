import { LookbookCollage } from '@/components/home/LookbookCollage';
import { LabMain } from '../LabMain';
import { SteelBackground } from './SteelBackground';
import { WhiteProducts } from './WhiteProducts';

/** 시안 C: B와 같은 collage 레이아웃 + 고정 Steel 배경, 상품 리스트부터 흰 배경 */
export function LabC() {
  return (
    <LabMain
      before={<SteelBackground />}
      className=""
      productsWrap={(children) => <WhiteProducts>{children}</WhiteProducts>}
      lookbook={({ chapter, productNames }) => (
        <LookbookCollage images={chapter.images} seed={chapter.seed} pinLarge={chapter.pinLarge} productNames={productNames} />
      )}
    />
  );
}
