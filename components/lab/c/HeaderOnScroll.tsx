'use client';
import { useEffect } from 'react';

/**
 * /lab/c 전용: 헤더 배경을 맨 위에서는 없애고, 스크롤했을 때만 흰색 반투명 + 블러로 보여준다.
 * 공용 Header는 수정하지 않는다. 이 페이지가 열려 있는 동안만 아래 스타일이 header에 덮어씌워지고, 다른 페이지로 이동하면 사라진다.
 */
const THRESHOLD = 8; // 이만큼(px) 이상 스크롤하면 배경이 나타난다

export function HeaderOnScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const update = () =>
      window.scrollY > THRESHOLD ? root.setAttribute('data-lab-scrolled', '') : root.removeAttribute('data-lab-scrolled');
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      root.removeAttribute('data-lab-scrolled');
    };
  }, []);

  return (
    <style>{`
      header { background-color: transparent !important; -webkit-backdrop-filter: none !important; backdrop-filter: none !important; transition: background-color 0.25s ease; }
      html[data-lab-scrolled] header { background-color: rgb(255 255 255 / 0.8) !important; -webkit-backdrop-filter: blur(12px) !important; backdrop-filter: blur(12px) !important; }
    `}</style>
  );
}
