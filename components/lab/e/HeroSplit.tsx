import type { LookbookChapter, LookbookImage } from '@/lib/types';
import { Pic } from './Pic';

/**
 * 첫 화면: 좌우 2분할, 전체 폭. 왼쪽은 키 타이틀과 서브 라인(흰 바탕), 오른쪽은 화보 한 컷(정사각형).
 * 모바일은 화보가 위, 타이틀이 아래로 쌓인다.
 */
export function HeroSplit({ chapter, image }: { chapter: LookbookChapter; image: LookbookImage }) {
  return (
    <section aria-label={chapter.title} className="grid lg:grid-cols-2">
      <div className="order-2 flex flex-col items-center justify-center px-4 py-12 text-center md:py-16 lg:order-1 lg:py-0">
        <h2 className="font-key text-key-xl uppercase">
          {chapter.title.split(' ').map((w, i) => (
            <span key={i} className="block">
              {w}
            </span>
          ))}
        </h2>
        <p className="mt-4 font-key text-key-sub uppercase">{chapter.subline}</p>
      </div>
      <div className="relative order-1 aspect-[4/5] md:aspect-square lg:order-2">
        <Pic image={image} sizes="(min-width:1024px) 50vw, 100vw" priority />
      </div>
    </section>
  );
}
