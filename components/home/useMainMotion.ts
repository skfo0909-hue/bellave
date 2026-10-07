'use client';
import { useEffect, useState } from 'react';

export const ENTER_EASE = [0.22, 1, 0.36, 1] as const; // 진입 연출 곡선

interface MainMotion {
  reduced: boolean; // prefers-reduced-motion: 모든 연출을 끈다
  desktop: boolean; // 1024px 이상: 패럴랙스와 호버 연출
  mobile: boolean; // 767px 이하: 국문 키 카피
}

/** 서버 렌더와 첫 클라이언트 렌더를 맞추기 위해 기본값으로 시작하고, 마운트 후 실제 환경을 반영한다. */
export function useMainMotion(): MainMotion {
  const [state, setState] = useState<MainMotion>({ reduced: false, desktop: false, mobile: false });
  useEffect(() => {
    const queries = {
      reduced: window.matchMedia('(prefers-reduced-motion: reduce)'),
      desktop: window.matchMedia('(min-width: 1024px)'),
      mobile: window.matchMedia('(max-width: 767px)'),
    };
    const update = () => setState({ reduced: queries.reduced.matches, desktop: queries.desktop.matches, mobile: queries.mobile.matches });
    update();
    Object.values(queries).forEach((q) => q.addEventListener('change', update));
    return () => Object.values(queries).forEach((q) => q.removeEventListener('change', update));
  }, []);
  return state;
}
