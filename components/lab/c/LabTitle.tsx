'use client';
import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { ENTER_EASE, useMainMotion } from '@/components/home/useMainMotion';
import type { LookbookChapter } from '@/lib/types';
import { TITLE_FX } from './titleConfig';
import { titleFont } from './titleFonts';

const FILTER_ID = 'lab-title-wave';

/**
 * /lab/c 전용 키 타이틀. 공용 LookbookTitle과 같은 구성(PC 2단, 모바일 1단)과 등장 연출을 쓰되,
 * 타이틀 글자만 굵기 대비가 큰 세리프로 바꾸고 윤곽을 SVG 필터로 물결치게 하며, 글자색은 전부 흰색이다.
 * 글자는 이미지가 아니라 실제 h2 텍스트라서 선택, 스크린리더 읽기가 유지된다.
 */
export function LabTitle({ chapter }: { chapter: LookbookChapter }) {
  const { reduced } = useMainMotion();
  // 서버 렌더의 initial 값이 남지 않도록 모션 줄이기 여부가 바뀌면 다시 마운트한다.
  return <Block key={reduced ? 'reduced' : 'motion'} chapter={chapter} reduced={reduced} />;
}

function Block({ chapter, reduced }: { chapter: LookbookChapter; reduced: boolean }) {
  const h2 = useRef<HTMLHeadingElement>(null);
  const displace = useRef<SVGFEDisplacementMapElement>(null);
  const ease = ENTER_EASE;
  const { wave } = TITLE_FX;

  // 변형 강도는 글자 크기에 비례(em). 화면 폭에 따라 글자 크기가 바뀌므로 리사이즈마다 px로 환산한다.
  useEffect(() => {
    const apply = () => {
      if (!h2.current || !displace.current) return;
      const fs = parseFloat(getComputedStyle(h2.current).fontSize) || 100;
      displace.current.setAttribute('scale', (wave.strength * fs).toFixed(2));
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, [wave.strength]);

  return (
    <div
      className="mt-8 flex flex-col gap-6 text-white md:mt-12 lg:mt-16 lg:flex-row lg:items-start lg:justify-between"
      style={{ color: TITLE_FX.color }}
    >
      {/* 물결 필터: feTurbulence가 만든 노이즈로 feDisplacementMap이 글자 윤곽을 밀어 일렁이게 한다 (정지). */}
      <svg width="0" height="0" aria-hidden focusable="false" className="pointer-events-none absolute">
        <defs>
          <filter id={FILTER_ID} x="-5%" y="-10%" width="110%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={wave.frequency.join(' ')}
              numOctaves={wave.octaves}
              seed={wave.seed}
              result="noise"
            />
            <feDisplacementMap
              ref={displace}
              in="SourceGraphic"
              in2="noise"
              scale={(wave.strength * 100).toFixed(2)}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="min-w-0">
        {/* 키 타이틀: 두 단어면 두 줄로 쌓는다. */}
        <motion.h2
          ref={h2}
          className="-ml-[0.02em] uppercase"
          style={{
            fontFamily: titleFont.style.fontFamily,
            fontWeight: TITLE_FX.fontWeight,
            fontVariationSettings: `'opsz' ${TITLE_FX.opsz}`,
            fontSize: TITLE_FX.fontSize,
            lineHeight: TITLE_FX.lineHeight,
            letterSpacing: TITLE_FX.letterSpacing,
            filter: wave.strength > 0 ? `url(#${FILTER_ID})` : undefined,
          }}
          {...(reduced
            ? {}
            : {
                initial: { opacity: 0, y: 24, clipPath: 'inset(0% 0% 100% 0%)' },
                animate: { opacity: 1, y: 0, clipPath: 'inset(-20% -10% -20% -10%)' }, // 물결로 윤곽이 밖으로 밀려도 잘리지 않게 여유를 둔다
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
          className="mt-2 font-key text-key-sub uppercase max-md:[font-size:14px] max-md:[line-height:18px]"
          {...(reduced ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4, ease, delay: 0.2 } })}
        >
          {chapter.subline}
        </motion.p>
      </div>

      <div className="w-full font-key lg:max-w-[480px]">
        <div className="overflow-hidden">
          <motion.p
            className="text-key-lead max-md:[font-size:24px] max-md:[line-height:28px]"
            {...(reduced ? {} : { initial: { y: '100%' }, animate: { y: 0 }, transition: { duration: 0.6, ease, delay: 0.3 } })}
          >
            {chapter.copyLead}
          </motion.p>
        </div>
        <motion.p
          className="mt-3 text-key-copy max-md:[font-size:16px] max-md:[line-height:21px] lg:text-justify"
          {...(reduced
            ? {}
            : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease, delay: 0.45 } })}
        >
          {chapter.copy}
        </motion.p>
      </div>
    </div>
  );
}
