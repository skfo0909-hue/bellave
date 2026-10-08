'use client';

/**
 * BoilTitle
 * 손으로 그린 듯한 이중 윤곽선이 프레임마다 떨리고(line boil),
 * 색 채움이 글자 사이를 옮겨 다니는 타이틀 애니메이션.
 *
 * 사용 예:
 *   <BoilTitle lines={['COAT', 'WEATHER']} color="#FFFFFF" />
 *
 * 구성 원리
 * 1. 글자를 굵은 선으로 그린 뒤 가운데를 얇은 선으로 파내 "두 줄 윤곽선"을 만든다.
 * 2. 같은 글자의 면 채움을 움직이는 원(blob)으로 잘라, 일부 글자만 채워 보이게 한다.
 * 3. 전체에 노이즈 변형 필터를 걸고, 노이즈 seed를 초당 몇 번만 바꿔 뚝뚝 끊기는 떨림을 만든다.
 */

import { useEffect, useId, useRef, useState } from 'react';

type Props = {
  lines?: string[];
  /** 선과 채움 색 */
  color?: string;
  /** 서체. 생략하면 부모 요소의 서체를 따른다 */
  fontFamily?: string;
  fontWeight?: number | string;
  /** 초당 떨림 횟수. 낮을수록 손그림 느낌 (권장 6~10) */
  fps?: number;
  /** 윤곽선 바깥 굵기 (글자 크기 200 기준) */
  outer?: number;
  /** 윤곽선 가운데를 파내는 굵기. outer보다 작아야 두 줄이 보인다 */
  inner?: number;
  /** 떨림 강도 */
  boil?: number;
  /** 줄 간격 배수. 1보다 작으면 두 줄이 겹친다 (영상은 약 0.62) */
  lineGap?: number;
  /** 줄마다 가로로 밀어내는 값 (글자 크기 200 기준). 예: [90, 0] */
  indent?: number[];
  /** 채움이 옮겨 다니는 효과 사용 여부 */
  wanderingFill?: boolean;
  className?: string;
};

const FONT_SIZE = 200;

export default function BoilTitle({
  lines = ['COAT', 'WEATHER'],
  color = '#FFFFFF',
  fontFamily,
  fontWeight = 800,
  fps = 8,
  outer = 26,
  inner = 12,
  boil = 9,
  lineGap = 0.62,
  indent = [90, 0],
  wanderingFill = true,
  className,
}: Props) {
  // 의존성 배열에 복잡한 식을 쓰면 lint 경고가 나서 변수로 뺐다 (동작은 동일)
  const linesKey = lines.join('|');
  const indentKey = indent.join(',');
  const uid = useId().replace(/[:]/g, '');
  const ids = {
    text: `bt-text-${uid}`,
    filter: `bt-boil-${uid}`,
    mask: `bt-ink-${uid}`,
    clip: `bt-blob-${uid}`,
  };

  const measureRef = useRef<SVGTextElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const blobARef = useRef<SVGCircleElement>(null);
  const blobBRef = useRef<SVGCircleElement>(null);

  // 글자 영역 (서체 로딩 후 실제 크기를 재서 viewBox를 맞춘다)
  const [box, setBox] = useState({ x: 0, y: -FONT_SIZE, w: 1000, h: FONT_SIZE * 2 });

  useEffect(() => {
    let cancelled = false;
    const measure = () => {
      const el = measureRef.current;
      if (!el || cancelled) return;
      const b = el.getBBox();
      const pad = outer + boil * 2;
      setBox({ x: b.x - pad, y: b.y - pad, w: b.width + pad * 2, h: b.height + pad * 2 });
    };
    measure();
    // 웹폰트가 늦게 적용되면 다시 잰다
    document.fonts?.ready.then(measure);
    return () => {
      cancelled = true;
    };
  }, [linesKey, fontFamily, fontWeight, outer, boil, lineGap, indentKey]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let frame = 0;
    const tick = () => {
      frame += 1;

      // 1) 윤곽선 떨림: 노이즈 seed만 바꾼다
      turbRef.current?.setAttribute('seed', String(frame % 97));

      // 2) 채움 이동: 원 두 개가 글자 위를 서로 다른 속도로 돌아다닌다
      if (wanderingFill) {
        const t = frame / fps;
        const place = (el: SVGCircleElement | null, sx: number, sy: number, phase: number, r: number) => {
          if (!el) return;
          const cx = box.x + box.w * (0.5 + 0.48 * Math.sin(t * sx + phase));
          const cy = box.y + box.h * (0.5 + 0.3 * Math.sin(t * sy + phase * 1.7));
          el.setAttribute('cx', cx.toFixed(1));
          el.setAttribute('cy', cy.toFixed(1));
          el.setAttribute('r', (box.h * r).toFixed(1));
        };
        place(blobARef.current, 0.9, 1.4, 0, 0.3);
        place(blobBRef.current, 0.55, 1.1, 2.4, 0.22);
      }
    };

    tick();
    const timer = window.setInterval(tick, 1000 / fps);
    return () => window.clearInterval(timer);
  }, [fps, wanderingFill, box.x, box.y, box.w, box.h]);

  const textProps = {
    fontSize: FONT_SIZE,
    fontWeight,
    style: fontFamily ? { fontFamily } : undefined,
  };

  const renderLines = () =>
    lines.map((line, i) => (
      <tspan key={i} x={indent[i] ?? 0} dy={i === 0 ? 0 : FONT_SIZE * lineGap}>
        {line}
      </tspan>
    ));

  return (
    <h2 className={className} aria-label={lines.join(' ')} style={{ margin: 0, lineHeight: 0 }}>
      <svg
        aria-hidden="true"
        viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
        width="100%"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          {/* 한 번 정의해 두고 여러 번 재사용하는 글자 */}
          <text id={ids.text} {...textProps}>
            {renderLines()}
          </text>

          {/* 떨림 필터 */}
          <filter
            id={ids.filter}
            filterUnits="userSpaceOnUse"
            x={box.x}
            y={box.y}
            width={box.w}
            height={box.h}
          >
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.018 0.024"
              numOctaves={2}
              seed={1}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={boil}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* 채움이 보이는 영역 (움직이는 원 두 개) */}
          <clipPath id={ids.clip} clipPathUnits="userSpaceOnUse">
            <circle ref={blobARef} cx={box.x + box.w * 0.8} cy={box.y + box.h * 0.6} r={box.h * 0.3} />
            <circle ref={blobBRef} cx={box.x + box.w * 0.25} cy={box.y + box.h * 0.4} r={box.h * 0.22} />
          </clipPath>

          {/* 잉크 마스크: 흰 부분만 색이 칠해진다 */}
          <mask
            id={ids.mask}
            maskUnits="userSpaceOnUse"
            x={box.x}
            y={box.y}
            width={box.w}
            height={box.h}
          >
            <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="#000" />
            {/* 굵은 선을 그리고 */}
            <use
              href={`#${ids.text}`}
              fill="none"
              stroke="#fff"
              strokeWidth={outer}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* 가운데를 파내 두 줄 윤곽선으로 만든다 */}
            <use
              href={`#${ids.text}`}
              fill="none"
              stroke="#000"
              strokeWidth={inner}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* 움직이는 원 안쪽만 글자를 꽉 채운다 */}
            {wanderingFill && (
              <g clipPath={`url(#${ids.clip})`}>
                <use
                  href={`#${ids.text}`}
                  fill="#fff"
                  stroke="#fff"
                  strokeWidth={outer}
                  strokeLinejoin="round"
                />
              </g>
            )}
          </mask>
        </defs>

        {/* 크기 측정용 (보이지 않음) */}
        <text ref={measureRef} {...textProps} visibility="hidden">
          {renderLines()}
        </text>

        {/* 실제로 보이는 것은 색 사각형 하나. 마스크로 모양을 내고 필터로 떨린다 */}
        <g filter={`url(#${ids.filter})`}>
          <rect
            x={box.x}
            y={box.y}
            width={box.w}
            height={box.h}
            fill={color}
            mask={`url(#${ids.mask})`}
          />
        </g>
      </svg>
    </h2>
  );
}
