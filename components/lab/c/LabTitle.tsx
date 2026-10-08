'use client';
import { motion } from 'motion/react';
import { ENTER_EASE, useMainMotion } from '@/components/home/useMainMotion';
import type { LookbookChapter } from '@/lib/types';
import BoilTitle from './BoilTitle';
import { TITLE_BOIL, TITLE_COLORS, TITLE_NOISE } from './titleConfig';
import { titleFont } from './titleFonts';

/**
 * /lab/c 전용 상단 타이틀 블록. 공용 LookbookTitle과 같은 구성(PC 2단, 모바일 1단)과 등장 연출을 쓰되,
 * 키 타이틀은 BoilTitle(손으로 그린 듯 떨리는 이중 윤곽선), 배경과 글자색은 titleConfig의 TITLE_COLORS를 따른다.
 * 키 타이틀은 BoilTitle이 h2로 마크업하고 aria-label로 텍스트를 읽어 준다.
 */
export function LabTitle({ chapter }: { chapter: LookbookChapter }) {
  const { reduced } = useMainMotion();
  // 서버 렌더의 initial 값이 남지 않도록 모션 줄이기 여부가 바뀌면 다시 마운트한다.
  return <Block key={reduced ? 'reduced' : 'motion'} chapter={chapter} reduced={reduced} />;
}

function Block({ chapter, reduced }: { chapter: LookbookChapter; reduced: boolean }) {
  const ease = ENTER_EASE;
  return (
    <div className="relative">
      <Plate />
      {/* 글자의 좌우 위치는 이전과 같다(컨테이너 안쪽). 위 여백은 margin 대신 padding으로 두어 배경이 헤더 바로 아래부터 시작한다. */}
      <div
        className="relative flex flex-col gap-6 pb-8 pt-8 md:pb-12 md:pt-12 lg:flex-row lg:items-start lg:justify-between lg:pb-16 lg:pt-16"
        style={{ color: TITLE_COLORS.text }}
      >
        <div className="min-w-0 lg:w-[560px] lg:shrink-0">
          <div style={{ width: TITLE_BOIL.width, marginLeft: `-${TITLE_BOIL.pullLeft}%` }}>
            <BoilTitle
              lines={chapter.title.split(' ')}
              color={TITLE_COLORS.text}
              fontFamily={titleFont.style.fontFamily}
              fontWeight={TITLE_BOIL.fontWeight}
              fps={TITLE_BOIL.fps}
              outer={TITLE_BOIL.outer}
              inner={TITLE_BOIL.inner}
              boil={TITLE_BOIL.boil}
              lineGap={TITLE_BOIL.lineGap}
              indent={[...TITLE_BOIL.indent]}
              wanderingFill={TITLE_BOIL.wanderingFill}
            />
          </div>
          <motion.p
            className="-mt-2 font-key text-key-sub uppercase max-md:[font-size:14px] max-md:[line-height:18px]"
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
    </div>
  );
}

/** 화면 전체 폭 배경(풀블리드). LabC 바깥 래퍼의 overflow-x-clip이 가로 스크롤을 막는다. */
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='${TITLE_NOISE.tile}' height='${TITLE_NOISE.tile}'><filter id='n' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='${TITLE_NOISE.frequency}' numOctaves='2' seed='${TITLE_NOISE.seed}' stitchTiles='stitch'/><feColorMatrix type='matrix' values='${TITLE_NOISE.contrast} 0 0 0 ${TITLE_NOISE.offset}  ${TITLE_NOISE.contrast} 0 0 0 ${TITLE_NOISE.offset}  ${TITLE_NOISE.contrast} 0 0 0 ${TITLE_NOISE.offset}  0 0 0 0 ${TITLE_NOISE.opacity}'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
)}")`;

function Plate() {
  return (
    <div
      aria-hidden
      className="absolute inset-y-0 left-1/2 w-[calc(100vw+2px)] -translate-x-1/2"
      style={{
        backgroundColor: TITLE_COLORS.background,
        backgroundImage: GRAIN,
        backgroundSize: `${TITLE_NOISE.tile}px ${TITLE_NOISE.tile}px`,
      }}
    />
  );
}
