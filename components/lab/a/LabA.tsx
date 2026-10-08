import { LookbookGrid } from '@/components/home/LookbookGrid';
import { LabMain } from '../LabMain';

/** 시안 A: grid 레이아웃 */
export function LabA() {
  return <LabMain lookbook={({ chapter, productNames }) => <LookbookGrid images={chapter.images} productNames={productNames} />} />;
}
