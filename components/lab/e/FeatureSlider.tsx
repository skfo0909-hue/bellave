'use client';
import { useState, type KeyboardEvent } from 'react';
import { Img } from '@/components/ui/Img';
import { ArrowIcon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import type { LookbookImage } from '@/lib/types';

/**
 * ITEM: 가운데 큰 이미지 한 장과 좌우 화살표. 마지막에서 처음으로 이어지고, 키보드 좌우 화살표로도 넘긴다.
 * 아래에 현재 위치(1 / 3)를 보여준다.
 */
export function FeatureSlider({ images, label }: { images: LookbookImage[]; label: string }) {
  const n = images.length;
  const [i, setI] = useState(0);
  const go = (k: number) => setI(((k % n) + n) % n);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(i - 1);
    if (e.key === 'ArrowRight') go(i + 1);
  };
  const cur = images[i];
  return (
    <section aria-roledescription="carousel" aria-label={label} className="mx-auto w-full px-4 md:px-10 lg:w-[60%] lg:px-0">
      <p className="section-title text-center">{label}</p>
      <div tabIndex={0} onKeyDown={onKey} className="relative mt-4 flex items-center justify-center outline-offset-4">
        <IconButton label="이전" onClick={() => go(i - 1)} className="absolute left-0 z-side">
          <ArrowIcon dir="left" size={20} />
        </IconButton>
        <div className="relative aspect-[3/4] w-[min(100%,560px)] max-md:w-[78%]">
          <Img
            src={cur.src}
            alt={cur.alt}
            fill
            sizes="(min-width:1024px) 560px, 78vw"
            className="object-cover"
            style={{ objectPosition: 'center 25%' }}
          />
        </div>
        <IconButton label="다음" onClick={() => go(i + 1)} className="absolute right-0 z-side">
          <ArrowIcon size={20} />
        </IconButton>
      </div>
      <p className="mt-4 text-center text-caption text-gray-600" aria-live="polite">
        {i + 1} / {n}
      </p>
    </section>
  );
}
