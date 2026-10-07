'use client';
import { useEffect, useState } from 'react';

/**
 * scroll: PC(1024px 이상). 화면 고정 + 스크롤 연동
 * reveal: 태블릿, 모바일. 뷰포트 진입 시 1회 등장
 * static: prefers-reduced-motion. 연출 없이 최종 상태
 */
export type SceneMode = 'scroll' | 'reveal' | 'static';

export const ENTER_EASE = [0.22, 1, 0.36, 1] as const; // 진입 연출 곡선

export function useSceneMode(): SceneMode {
  const [mode, setMode] = useState<SceneMode>('reveal');
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setMode(reduce.matches ? 'static' : desktop.matches ? 'scroll' : 'reveal');
    update();
    desktop.addEventListener('change', update);
    reduce.addEventListener('change', update);
    return () => {
      desktop.removeEventListener('change', update);
      reduce.removeEventListener('change', update);
    };
  }, []);
  return mode;
}
