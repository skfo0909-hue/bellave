'use client';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import type { LookbookChapter } from '@/lib/types';
import { MaskLines } from './MaskLines';
import { ENTER_EASE, useMainMotion } from './useMainMotion';

/**
 * 키 타이틀 블록. PC는 2단(왼쪽 타이틀과 서브 라인, 오른쪽 키 카피), 태블릿과 모바일은 1단.
 * 첫 챕터는 로드 직후, 이후 챕터는 뷰포트에 20%가 보일 때 한 번 재생한다.
 */
export function LookbookTitle({ chapter, first = false }: { chapter: LookbookChapter; first?: boolean }) {
  const { reduced, mobile } = useMainMotion();
  // 서버 렌더의 initial 값이 남지 않도록 모션 줄이기 여부가 바뀌면 다시 마운트한다.
  return <Block key={reduced ? 'reduced' : 'motion'} chapter={chapter} first={first} reduced={reduced} mobile={mobile} />;
}

function Block({ chapter, first, reduced, mobile }: { chapter: LookbookChapter; first: boolean; reduced: boolean; mobile: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  // 마스크로 가려진 요소는 감지가 안 되므로 바깥 래퍼를 감지한다. 첫 챕터는 로드 직후 재생한다.
  const inView = useInView(wrap, { once: true, amount: 0.2 });
  const go = first || inView;

  const copy = mobile ? chapter.copyKo : chapter.copy;
  return (
    <div ref={wrap} className="mt-8 flex flex-col gap-6 md:mt-12 lg:mt-16 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        {/* 키 타이틀: 왼쪽 끝을 컨테이너 선에 맞추기 위해 글리프 왼쪽 여백만큼 당긴다 */}
        <motion.h2
          className="-ml-[0.035em] font-key text-key-xl uppercase"
          {...(reduced
            ? {}
            : {
                initial: {
                  opacity: 0,
                  y: 24,
                  clipPath: 'inset(0% 0% 100% 0%)',
                },
                animate: go ? { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' } : undefined,
                transition: { duration: 0.9, ease: ENTER_EASE },
              })}
        >
          {chapter.title}
        </motion.h2>
        <motion.p
          className="mt-2 font-key text-key-sub uppercase max-md:[font-size:14px] max-md:[line-height:18px]"
          {...(reduced
            ? {}
            : {
                initial: { opacity: 0 },
                animate: go ? { opacity: 1 } : undefined,
                transition: { duration: 0.4, ease: ENTER_EASE, delay: 0.2 },
              })}
        >
          {chapter.subline}
        </motion.p>
      </div>
      <MaskLines
        key={copy}
        text={copy}
        reduced={reduced}
        onLoad={first}
        delay={0.3}
        wrapperClassName="w-full lg:max-w-[520px]"
        className={`text-key-copy ${mobile ? 'font-bold max-md:[font-size:15px] max-md:[line-height:24px]' : 'font-key'}`}
      />
    </div>
  );
}
