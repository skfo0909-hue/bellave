import type { LookbookImage } from '@/lib/types';
import { Label, Pic } from './Pic';

/** SCENE: 가로로 넓은 화보 한 장 (16:9로 잘라 보여준다). */
export function WideVisual({ image, caption }: { image: LookbookImage; caption: string }) {
  return (
    <section aria-label="SCENE" className="mx-auto w-full px-4 md:px-10 lg:w-[80%] lg:px-0">
      <Label>SCENE</Label>
      <div className="relative mt-4 aspect-[16/9]">
        <Pic image={image} sizes="(min-width:1024px) 80vw, 100vw" position="center 30%" />
      </div>
      <p className="mt-3 text-center text-caption text-gray-600">{caption}</p>
    </section>
  );
}
