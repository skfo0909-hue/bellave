'use client';
import { motion, type HTMLMotionProps } from 'motion/react';

// 메인 룩북 전용 스크립트 타이포. 룩북 밖에서는 쓰지 않는다. (DESIGN_GUIDE.md 3장)

/** 대형 타이틀. 장식이 아니라 섹션 제목(h2)이며, 이미지 위에 겹쳐도 클릭을 가로막지 않는다. */
export function ScriptTitle({ className = '', ...rest }: HTMLMotionProps<'h2'>) {
  return <motion.h2 className={`pointer-events-none select-none whitespace-nowrap font-script text-script-xl ${className}`} {...rest} />;
}

/** 소형 서브 타이틀 (PC 28/36, 모바일 24/32) */
export function ScriptSub({ className = '', ...rest }: HTMLMotionProps<'p'>) {
  return <motion.p className={`font-script text-script-sm max-md:[font-size:24px] max-md:[line-height:32px] ${className}`} {...rest} />;
}
