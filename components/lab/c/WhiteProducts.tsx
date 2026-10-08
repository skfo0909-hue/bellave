import type { ReactNode } from 'react';

/**
 * 상품 리스트 구간을 흰 배경으로 마무리한다. 좌우 끝까지(풀블리드) 흰색이고, 아래로 푸터까지 이어진다.
 * flow-root: 안쪽 mt가 바깥으로 새어 나가 위쪽에 배경이 비는 것을 막는다.
 * box-shadow + clip-path: 100vw를 쓰지 않아 가로 스크롤이 생기지 않는다.
 */
export function WhiteProducts({ children }: { children: ReactNode }) {
  return (
    <div className="flow-root bg-white pb-30 shadow-[0_0_0_100vmax_#fff] [clip-path:inset(0_-100vmax)]">
      {children}
      {/* 푸터까지 흰색으로 이어 붙인다 (이 시안 페이지에서만 적용) */}
      <style>{`footer{background:#fff;box-shadow:0 0 0 100vmax #fff;clip-path:inset(0 -100vmax)}`}</style>
    </div>
  );
}
