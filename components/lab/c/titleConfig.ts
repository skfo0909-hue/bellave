/**
 * /lab/c 상단 타이틀 영역 조절 값. 값을 바꾸면 곧바로 반영된다.
 */

/** 타이틀 영역 색. 두 색은 여기서만 바꾼다. */
export const TITLE_COLORS = {
  background: '#4A0C00', // 타이틀 블록 배경 (화면 전체 폭)
  text: '#767DFC', // 키 타이틀, 서브 라인, 카피 첫 문장, 카피 본문
} as const;

/** 배경 질감: 종이 같은 아주 약한 노이즈 (feTurbulence). 0.06 이하로 유지한다. */
export const TITLE_NOISE = {
  opacity: 0.05,
  frequency: 0.8, // 클수록 결이 고와진다
  tile: 240, // 무늬 한 장의 크기(px). 타일이 반복된다
  seed: 3,
  // 노이즈의 대비와 밝기. 평균이 배경색과 같아지도록 어두운 쪽에 맞췄다 (밝은 노이즈를 얹으면 배경이 원래 색보다 밝아진다).
  contrast: 3,
  offset: -1.84,
} as const;

/** 키 타이틀(BoilTitle) 설정 */
export const TITLE_BOIL = {
  fontWeight: 900,
  fps: 8, // 초당 떨림 횟수. 낮을수록 손그림 느낌 (권장 6~10)
  outer: 26, // 윤곽선 바깥 굵기 (글자 크기 200 기준)
  inner: 12, // 윤곽선 가운데를 파내는 굵기. outer보다 작아야 두 줄이 보인다
  boil: 9, // 떨림 강도
  lineGap: 1.0, // 줄 간격 배수. 1보다 작으면 두 줄이 겹친다 (BoilTitle 기본 0.62는 Anton 기준이라 세리프에서는 글자가 서로 가린다)
  indent: [90, 0] as number[], // 줄마다 가로로 미는 값 (글자 크기 200 기준)
  wanderingFill: true, // 채움이 글자 사이를 옮겨 다니는 효과
  /** 타이틀이 차지하는 폭. PC는 오른쪽 카피 열(480px)과 겹치지 않는 범위 */
  width: 'min(100%, 560px)',
  /** 그림 가장자리 여백만큼 왼쪽으로 당겨 글자 왼쪽 끝을 컨테이너 선에 맞춘다 (폭의 %) */
  pullLeft: 3.2,
} as const;
