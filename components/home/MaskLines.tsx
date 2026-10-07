'use client';
import { motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ENTER_EASE } from './useMainMotion';

/**
 * 문장을 줄 단위로 나눠, 줄마다 아래에서 올라오는 마스크로 등장시킨다 (줄마다 0.05초 지연, 0.6초).
 * 줄바꿈 위치는 실제 렌더 결과를 재서 정한다. 양쪽 정렬이므로 마지막 줄만 왼쪽 정렬한다.
 * onLoad가 true면 로드 직후, 아니면 뷰포트에 20%가 보일 때 한 번 재생한다.
 */
export function MaskLines({
  text,
  className = '',
  wrapperClassName = '',
  delay = 0,
  onLoad = false,
  reduced = false,
}: {
  text: string;
  className?: string;
  wrapperClassName?: string; // 감지용 바깥 래퍼의 폭 등
  delay?: number;
  onLoad?: boolean;
  reduced?: boolean;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const played = useRef(false);
  // 줄은 overflow로 가려져 있어 감지가 안 되므로, 가려지지 않는 바깥 래퍼를 감지한다. (20%가 보일 때 한 번)
  const inView = useInView(wrap, { once: true, amount: 0.2 });
  const go = onLoad || inView;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const measure = () => {
      const spans = [...el.querySelectorAll<HTMLElement>('[data-w]')];
      if (spans.length === 0) return;
      const out: string[][] = [];
      let top = spans[0].offsetTop;
      spans.forEach((s) => {
        if (Math.abs(s.offsetTop - top) > 4) {
          top = s.offsetTop;
          out.push([]);
        }
        (out[out.length - 1] ?? (out[0] = [])).push(s.textContent ?? '');
      });
      setLines(out.map((l) => l.join(' ')));
    };
    measure();
    document.fonts?.ready.then(measure);
  }, [text, reduced]);

  // 줄 수를 알기 전(서버 렌더 포함)에는 보이지 않게 두고 단어 단위로 그려 줄바꿈을 잰다. 모션 줄이기는 그냥 문장.
  if (reduced) return <p className={`${wrapperClassName} ${className} text-justify`}>{text}</p>;
  if (!lines) {
    return (
      <div ref={wrap} className={wrapperClassName}>
        <p ref={ref} className={`${className} text-justify opacity-0`} aria-hidden="true">
          {text.split(' ').map((w, i) => (
            <span key={i} data-w="">
              {w}{' '}
            </span>
          ))}
        </p>
      </div>
    );
  }

  const shouldPlay = !played.current;
  played.current = true;
  return (
    <div ref={wrap} className={wrapperClassName}>
      <p className={className} aria-label={text}>
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden" aria-hidden="true">
            <motion.span
              className={`block ${i === lines.length - 1 ? '[text-align-last:left]' : '[text-align-last:justify]'} text-justify`}
              initial={shouldPlay ? { y: '100%' } : false}
              animate={go ? { y: 0 } : undefined}
              transition={{
                duration: 0.6,
                ease: ENTER_EASE,
                delay: delay + i * 0.05,
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </p>
    </div>
  );
}
