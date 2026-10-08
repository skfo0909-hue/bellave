import { LookbookCollage } from '@/components/home/LookbookCollage';
import { LabMain } from '../LabMain';

/** 시안 B: collage 레이아웃 */
export function LabB() {
  return (
    <LabMain
      lookbook={({ chapter, productNames }) => (
        <LookbookCollage images={chapter.images} seed={chapter.seed} pinLarge={chapter.pinLarge} productNames={productNames} />
      )}
    />
  );
}
