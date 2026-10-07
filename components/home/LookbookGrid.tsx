'use client';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Img as Image } from '@/components/ui/Img';
import type { LookbookImage } from '@/lib/types';
import { ENTER_EASE, useMainMotion } from './useMainMotion';

/**
 * 룩북 12컷 모자이크 (PC, 태블릿 3열 / 모바일 2열). 자리는 고정이고 어떤 이미지가 어디에 들어갈지만 무작위다(데이터 생성 시 결정).
 *
 *   [ 1 ][ 2 ][ 3 ]
 *   [ 4 ][   5    ]      5, 10번이 큰 컷(2열 x 2행)
 *   [ 6 ][  (큰)  ]
 *   [ 7 ][ 8 ][ 9 ]
 *   [   10   ][ 11 ]
 *   [  (큰)  ][ 12 ]
 */
const LARGE = [5, 10];
const PLACE: Record<number, string> = {
  1: 'md:col-start-1 md:row-start-1',
  2: 'md:col-start-2 md:row-start-1',
  3: 'md:col-start-3 md:row-start-1',
  4: 'md:col-start-1 md:row-start-2',
  5: 'md:col-start-2 md:row-start-2 md:col-span-2 md:row-span-2',
  6: 'md:col-start-1 md:row-start-3',
  7: 'md:col-start-1 md:row-start-4',
  8: 'md:col-start-2 md:row-start-4',
  9: 'md:col-start-3 md:row-start-4',
  10: 'md:col-start-1 md:row-start-5 md:col-span-2 md:row-span-2',
  11: 'md:col-start-3 md:row-start-5',
  12: 'md:col-start-3 md:row-start-6',
};

export function LookbookGrid({ images, productNames = {} }: { images: LookbookImage[]; productNames?: Record<string, string> }) {
  const { reduced, desktop, mobile } = useMainMotion();
  // 모션 줄이기 여부가 바뀌면 다시 마운트해 서버 렌더의 initial 값이 남지 않게 한다.
  return (
    <ul key={reduced ? 'reduced' : 'motion'} className="mt-6 grid grid-cols-2 gap-2 md:mt-8 md:grid-cols-3 lg:mt-10 lg:gap-3">
      {images.map((image, i) => (
        <Cell
          key={image.src}
          image={image}
          slot={i + 1}
          reduced={reduced}
          desktop={desktop}
          step={mobile ? 0.05 : 0.08}
          cols={mobile ? 2 : 3}
          name={image.productIds?.[0] ? productNames[image.productIds[0]] : undefined}
        />
      ))}
    </ul>
  );
}

function Cell({
  image,
  slot,
  reduced,
  desktop,
  step,
  cols,
  name,
}: {
  image: LookbookImage;
  slot: number;
  reduced: boolean;
  desktop: boolean;
  step: number;
  cols: number;
  name?: string;
}) {
  const large = LARGE.includes(slot);
  const cell = useRef<HTMLLIElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  // 마스크로 가려진 요소는 브라우저가 화면에 안 보이는 것으로 판단하므로, 가려지지 않는 바깥 li를 감지한다. (요소의 20%가 보일 때 한 번)
  const inView = useInView(cell, { once: true, amount: 0.2 });
  const href = image.productIds?.[0] ? `/product/${image.productIds[0]}` : '/new-arrivals';
  const delay = ((slot - 1) % cols) * step; // 컷 순서대로 지연 (한 줄 단위로 다시 시작)

  // 큰 컷 이미지(PC만): 틀 안에서 y -4% → 4% 패럴랙스. 이미지를 틀보다 8% 크게 두고, y는 요소 높이(108%) 기준이라 4/108 = 3.7%로 환산한다.
  const { scrollYProgress } = useScroll({
    target: frame,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-3.7%', '3.7%']);
  const parallax = large && desktop && !reduced;

  return (
    <li ref={cell} className={`${large ? 'col-span-2 aspect-[3/4] md:aspect-auto' : 'aspect-[3/4]'} ${PLACE[slot]}`}>
      <motion.div
        ref={frame}
        className="group relative h-full w-full overflow-hidden bg-gray-100"
        {...(reduced
          ? {}
          : {
              initial: { clipPath: 'inset(100% 0% 0% 0%)' },
              animate: inView ? { clipPath: 'inset(0% 0% 0% 0%)' } : undefined,
              transition: { duration: 0.8, ease: ENTER_EASE, delay },
            })}
      >
        <Link href={href} className="absolute inset-0 block" aria-label={name ?? image.alt}>
          {/* 호버(PC만): 이미지 1.0 → 1.03 (0.4초) */}
          <div className="absolute inset-0 transition-transform duration-[400ms] ease-out lg:[@media(hover:hover)]:group-hover:scale-[1.03]">
            <motion.div
              className={`absolute inset-x-0 ${parallax ? '-top-[4%] h-[108%]' : 'top-0 h-full'}`}
              {...(reduced
                ? {}
                : {
                    initial: { scale: 1.12 },
                    animate: inView ? { scale: 1 } : undefined,
                    transition: { duration: 1.2, ease: ENTER_EASE, delay },
                  })}
              style={parallax ? { y: parallaxY } : undefined}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes={large ? '(min-width:1024px) 768px, 100vw' : '(min-width:1024px) 376px, 50vw'}
                priority={slot <= 3}
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
      </motion.div>
    </li>
  );
}
