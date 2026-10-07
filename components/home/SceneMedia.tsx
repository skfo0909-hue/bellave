'use client';
import { useEffect, useRef, useState } from 'react';
import { Img as Image } from '@/components/ui/Img';
import type { LookbookImage } from '@/lib/types';

const isVideo = (src: string) => /\.(mp4|webm)$/i.test(src);
const POSITION = { objectPosition: '50% 30%' }; // 인물 얼굴이 잘리지 않게

/** 룩북 화보. src가 영상(mp4, webm)이면 무음으로 자동 재생하고, 이미지면 next/image로 그린다. */
export function SceneMedia({ image, sizes, priority = false }: { image: LookbookImage; sizes: string; priority?: boolean }) {
  if (isVideo(image.src)) return <SceneVideo image={image} sizes={sizes} />;
  return <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover" style={POSITION} />;
}

function SceneVideo({ image, sizes }: { image: LookbookImage; sizes: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  // 서버 렌더와 첫 클라이언트 렌더를 맞추기 위해, 모션 줄이기 설정은 마운트 후에 반영한다.
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // 소리는 재생하지 않는다. 파일에도 오디오 트랙이 없지만, 어떤 경우에도 음소거를 강제한다.
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    // 화면에 보일 때만 재생해 리소스를 아낀다.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.1 });
    io.observe(video);
    return () => io.disconnect();
  }, [reduce]);

  // 모션 줄이기: 영상 대신 포스터 이미지만 보여준다.
  if (reduce && image.poster) {
    return <Image src={image.poster} alt={image.alt} fill sizes={sizes} className="object-cover" style={POSITION} />;
  }
  return (
    <video
      ref={ref}
      poster={image.poster}
      aria-label={image.alt}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      disablePictureInPicture
      className="h-full w-full object-cover"
      style={POSITION}
    >
      {/* mp4(H.264)를 먼저, 코덱이 없는 브라우저를 위해 같은 이름의 webm(VP9)을 대체로 둔다 */}
      <source src={image.src} type="video/mp4" />
      <source src={image.src.replace(/\.mp4$/i, '.webm')} type="video/webm" />
    </video>
  );
}
