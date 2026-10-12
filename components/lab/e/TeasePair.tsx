import type { LookbookImage } from '@/lib/types';
import { Label, Pic } from './Pic';

/** TEASE: 라벨과 이미지 두 장을 나란히 (간격 4px). PC에서는 화면 폭의 60%. */
export function TeasePair({ images }: { images: [LookbookImage, LookbookImage] }) {
  return (
    <section aria-label="TEASE" className="mx-auto w-full px-4 md:px-10 lg:w-[60%] lg:px-0">
      <Label>TEASE</Label>
      <div className="mt-4 grid grid-cols-2 gap-1">
        {images.map((im) => (
          <div key={im.src} className="relative aspect-[3/4]">
            <Pic image={im} sizes="(min-width:1024px) 30vw, 50vw" />
          </div>
        ))}
      </div>
    </section>
  );
}
