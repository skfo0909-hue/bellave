'use client';
import Link from 'next/link';
import { animate, motion, useMotionValue, useScroll, useTransform, type HTMLMotionProps, type MotionValue } from 'motion/react';
import { useEffect, useRef } from 'react';
import type { LookbookChapter } from '@/lib/types';
import { SceneMedia } from './SceneMedia';
import { ScriptSub, ScriptTitle } from './ScriptTitle';
import { ENTER_EASE, useSceneMode, type SceneMode } from './useSceneMode';

type Div = HTMLMotionProps<'div'>;
type Para = HTMLMotionProps<'p'>;

const SCENE_H = 'md:h-[calc(100vh-56px)] lg:h-[calc(100vh-80px)]'; // 뷰포트 높이에서 헤더 제외
const WRAPPER = 'lg:h-[200vh] motion-reduce:lg:h-auto'; // PC: 스크롤 100vh 동안 씬이 고정된다
const STICKY = 'relative lg:sticky lg:top-[80px]';

/** 모드별 모션 속성: scroll은 스크롤 연동 style, reveal은 진입 시 1회, static은 연출 없음 */
function pick(mode: SceneMode, scroll: Div['style'], from?: Div['initial'], to?: Div['whileInView'], delay = 0): Div {
  if (mode === 'scroll') return { style: scroll };
  if (mode === 'reveal' && from) {
    return { initial: from, whileInView: to, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.8, ease: ENTER_EASE, delay } };
  }
  return {};
}
const pickP = (mode: SceneMode, scroll: Para['style']): Para => (mode === 'scroll' ? { style: scroll } : {});

/** 구간 [a, b]에서 from → to로 선형 변화 (구간 밖은 끝값 유지) */
function useRange<T extends number | string>(p: MotionValue<number>, a: number, b: number, from: T, to: T) {
  return useTransform(p, [a, b], [from, to]);
}

export function LookbookScene({ chapter, priority = false }: { chapter: LookbookChapter; priority?: boolean }) {
  const mode = useSceneMode();
  // 서버/첫 렌더는 reveal 모드다. 모드가 바뀌면 key로 다시 마운트해, reveal의 initial 값이 남지 않게 한다.
  return chapter.layout === 'split' ? <Split key={mode} chapter={chapter} mode={mode} priority={priority} /> : <Duo key={mode} chapter={chapter} mode={mode} />;
}

/* ---------- split (룩북 01) ---------- */
function Split({ chapter, mode, priority }: { chapter: LookbookChapter; mode: SceneMode; priority: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: scroll } = useScroll({ target: ref, offset: ['start 80px', 'end end'] });
  const image = chapter.images[0];

  // 첫 화면이 비어 보이지 않도록, 첫 룩북은 로드 시 진행도 0 → 0.8(타이틀, 라벨, 설명까지 등장 완료)을 시간으로 재생한다.
  // 이후 스크롤이 나머지 0.8 → 1을 이어받는다. 구간 표의 수치는 그대로다.
  const intro = useMotionValue(0);
  useEffect(() => {
    if (mode !== 'scroll' || !priority) return;
    const controls = animate(intro, 0.8, { duration: 1.4, ease: ENTER_EASE });
    return () => controls.stop();
  }, [mode, priority, intro]);
  const p = useTransform([scroll, intro], ([s, i]: number[]) => i + s * (1 - i));

  // DESIGN_GUIDE.md 10장 표: 룩북 01
  const clipPath = useRange(p, 0, 0.5, 'inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)');
  const zoom = useRange(p, 0, 1, 1.15, 1);
  const titleX = useRange(p, 0.2, 0.8, '30%', '0%');
  const titleO = useRange(p, 0.2, 0.4, 0, 1);
  const labelO = useRange(p, 0.5, 0.7, 0, 1);
  const labelY = useRange(p, 0.5, 0.7, 16, 0);
  const descO = useRange(p, 0.6, 0.8, 0, 1);
  const descY = useRange(p, 0.6, 0.8, 16, 0);

  return (
    <div ref={ref} className={WRAPPER}>
      <div className={`${STICKY} ${SCENE_H}`}>
        <div className="page-x relative mx-auto h-full max-w-page md:grid md:grid-cols-[3fr_2fr]">
          {/* 이미지 틀: 아래에서 위로 열리는 마스크 */}
          <motion.div {...(mode === 'scroll' ? { style: { clipPath } } : {})} className="relative aspect-[4/5] overflow-hidden md:aspect-auto md:h-full">
            <Link href={`/product/${image.productIds[0]}`} className="absolute inset-0 block">
              <motion.div
                {...pick(mode, { scale: zoom }, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1 })}
                className="relative h-full w-full"
              >
                <SceneMedia image={image} sizes="(min-width:768px) 60vw, 100vw" priority={priority} />
              </motion.div>
            </Link>
          </motion.div>

          {/* 흰 여백: 라벨(상단), 서브 타이틀과 설명(세로 가운데) */}
          <div className="relative flex flex-col items-center pt-12 md:h-full md:justify-center md:pt-0">
            <motion.p {...pickP(mode, { opacity: labelO, y: labelY })} className="text-label uppercase md:absolute md:inset-x-0 md:top-8 md:text-center">
              {chapter.label}
            </motion.p>
            <div className="mt-4 flex max-w-[280px] flex-col gap-4 text-center md:mt-0">
              <ScriptSub {...pickP(mode, { opacity: labelO, y: labelY })}>{chapter.subtitle}</ScriptSub>
              <motion.p {...pickP(mode, { opacity: descO, y: descY })} className="hidden text-caption md:block">
                {chapter.description}
              </motion.p>
              <p className="text-body md:sr-only">{chapter.descriptionKo}</p>
            </div>
          </div>

          {/* 대형 타이틀: 오른쪽 아래, 왼쪽 끝이 이미지 위로 겹친다. 모바일은 이미지 하단에 절반 걸친다. */}
          <div className="pointer-events-none absolute right-4 top-[calc((100vw-32px)*1.25)] z-side -translate-y-1/2 md:bottom-8 md:right-6 md:top-auto md:translate-y-0 lg:right-10">
            <ScriptTitle {...pick(mode, { x: titleX, opacity: titleO }, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, 0.2)}>{chapter.title}</ScriptTitle>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- duo (룩북 02) ---------- */
function Duo({ chapter, mode }: { chapter: LookbookChapter; mode: SceneMode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start 80px', 'end end'] });

  // DESIGN_GUIDE.md 10장 표: 룩북 02
  // 이미지는 틀보다 16% 크므로 위아래 여유는 틀 높이의 8%. y는 요소 자신의 높이 기준이라 8/116 = 6.9%로 환산한다.
  const yLeft = useRange(p, 0, 1, '6.9%', '-6.9%');
  const yRight = useRange(p, 0, 1, '-6.9%', '6.9%');
  const lineScale = useRange(p, 0, 0.4, 0, 1);
  const titleScale = useRange(p, 0.15, 0.6, 1.2, 1);
  const titleO = useRange(p, 0.15, 0.6, 0, 1);
  const titleBlur = useRange(p, 0.15, 0.6, 'blur(8px)', 'blur(0px)');
  const cardY = useRange(p, 0.5, 0.8, 40, 0);
  const cardO = useRange(p, 0.5, 0.8, 0, 1);

  const card = (
    <motion.aside
      {...(mode === 'scroll' ? { style: { y: cardY, opacity: cardO } } : {})}
      className="w-[280px] max-w-full border border-black bg-white p-6 text-center"
    >
      <p className="text-label uppercase">{chapter.label}</p>
      <ScriptSub className="mt-2">{chapter.subtitle}</ScriptSub>
      <p className="mt-2 hidden text-caption md:block">{chapter.description}</p>
      <p className="mt-2 text-body md:sr-only">{chapter.descriptionKo}</p>
    </motion.aside>
  );

  return (
    <div ref={ref} className={WRAPPER}>
      <div className={`${STICKY} ${SCENE_H}`}>
        <div className="relative flex h-full flex-col md:flex-row">
          {chapter.images.map((image, i) => (
            <div key={image.src} className="relative aspect-[4/5] overflow-hidden md:aspect-auto md:h-full md:w-1/2">
              <Link href={`/product/${image.productIds[0]}`} className="absolute inset-0 block">
                <motion.div
                  {...pick(mode, { y: i === 0 ? yLeft : yRight }, { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1 })}
                  className="absolute inset-x-0 top-0 h-full md:-top-[8%] md:h-[116%]"
                >
                  <SceneMedia image={image} sizes="(min-width:768px) 50vw, 100vw" priority={i === 0} />
                </motion.div>
              </Link>
            </div>
          ))}

          {/* 가운데 세로 라인 (PC 두 장이 나란할 때) */}
          <motion.span
            aria-hidden="true"
            {...(mode === 'scroll' ? { style: { scaleY: lineScale } } : {})}
            className="pointer-events-none absolute inset-y-0 left-1/2 z-side hidden w-px origin-top bg-black md:block"
          />

          {/* 타이틀은 두 이미지의 경계 위에 가운데 정렬. PC는 바로 아래에 카드를 겹친다. */}
          <div className="pointer-events-none absolute inset-0 z-side flex flex-col items-center justify-center">
            <ScriptTitle
              {...pick(mode, { scale: titleScale, opacity: titleO, filter: titleBlur }, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, 0.2)}
              className="text-center"
            >
              {chapter.title}
            </ScriptTitle>
            <div className="-mt-6 hidden md:block">{card}</div>
          </div>
        </div>

        {/* 모바일: 카드는 두 번째 이미지 아래 일반 흐름 */}
        <div className="page-x mt-6 flex justify-center md:hidden">{card}</div>
      </div>
    </div>
  );
}
