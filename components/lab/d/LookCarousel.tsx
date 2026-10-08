'use client';
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { useInView } from 'motion/react';
import { useMainMotion } from '@/components/home/useMainMotion';
import type { SlotImage } from './images';
import { SlotFill } from './SlotImage';

const GAP = 8; // 카드 간격(px)
const BUFFER = 3; // 가운데에서 이 거리(칸)까지만 그린다. 그 밖은 화면 밖이라 숨긴다.
const SWIPE = 40; // 이만큼(px) 이상 끌면 스와이프로 본다

/**
 * 세부 룩 캐러셀. 상품 리스트가 아니라 이미지 카드만 보여준다 (이름, 가격, 링크, 위시리스트 없음).
 * - 카드 3:4. 폭은 PC(1024px 이상) 화면의 24%, 태블릿 36%, 모바일 64%. 양끝 카드는 화면 밖으로 잘려 보인다.
 * - 가운데 카드만 투명도 100%, 나머지 35% (0.4초). 옆 카드를 누르면 0.5초 동안 가운데로 이동. 마지막 → 처음으로 순환.
 * - 키보드 좌우 화살표, 포인터 스와이프. 자동 재생 없음. 아래에 현재 위치 점. 모션 줄이기에서는 즉시 전환.
 * - 화면에 들어올 때 카드들이 투명도 0 → 지정 값 (0.6초).
 */
export function LookCarousel({ images, label }: { images: SlotImage[]; label: string }) {
  const n = images.length;
  const { reduced } = useMainMotion();
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: true, amount: 0.3 });
  const [revealing, setRevealing] = useState(true);
  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => setRevealing(false), 700);
    return () => window.clearTimeout(t);
  }, [inView]);

  const go = (i: number) => setActive(((i % n) + n) % n);
  const prev = useRef<number[]>([]); // 카드별 직전 위치. 순환하며 반대편으로 건너뛸 때는 날아가지 않고 즉시 옮긴다.
  const offsets = images.map((_, i) => {
    let d = (((i - active) % n) + n) % n;
    if (d > n / 2) d -= n; // -n/2 .. n/2 의 가장 가까운 거리
    return d;
  });
  const instant = offsets.map((o, i) => reduced || Math.abs(o - (prev.current[i] ?? o)) > 1);
  useEffect(() => {
    prev.current = offsets;
  });

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(active - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(active + 1);
    }
  };

  const start = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const onDown = (e: PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
    swiped.current = false;
  };
  const onUp = (e: PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) >= SWIPE && Math.abs(dx) > Math.abs(e.clientY - s.y)) {
      swiped.current = true;
      go(active + (dx < 0 ? 1 : -1)); // 왼쪽으로 끌면 다음
    }
  };

  return (
    <section aria-roledescription="carousel" aria-label={label} className="py-20">
      <div
        ref={root}
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (start.current = null)}
        className="relative mx-auto h-[calc(var(--w)*4/3)] w-full touch-pan-y select-none overflow-hidden outline-offset-4 [--w:64vw] md:[--w:36vw] lg:[--w:24vw]"
      >
        {images.map((img, i) => {
          const o = offsets[i];
          const far = Math.abs(o) > BUFFER;
          const centered = o === 0;
          const opacity = !inView || far ? 0 : centered ? 1 : 0.35;
          const move = instant[i] ? 'transform 0s' : 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
          const fade = `opacity ${reduced ? 0 : revealing ? 0.6 : 0.4}s ease`;
          return (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${n}`}
              aria-hidden={far || undefined}
              onClick={() => {
                if (swiped.current) return (swiped.current = false);
                if (!centered) go(i);
              }}
              className={`absolute top-0 aspect-[3/4] w-[var(--w)] ${centered ? '' : 'cursor-pointer'}`}
              style={{
                left: 'calc(50% - var(--w) / 2)',
                transform: `translateX(calc((var(--w) + ${GAP}px) * ${o}))`,
                transition: `${move}, ${fade}`,
                opacity,
                visibility: far ? 'hidden' : 'visible',
                pointerEvents: far ? 'none' : 'auto',
              }}
            >
              <SlotFill image={img} tone="dark" label={`${label} · ${i + 1}/${n}`} sizes="(min-width:1024px) 24vw, 64vw" />
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex justify-center">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i + 1}번째 룩 보기`}
            aria-current={i === active}
            onClick={() => go(i)}
            className="flex h-[24px] w-[24px] items-center justify-center"
          >
            <span className={`block h-[6px] w-[6px] rounded-none ${i === active ? 'bg-black' : 'bg-gray-400'}`} />
          </button>
        ))}
      </div>
    </section>
  );
}
