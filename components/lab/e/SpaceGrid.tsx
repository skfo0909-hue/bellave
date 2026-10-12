import type { LookbookImage } from '@/lib/types';
import { Label, Pic } from './Pic';

/** SPACE: 라벨, 짧은 문구, 그리고 2×2 이미지(간격 4px). PC에서는 화면 폭의 60%. */
export function SpaceGrid({ images, lead, copy }: { images: LookbookImage[]; lead: string; copy: string }) {
  return (
    <section aria-label="SPACE" className="mx-auto w-full px-4 md:px-10 lg:w-[60%] lg:px-0">
      <Label>SPACE</Label>
      <div className="mx-auto mt-4 max-w-[480px] text-center">
        <p className="text-title">{lead}</p>
        <p className="mt-3 text-caption text-gray-600">{copy}</p>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-1">
        {images.map((im) => (
          <div key={im.src} className="relative aspect-[3/4]">
            <Pic image={im} sizes="(min-width:1024px) 30vw, 50vw" />
          </div>
        ))}
      </div>
    </section>
  );
}
