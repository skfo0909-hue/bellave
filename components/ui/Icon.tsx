// 1px 선 스타일 아이콘. 종류: 햄버거, 닫기, 검색, 하트, 플러스, 마이너스, 화살표
import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 16, children, ...rest }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" {...rest}>
      {children}
    </svg>
  );
}

export const MenuIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M1 4.5h14M1 11.5h14" />
  </Svg>
);
export const CloseIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M2 2l12 12M14 2L2 14" />
  </Svg>
);
export const SearchIcon = (p: Props) => (
  <Svg {...p}>
    <circle cx="7" cy="7" r="5" />
    <path d="M10.8 10.8L15 15" />
  </Svg>
);
export const HeartIcon = ({ filled, ...p }: Props & { filled?: boolean }) => (
  <Svg {...p}>
    <path
      d="M8 14S1.5 10 1.5 5.7A3.2 3.2 0 018 4.2a3.2 3.2 0 016.5 1.5C14.5 10 8 14 8 14z"
      fill={filled ? 'currentColor' : 'none'}
    />
  </Svg>
);
export const PlusIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M8 2v12M2 8h12" />
  </Svg>
);
export const MinusIcon = (p: Props) => (
  <Svg {...p}>
    <path d="M2 8h12" />
  </Svg>
);
export const ArrowIcon = ({ dir = 'right', ...p }: Props & { dir?: 'left' | 'right' | 'down' }) => (
  <Svg {...p} style={{ transform: `rotate(${dir === 'left' ? 180 : dir === 'down' ? 90 : 0}deg)` }}>
    <path d="M1 8h13M9 3l5 5-5 5" />
  </Svg>
);
