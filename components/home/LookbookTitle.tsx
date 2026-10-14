'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import type { LookbookChapter } from '@/lib/types';
import { ENTER_EASE, useMainMotion } from './useMainMotion';

/** 타이틀 질감 필터 id. 글자 윤곽이 거칠게 번지고 잉크가 긁힌 듯한 입자가 생긴다 (정지). */
const GRAIN_FILTER = 'main-title-grain';

/**
 * 키 타이틀 블록. PC는 2단(왼쪽 타이틀과 서브 라인, 오른쪽 키 카피, 세로 가운데 정렬), 태블릿과 모바일은 1단.
 * 타이틀은 넓고 굵은 소문자 산세리프를 줄 간격 0.78로 겹쳐 쌓고, SVG 필터로 입자 질감을 주며, `mix-blend-mode: color-burn`으로 배경 그라디언트에 스며들게 한다.
 * 첫 챕터는 로드 직후, 이후 챕터는 뷰포트에 20%가 보일 때 한 번 재생한다.
 */
export function LookbookTitle({ chapter, first = false }: { chapter: LookbookChapter; first?: boolean }) {
  const { reduced } = useMainMotion();
  // 서버 렌더의 initial 값이 남지 않도록 모션 줄이기 여부가 바뀌면 다시 마운트한다.
  return <Block key={reduced ? 'reduced' : 'motion'} chapter={chapter} first={first} reduced={reduced} />;
}

function Block({ chapter, first, reduced }: { chapter: LookbookChapter; first: boolean; reduced: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  // 가려진 요소는 화면 진입 감지가 안 되므로 가려지지 않는 바깥 래퍼를 감지한다. 첫 챕터는 로드 직후 재생한다.
  const inView = useInView(wrap, { once: true, amount: 0.2 });
  const go = first || inView;
  const ease = ENTER_EASE;

  return (
    <div ref={wrap} className="mt-8 flex flex-col gap-6 md:mt-12 lg:mt-16 lg:flex-row lg:items-center lg:justify-between">
      <svg width="0" height="0" aria-hidden focusable="false" className="pointer-events-none absolute">
        <defs>
          <filter id={GRAIN_FILTER} x="-6%" y="-12%" width="112%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="2" result="warp" />
            <feDisplacementMap in="SourceGraphic" in2="warp" scale="7" xChannelSelector="R" yChannelSelector="G" result="rough" />
            <feGaussianBlur in="rough" stdDeviation="1.4" result="soft" />
            <feGaussianBlur in="rough" stdDeviation="7" result="halo" />
            <feComponentTransfer in="halo" result="haloLight">
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" result="grain" />
            <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  12 0 0 0 -8.2" result="specks" />
            <feComposite in="soft" in2="specks" operator="out" result="inked" />
            <feMerge>
              <feMergeNode in="haloLight" />
              <feMergeNode in="inked" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="min-w-0">
        {/* 키 타이틀: 두 단어면 두 줄로 쌓는다(겹침). 왼쪽 끝을 컨테이너 선에 맞추기 위해 글리프 왼쪽 여백만큼 당긴다. */}
        <motion.h2
          className="-ml-[0.04em] font-key text-key-xl lowercase mix-blend-color-burn"
          style={{ fontStretch: '125%', fontWeight: 900, filter: `url(#${GRAIN_FILTER})` }}
          {...(reduced
            ? {}
            : {
                initial: { opacity: 0, y: 24, clipPath: 'inset(0% 0% 100% 0%)' },
                animate: go ? { opacity: 1, y: 0, clipPath: 'inset(-20% -10% -20% -10%)' } : undefined, // 입자와 번짐이 밖으로 퍼져도 잘리지 않게 여유를 둔다
                transition: { duration: 0.9, ease },
              })}
        >
          {chapter.title.split(' ').map((word, i) => (
            <span key={i} className="block">
              {word}
            </span>
          ))}
        </motion.h2>
        <motion.p
          className="mt-3 pl-5 font-key text-key-sub uppercase max-md:[font-size:16px] max-md:[line-height:20px]"
          style={{ fontStretch: '125%', fontWeight: 900 }}
          {...(reduced
            ? {}
            : {
                initial: { opacity: 0 },
                animate: go ? { opacity: 1 } : undefined,
                transition: { duration: 0.4, ease, delay: 0.2 },
              })}
        >
          {chapter.subline}
        </motion.p>
      </div>

      {/* 키 카피: 첫 문장(굵게, 한 줄, 왼쪽 정렬)과 본문(얇게, PC 양쪽 정렬, 모바일 왼쪽 정렬). 폭 최대 374px, PC에서는 컨테이너 오른쪽 끝에서 16px 안쪽. */}
      <div className="w-full lg:mr-4 lg:w-[374px] lg:shrink-0">
        <div className="overflow-hidden">
          <motion.p
            className="text-key-lead font-bold max-md:[font-size:24px] max-md:[line-height:28px]"
            {...(reduced
              ? {}
              : {
                  initial: { y: '100%' },
                  animate: go ? { y: 0 } : undefined,
                  transition: { duration: 0.6, ease, delay: 0.3 }, // 타이틀 시작 0.3초 뒤
                })}
          >
            {chapter.copyLead}
          </motion.p>
        </div>
        <motion.p
          className="mt-3 text-key-copy font-light max-md:[font-size:16px] max-md:[line-height:21px] lg:text-justify"
          {...(reduced
            ? {}
            : {
                initial: { opacity: 0, y: 12 },
                animate: go ? { opacity: 1, y: 0 } : undefined,
                transition: { duration: 0.6, ease, delay: 0.45 }, // 첫 문장 0.15초 뒤
              })}
        >
          {chapter.copy}
        </motion.p>
      </div>
    </div>
  );
}
