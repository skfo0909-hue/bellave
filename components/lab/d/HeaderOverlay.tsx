'use client';
import { useEffect } from 'react';

/**
 * /lab/d 전용: 헤더를 첫 화보 위에 투명하게 겹치고, 스크롤해서 화보를 벗어나면 기존 흰 배경 헤더(반투명 흰색 + 블러)로 바꾼다.
 * 공용 Header는 수정하지 않는다. 이 페이지가 열려 있는 동안만 아래 스타일이 header에 덮어씌워지고, 다른 페이지로 이동하면 사라진다.
 */
export function HeaderOverlay({ heroId }: { heroId: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const hero = document.getElementById(heroId);
      const header = document.querySelector('header');
      if (!hero || !header) return;
      // 화보 아래끝이 헤더 아래끝보다 위로 올라가면(화보를 벗어나면) 흰 배경 헤더
      const out = hero.getBoundingClientRect().bottom <= header.getBoundingClientRect().bottom;
      if (out) root.setAttribute('data-lab-d-solid', '');
      else root.removeAttribute('data-lab-d-solid');
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      root.removeAttribute('data-lab-d-solid');
    };
  }, [heroId]);

  return (
    <style>{`
      html:not([data-lab-d-solid]) header { background-color: transparent !important; -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }
      header { transition: background-color 0.25s ease; }
    `}</style>
  );
}
