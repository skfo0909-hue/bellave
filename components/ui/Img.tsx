import Image, { type ImageProps } from 'next/image';

// 임시 SVG 이미지는 최적화 대상이 아니므로 우회한다. 실제 이미지(jpg/webp 등)는 그대로 최적화된다.
export function Img(props: ImageProps) {
  const isSvg = typeof props.src === 'string' && props.src.endsWith('.svg');
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...props} unoptimized={isSvg || props.unoptimized} />;
}
