import Image from 'next/image';
import type { SlotImage } from './images';

/** 이미지 자리. src가 있으면 부모를 꽉 채우고(cover), 없으면 회색 자리로 채운다. 부모는 relative이고 크기를 가져야 한다. */
export function SlotFill({
  image,
  label,
  tone = 'light',
  priority = false,
  sizes,
}: {
  image: SlotImage;
  label: string;
  tone?: 'light' | 'dark';
  priority?: boolean;
  sizes: string;
}) {
  if (image.src) return <Image src={image.src} alt={image.alt} fill priority={priority} sizes={sizes} className="object-cover" />;
  return (
    <div
      role="img"
      aria-label={image.alt}
      className={`absolute inset-0 flex items-center justify-center ${tone === 'dark' ? 'bg-gray-400' : 'bg-gray-200'}`}
    >
      <span aria-hidden className="text-micro uppercase text-gray-600">
        {label}
      </span>
    </div>
  );
}
