import { Img } from '@/components/ui/Img';
import type { LookbookImage } from '@/lib/types';

/** 룩북 컷을 부모(relative + 크기 지정)에 꽉 채워 보여준다. position은 object-position 값(기본 위쪽 25%). */
export function Pic({
  image,
  sizes,
  position = 'center 25%',
  priority = false,
}: {
  image: LookbookImage;
  sizes: string;
  position?: string;
  priority?: boolean;
}) {
  return (
    <Img
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
      style={{ objectPosition: position }}
    />
  );
}

/** 섹션 라벨 (TEASE, SPACE 등) */
export function Label({ children }: { children: string }) {
  return <p className="section-title text-center">{children}</p>;
}
