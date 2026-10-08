/**
 * 시안 D 이미지 자리. src가 null이면 회색 자리(placeholder)로 보인다.
 * 이미지를 올린 뒤 public/images/lab-d/ 에 두고 src에 '/images/lab-d/파일명'을 적으면 그 자리에 들어간다.
 *  - hero01, hero02: 가로형 (화면 전체 폭 × 80vh, object-fit: cover)
 *  - looks01 (8장), looks02 (10장): 세로형 3:4
 * 세부 룩 순서는 lookbook.json의 seed로 섞인다 (같은 seed면 같은 순서).
 */
export interface SlotImage {
  src: string | null;
  alt: string;
}

const slots = (prefix: string, n: number): SlotImage[] => Array.from({ length: n }, (_, i) => ({ src: null, alt: `${prefix} ${i + 1}` }));

export const D_IMAGES = {
  hero01: { src: null, alt: 'COAT WEATHER 비주얼 룩북' } as SlotImage,
  hero02: { src: null, alt: 'LAYER UP 비주얼 룩북' } as SlotImage,
  looks01: slots('세부 룩 01 —', 8),
  looks02: slots('세부 룩 02 —', 10),
};

/** 비주얼 룩북 02 문구 */
export const HERO02 = { title: 'LAYER UP', copy: 'Too cold for one. Too warm for two.' };
