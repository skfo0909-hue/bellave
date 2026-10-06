'use client';
import { Img as Image } from '@/components/ui/Img';
import { useCallback, useRef, useState } from 'react';
import { ArrowIcon } from '@/components/ui/Icon';

// 좌우 슬라이드. 화살표, 현재 위치 표시, 모바일 스와이프(scroll-snap). 자동 재생 없음.
export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const onScroll = useCallback(() => {
    const el = track.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }, []);
  const go = (dir: -1 | 1) => {
    const el = track.current;
    if (!el) return;
    const next = Math.min(images.length - 1, Math.max(0, index + dir));
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
  };

  const arrow = 'absolute top-1/2 flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center bg-white/0 text-black disabled:text-gray-400';
  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={`${name} 이미지`}>
      <div
        ref={track}
        onScroll={onScroll}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') go(-1);
          if (e.key === 'ArrowRight') go(1);
        }}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
      >
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="relative aspect-[3/4] w-full shrink-0 snap-center bg-gray-100">
            <Image src={src} alt={`${name} ${i + 1}`} fill sizes="(min-width:768px) 60vw, 100vw" priority={i === 0} className="object-cover" />
          </div>
        ))}
      </div>
      <button type="button" aria-label="이전 이미지" disabled={index === 0} onClick={() => go(-1)} className={`${arrow} left-0 max-md:hidden`}>
        <ArrowIcon dir="left" />
      </button>
      <button type="button" aria-label="다음 이미지" disabled={index === images.length - 1} onClick={() => go(1)} className={`${arrow} right-0 max-md:hidden`}>
        <ArrowIcon />
      </button>
      <p className="absolute bottom-3 left-3 text-micro" aria-live="polite">
        {index + 1} / {images.length}
      </p>
    </div>
  );
}
