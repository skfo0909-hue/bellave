'use client';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useMemo, useRef, type CSSProperties } from 'react';
import { Img as Image } from '@/components/ui/Img';
import { rng, shuffle } from '@/lib/seeded';
import type { LookbookImage } from '@/lib/types';
import { ENTER_EASE, useMainMotion } from './useMainMotion';

/**
 * 룩북 콜라주 (CLAUDE.md 9-1장 LookbookCollage). 12컷을 3컷씩 4개 묶음(A, B, C, D 템플릿 순서)으로 나눠 위에서 아래로 쌓는다.
 * 컷이 서로 겹치고 좌우로 어긋나며, 이미지는 자르지 않고 원본 비율 그대로 보여준다.
 *
 * 구현 방식
 * - 모든 위치와 크기를 컨테이너 폭(W) 기준 비율로 계산한다. 컷의 높이는 원본 width, height로 정해지므로 이미지가 로드되기 전에도 자리가 밀리지 않는다.
 * - PC, 태블릿(12칸)과 모바일(6칸) 값을 모두 CSS 변수로 내려 보내고 미디어 쿼리로 고른다. JS가 실행된 뒤 레이아웃이 바뀌지 않는다.
 * - 무작위 요소(자리 배정, 어긋남, 겹침 깊이)는 모두 seed로 결정한다. 같은 seed면 같은 결과다.
 */

type Kind = 'large' | 'medium' | 'small' | 'wide';
interface CutSpec {
  kind: Kind;
  cols: [number, number]; // 12칸 기준 시작, 끝 칸
  z: number; // 쌓임 순서: 바탕 컷 < 중간 컷 < 작은 컷
  over?: boolean; // 다른 컷 위에 올라가는 컷 (흰색 테두리)
}
interface Template {
  cuts: [CutSpec, CutSpec, CutSpec];
  /** 각 컷의 위쪽 위치(W 단위). h는 컷 높이, d는 겹침 깊이(0.2~0.35) */
  place: (h: number[], d: number[]) => number[];
}

const GAP = 0.01; // "바로 아래"일 때 붙지 않게 두는 아주 작은 틈 (W 단위)

const TEMPLATES: Template[] = [
  // A: 큰 컷(오른쪽 붙임) + 작은 컷(왼쪽 아래 모서리에 겹침) + 넓은 컷(작은 컷이 위쪽에 걸침)
  {
    cuts: [
      { kind: 'large', cols: [3, 12], z: 1 },
      { kind: 'small', cols: [1, 6], z: 3, over: true },
      { kind: 'wide', cols: [1, 12], z: 1 },
    ],
    place: (h, d) => {
      const y2 = h[0] - d[1] * h[1];
      return [0, y2, y2 + h[1] - d[2] * h[1]];
    },
  },
  // B: 중간 컷(왼쪽 붙임) + 중간 컷(30% 아래에서 시작, 오른쪽 아래에 겹침) + 작은 컷(2번의 왼쪽 아래에 겹침)
  {
    cuts: [
      { kind: 'medium', cols: [1, 7], z: 1 },
      { kind: 'medium', cols: [6, 12], z: 2, over: true },
      { kind: 'small', cols: [2, 6], z: 3, over: true },
    ],
    place: (h, d) => {
      const y2 = 0.3 * h[0];
      return [0, y2, y2 + h[1] - d[2] * h[2]];
    },
  },
  // C: 큰 컷(왼쪽 붙임) + 작은 컷(오른쪽 가운데에 겹침) + 작은 컷(2번 바로 아래, 1번의 오른쪽 아래에 겹침)
  {
    cuts: [
      { kind: 'large', cols: [1, 9], z: 1 },
      { kind: 'small', cols: [7, 12], z: 3, over: true },
      { kind: 'small', cols: [8, 12], z: 3, over: true },
    ],
    place: (h) => {
      const y2 = (h[0] - h[1]) / 2;
      return [0, y2, y2 + h[1] + GAP];
    },
  },
  // D: 중간 컷(오른쪽 붙임) + 작은 컷(왼쪽 위에 겹침) + 넓은 컷(겹치지 않고 바로 아래)
  {
    cuts: [
      { kind: 'medium', cols: [5, 12], z: 1 },
      { kind: 'small', cols: [1, 6], z: 3, over: true },
      { kind: 'wide', cols: [1, 12], z: 1 },
    ],
    place: (h) => [0, 0, Math.max(h[0], h[1]) + GAP],
  },
];

const slotKinds = TEMPLATES.flatMap((t) => t.cuts.map((c) => c.kind)); // 12자리, 묶음 순서대로
const COUNT = slotKinds.length;

/** 원본 가로 해상도 등급. 높을수록 큰 자리에 우선 배정한다. */
const tier = (img: LookbookImage) => (img.width >= 1600 ? 3 : img.width >= 1000 ? 2 : img.width >= 700 ? 1 : 0);
const basename = (src: string) => src.split('/').pop() ?? src;

/**
 * 어느 이미지가 어느 자리에 들어갈지 (seed로 결정).
 * - pinLarge에 적힌 파일은 큰 컷 자리에 고정한다.
 * - 가로 사진은 넓은 컷 자리에, 세로 사진은 큰 컷 자리에 우선 배정한다.
 * - 같은 조건이면 원본 해상도가 높은 이미지를 큰 자리(넓은, 큰, 중간, 작은 순)에 먼저 배정해, 확대되어 흐려지는 것을 줄인다.
 */
function assign(images: LookbookImage[], seed: number, pinLarge: string[] = []): LookbookImage[] {
  const out: (LookbookImage | undefined)[] = Array(COUNT).fill(undefined);
  // 해상도 등급 순서(같은 등급은 seed로 섞은 순서 유지)
  let pool = shuffle(images, seed + 31).sort((a, b) => tier(b) - tier(a));
  const take = (pick: (i: LookbookImage) => boolean) => {
    const found = pool.find(pick) ?? pool[0];
    pool = pool.filter((i) => i !== found);
    return found;
  };
  const indexesOf = (kind: Kind) => slotKinds.map((k, i) => (k === kind ? i : -1)).filter((i) => i >= 0);

  // 1. 큰 컷 자리에 pinLarge 고정
  const larges = shuffle(indexesOf('large'), seed + 7);
  pinLarge.slice(0, larges.length).forEach((file, n) => {
    const hit = pool.find((i) => basename(i.src) === file);
    if (hit) {
      out[larges[n]] = hit;
      pool = pool.filter((i) => i !== hit);
    }
  });

  // 2. 넓은 컷, 큰 컷 자리(순서는 섞는다): 해상도가 높은 이미지를 먼저
  const lead = shuffle([...indexesOf('wide'), ...larges.filter((i) => !out[i])], seed + 11);
  lead.forEach((slot) => {
    out[slot] = slotKinds[slot] === 'wide' ? take((i) => i.width > i.height) : take((i) => i.width <= i.height);
  });
  // 3. 중간 컷, 작은 컷 자리
  [...shuffle(indexesOf('medium'), seed + 13), ...shuffle(indexesOf('small'), seed + 17)].forEach((slot) => {
    out[slot] = take(() => true);
  });
  return out as LookbookImage[];
}

interface Geometry {
  left: number; // 0~1 (W 기준)
  width: number; // 0~1
  top: number; // W 단위
  dy: number; // 세로 어긋남(px)
}
interface Variant {
  geo: Geometry[];
  height: number; // 묶음 전체 높이 (W 단위)
}

/** 한 묶음의 위치 계산. n=12는 PC와 태블릿, n=6은 모바일(칸 번호를 절반으로) */
function layoutCluster(tpl: Template, imgs: LookbookImage[], seed: number, n: 12 | 6): Variant {
  const cols = (c: [number, number]): [number, number] => (n === 12 ? c : [Math.ceil(c[0] / 2), Math.ceil(c[1] / 2)]);
  const jitter = tpl.cuts.map((_, i) => {
    const r = rng(seed + i * 101);
    return {
      dx: n === 12 ? Math.floor(r() * 3) - 1 : 0, // 가로 ±1칸 (모바일은 세로만)
      dy: (r() * 2 - 1) * (n === 12 ? 24 : 12), // 세로 ±24px (모바일 ±12px)
      depth: 0.2 + r() * 0.15, // 겹침 깊이: 위 컷 높이의 20~35%
    };
  });
  const aspect = imgs.map((i) => i.height / i.width);

  const compute = (dx: number[]) => {
    const rects = tpl.cuts.map((c, i) => {
      const [a, b] = cols(c.cols);
      const span = b - a + 1;
      const start = Math.min(Math.max(a + dx[i], 1), n - span + 1); // 컨테이너 밖으로 나가지 않게
      return { left: (start - 1) / n, width: span / n };
    });
    const h = rects.map((r, i) => r.width * aspect[i]);
    const top = tpl.place(
      h,
      jitter.map((j) => j.depth),
    );
    return { rects, h, top };
  };

  let dx = jitter.map((j) => j.dx);
  let { rects, h, top } = compute(dx);
  // 위 컷이 아래 컷 면적의 25% 이상을 가리면 가로 어긋남을 되돌린다
  const covers = () =>
    tpl.cuts.map((ci, i) =>
      tpl.cuts.some((cj, j) => {
        if (i === j || ci.z <= cj.z) return false;
        const w = Math.min(rects[i].left + rects[i].width, rects[j].left + rects[j].width) - Math.max(rects[i].left, rects[j].left);
        const hh = Math.min(top[i] + h[i], top[j] + h[j]) - Math.max(top[i], top[j]);
        return w > 0 && hh > 0 && (w * hh) / (rects[j].width * h[j]) > 0.25;
      }),
    );
  if (covers().some(Boolean)) {
    dx = dx.map((v, i) => (covers()[i] ? 0 : v));
    ({ rects, h, top } = compute(dx));
  }

  return {
    height: Math.max(...top.map((t, i) => t + h[i])),
    geo: rects.map((r, i) => ({ left: r.left, width: r.width, top: top[i], dy: jitter[i].dy })),
  };
}

interface ClusterData {
  cuts: { image: LookbookImage; spec: CutSpec; stack: number; slot: number }[];
  pc: Variant;
  mobile: Variant;
}

function buildClusters(images: LookbookImage[], seed: number, pinLarge?: string[]): ClusterData[] {
  const ordered = assign(images, seed, pinLarge);
  return TEMPLATES.map((tpl, ci) => {
    const imgs = ordered.slice(ci * 3, ci * 3 + 3);
    let stack = 0;
    return {
      cuts: tpl.cuts.map((spec, k) => ({ image: imgs[k], spec, stack: spec.over ? ++stack : 0, slot: ci * 3 + k })),
      pc: layoutCluster(tpl, imgs, seed + ci * 1009, 12),
      mobile: layoutCluster(tpl, imgs, seed + ci * 1009, 6),
    };
  });
}

const pct = (v: number) => `${(v * 100).toFixed(4)}%`;

export function LookbookCollage({
  images,
  seed,
  pinLarge,
  productNames = {},
  frame = false,
  blurReveal = false,
}: {
  images: LookbookImage[];
  seed: number;
  pinLarge?: string[];
  productNames?: Record<string, string>;
  /** 시안 옵션: 모든 컷에 두꺼운 흰색 테두리 (기본 꺼짐: 겹친 컷만 얇은 테두리) */
  frame?: boolean;
  /** 시안 옵션: 스크롤 진입 시 블러 → 선명 (기본 꺼짐) */
  blurReveal?: boolean;
}) {
  const { reduced, desktop } = useMainMotion();
  const clusters = useMemo(() => buildClusters(images, seed, pinLarge), [images, seed, pinLarge]);
  // 모션 줄이기 여부가 바뀌면 다시 마운트해 서버 렌더의 initial 값이 남지 않게 한다.
  return (
    <div key={reduced ? 'reduced' : 'motion'} className="mt-6 flex flex-col gap-12 md:mt-8 md:gap-16 lg:mt-10 lg:gap-24">
      {clusters.map((cluster, ci) => (
        <ul
          key={ci}
          className="relative w-full [aspect-ratio:var(--ar-m)] md:[aspect-ratio:var(--ar-d)]"
          style={{ '--ar-m': `1 / ${cluster.mobile.height.toFixed(5)}`, '--ar-d': `1 / ${cluster.pc.height.toFixed(5)}` } as CSSProperties}
        >
          {cluster.cuts.map((cut, k) => (
            <Cut
              key={cut.image.src}
              cut={cut}
              pc={cluster.pc}
              mobile={cluster.mobile}
              index={k}
              reduced={reduced}
              desktop={desktop}
              frame={frame}
              blurReveal={blurReveal}
              priority={ci === 0 && k === 0}
              name={cut.image.productIds?.[0] ? productNames[cut.image.productIds[0]] : undefined}
            />
          ))}
        </ul>
      ))}
    </div>
  );
}

function Cut({
  cut,
  pc,
  mobile,
  index,
  reduced,
  desktop,
  frame,
  blurReveal,
  priority,
  name,
}: {
  cut: ClusterData['cuts'][number];
  pc: Variant;
  mobile: Variant;
  index: number;
  reduced: boolean;
  desktop: boolean;
  frame: boolean;
  blurReveal: boolean;
  priority: boolean;
  name?: string;
}) {
  const { image, spec, stack } = cut;
  const li = useRef<HTMLLIElement>(null);
  // 가려진(opacity 0) 요소가 아니라 바깥 li를 감지한다. (요소의 20%가 보일 때 한 번)
  const inView = useInView(li, { once: true, amount: 0.2 });
  const over = Boolean(spec.over);
  const href = image.productIds?.[0] ? `/product/${image.productIds[0]}` : '/new-arrivals';

  // 겹친 컷(PC만): 스크롤 연동, 바탕 컷보다 조금 빠르게 y 24px → -24px
  const { scrollYProgress } = useScroll({ target: li, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const parallax = over && desktop && !reduced;

  // 시안 옵션(blurReveal): 컷 윗변이 화면 아래에서 올라와 화면 높이 40% 지점에 닿을 때까지 블러 16px → 0, 크기 1.06 → 1 (블러 가장자리 비침 방지)
  const { scrollYProgress: revealProgress } = useScroll({ target: li, offset: ['start end', 'start 40%'] });
  const blurPx = useTransform(revealProgress, [0, 1], [16, 0]);
  const blurFilter = useTransform(blurPx, (v) => `blur(${v.toFixed(2)}px)`);
  const blurScale = useTransform(revealProgress, [0, 1], [1.06, 1]);
  const reveal = blurReveal && !reduced;

  const vars = (v: Variant) => ({ ...v.geo[index], top: `calc(${pct(v.geo[index].top / v.height)} + ${v.geo[index].dy.toFixed(1)}px)` });
  const m = vars(mobile);
  const d = vars(pc);
  const spanDesktop = Math.round(d.width * 1152);

  // 바탕 컷: 투명도 0 → 1, 크기 1.04 → 1.0, 0.8초. 겹친 컷: 바탕 컷 0.15초 뒤, 쌓임 순서대로 0.12초씩 지연, 투명도 0 → 1, y 32px → 0, 0.7초.
  const enter = reduced
    ? {}
    : over
      ? {
          initial: { opacity: 0, y: 32 },
          animate: inView ? { opacity: 1, y: 0 } : undefined,
          transition: { duration: 0.7, ease: ENTER_EASE, delay: 0.15 + (stack - 1) * 0.12 },
        }
      : {
          initial: { opacity: 0, scale: 1.04 },
          animate: inView ? { opacity: 1, scale: 1 } : undefined,
          transition: { duration: 0.8, ease: ENTER_EASE },
        };

  return (
    <li
      ref={li}
      className="absolute left-[var(--l-m)] top-[var(--t-m)] w-[var(--w-m)] md:left-[var(--l-d)] md:top-[var(--t-d)] md:w-[var(--w-d)]"
      style={
        {
          '--l-m': pct(m.left),
          '--w-m': pct(m.width),
          '--t-m': m.top,
          '--l-d': pct(d.left),
          '--w-d': pct(d.width),
          '--t-d': d.top,
          aspectRatio: `${image.width} / ${image.height}`,
          zIndex: spec.z,
        } as CSSProperties
      }
    >
      <motion.div className="h-full w-full" {...enter}>
        <motion.div className="h-full w-full" style={parallax ? { y: parallaxY } : undefined}>
          {/* 위에 올라가는 컷은 흰색 테두리 4px(모바일 3px). 그림자와 회전은 쓰지 않는다. 바탕 컷은 테두리 없음. */}
          <div
            className={`group relative h-full w-full overflow-hidden bg-gray-100 ${frame ? 'border-[6px] border-white md:border-8' : over ? 'border-[3px] border-white md:border-4' : ''}`}
          >
            <Link href={href} className="absolute inset-0 block" aria-label={name ?? image.alt}>
              {/* 호버(PC만): 이미지 1.0 → 1.03 (0.4초) */}
              <div className="absolute inset-0 transition-transform duration-[400ms] ease-out lg:[@media(hover:hover)]:group-hover:scale-[1.03]">
                <motion.div className="absolute inset-0" style={reveal ? { filter: blurFilter, scale: blurScale } : undefined}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes={`(min-width:1024px) ${spanDesktop}px, ${Math.round(m.width * 100)}vw`}
                    priority={priority}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: 'center 25%' }}
                  />
                </motion.div>
              </div>
              {name && (
                <span className="pointer-events-none absolute bottom-2 left-2 hidden text-micro text-white opacity-0 transition-opacity duration-200 lg:block lg:[@media(hover:hover)]:group-hover:opacity-100">
                  {name}
                </span>
              )}
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </li>
  );
}
