/**
 * /lab/c 키 타이틀 조절 값. 값을 바꾸면 곧바로 반영된다.
 */
export const TITLE_FX = {
  /** 글자 크기. 세리프는 Anton보다 폭이 넓어 PC 오른쪽 카피 열(480px)과 겹치지 않는 범위로 잡았다. */
  fontSize: 'clamp(52px, 7.2vw, 108px)',
  fontWeight: 900,
  /** Bodoni Moda 광학 크기 축 (6~96). 숫자가 작을수록 가는 획(헤어라인)이 굵어져 변형을 거쳐도 끊기지 않는다. */
  opsz: 10,
  lineHeight: 1,
  letterSpacing: '-0.01em',

  /** 윤곽 물결 (정지 상태) */
  wave: {
    strength: 0.045, // 변형 강도 (글자 크기 em 기준). 0이면 물결 없음. 0.07 이상이면 가는 획이 끊겨 읽기 어려워진다.
    frequency: [0.011, 0.017] as [number, number], // 물결 주기. 숫자가 작을수록 크고 완만한 물결
    octaves: 1, // 1이 가장 매끄럽다. 2 이상은 윤곽이 거칠어진다
    seed: 4, // 물결 모양. 숫자를 바꾸면 다른 모양이 나온다.
  },

  color: '#FFFFFF', // 상단 타이틀 영역 글자색 (타이틀, 서브 라인, 카피)
} as const;
