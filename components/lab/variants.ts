import type { ComponentType } from 'react';
import { LabA } from './a/LabA';
import { LabB } from './b/LabB';
import { LabC } from './c/LabC';
import { LabD } from './d/LabD';
import { LabE } from './e/LabE';

/** 시안 목록. 채택하지 않은 시안은 components/lab/<id>/ 폴더와 아래 한 줄을 지운다. */
export interface LabVariant {
  id: string;
  name: string;
  description: string;
  Component: ComponentType;
}

export const LAB_VARIANTS: LabVariant[] = [
  { id: 'a', name: 'A · GRID', description: '3열 모자이크. 현재 grid 레이아웃', Component: LabA },
  { id: 'b', name: 'B · COLLAGE', description: '겹침 콜라주. 현재 collage 레이아웃', Component: LabB },
  { id: 'c', name: 'C · COLLAGE + STEEL', description: 'B와 같은 콜라주에 고정 Steel 배경, 두꺼운 흰 테두리, 블러 → 선명 모션, 상품 리스트부터 흰 배경', Component: LabC },
  { id: 'd', name: 'D · HERO + CAROUSEL', description: '전체 폭 비주얼 룩북 2개와 세부 룩 캐러셀 2개. 이미지는 회색 자리', Component: LabD },
  { id: 'e', name: 'E · EDITORIAL', description: '좌우 분할 히어로, 이미지 쌍, 워드마크, 슬라이더, 선으로 나뉜 상품 격자, 2×2 이미지', Component: LabE },
];
