'use client';
import { motion, useInView } from 'motion/react';
import { useRef, type ReactNode } from 'react';
import { ENTER_EASE, useMainMotion } from '@/components/home/useMainMotion';
import type { SlotImage } from './images';
import { SlotFill } from './SlotImage';

/** 키 타이틀 크기: 기존 key-xl(clamp(64px, 9.5vw, 152px))의 절반 */
const TITLE_SIZE = 'clamp(32px, 4.75vw, 76px)';

/**
 * 비주얼 룩북: 화면 전체 폭(좌우 여백 없음), 높이 PC 80vh / 모바일 70vh, object-fit: cover.
 * 하단에 아래에서 위로 옅어지는 어두운 그라데이션(최대 35%)을 깔아 흰 글자가 읽히게 한다.
 * 모션: 로드(첫 화보) 또는 화면 진입(그다음) 시 크기 1.06 → 1.0 (1.2초), 타이틀은 0.3초 뒤 투명도 0 → 1.
 * first=true인 화보는 헤더가 위에 투명하게 겹치도록 헤더 높이만큼 위로 끌어올려 화면 맨 위에 붙는다.
 */
export function HeroVisual({
  id,
  image,
  label,
  title,
  align,
  copy,
  first = false,
}: {
  id: string;
  image: SlotImage;
  label: string;
  title: string;
  align: 'center' | 'right';
  copy?: string;
  first?: boolean;
}) {
  const { reduced } = useMainMotion();
  // 서버 렌더의 initial 값이 남지 않도록 모션 줄이기 여부가 바뀌면 다시 마운트한다.
  return <Block key={reduced ? 'reduced' : 'motion'} {...{ id, image, label, title, align, copy, first, reduced }} />;
}

function Block({
  id,
  image,
  label,
  title,
  align,
  copy,
  first,
  reduced,
}: {
  id: string;
  image: SlotImage;
  label: string;
  title: string;
  align: 'center' | 'right';
  copy?: string;
  first: boolean;
  reduced: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const go = first || inView;
  const text: ReactNode = (
    <>
      <h2 className="font-key uppercase text-white" style={{ fontSize: TITLE_SIZE, lineHeight: 1, letterSpacing: '0.01em' }}>
        {title}
      </h2>
      {copy && (
        <p className="mt-3 max-w-[360px] text-left font-key text-key-copy text-white max-md:[font-size:16px] max-md:[line-height:21px]">
          {copy}
        </p>
      )}
    </>
  );

  return (
    <section
      id={id}
      ref={ref}
      aria-label={title}
      className={`relative h-[70vh] w-full overflow-hidden md:h-[80vh] ${first ? '-mt-[56px] lg:-mt-[80px]' : ''}`}
    >
      <motion.div
        className="absolute inset-0"
        {...(reduced
          ? {}
          : { initial: { scale: 1.06 }, animate: go ? { scale: 1 } : undefined, transition: { duration: 1.2, ease: ENTER_EASE } })}
      >
        <SlotFill image={image} label={label} tone="dark" priority={first} sizes="100vw" />
      </motion.div>
      {/* 글자가 읽히도록 하단 그라데이션 (최대 35%) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/35 to-transparent" />
      <motion.div
        className={`absolute bottom-8 md:bottom-12 ${align === 'center' ? 'inset-x-0 flex justify-center text-center' : 'right-4 md:right-10'}`}
        {...(reduced
          ? {}
          : {
              initial: { opacity: 0 },
              animate: go ? { opacity: 1 } : undefined,
              transition: { duration: 0.8, ease: ENTER_EASE, delay: 0.3 },
            })}
      >
        {align === 'center' ? <div>{text}</div> : text}
      </motion.div>
    </section>
  );
}
