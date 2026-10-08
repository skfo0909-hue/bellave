import type { ComponentType } from 'react';
import { LabA } from './a/LabA';
import { LabB } from './b/LabB';
import { LabC } from './c/LabC';

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
  { id: 'c', name: 'C · COLLAGE + STEEL', description: 'B와 같은 콜라주에 고정 Steel 배경', Component: LabC },
];
