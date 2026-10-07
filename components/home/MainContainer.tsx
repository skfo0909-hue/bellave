import type { ReactNode } from 'react';

/**
 * 메인 전용 컨테이너 (DESIGN_GUIDE.md 5장)
 * PC: 폭 = min(1200px, 100% - 2 x max(80px, 10vw)), 가운데 정렬. 태블릿 좌우 40px, 모바일 16px.
 * 타이틀, 룩북 그리드, 상품 리스트의 좌우 끝선이 모두 이 컨테이너 선에 맞는다.
 */
export function MainContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto px-4 md:px-10 lg:w-[min(1200px,calc(100%_-_2*max(80px,10vw)))] lg:px-0">{children}</div>;
}
