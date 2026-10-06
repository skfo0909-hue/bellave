import { Img as Image } from '@/components/ui/Img';

// 1열 전체 폭과 2열(3:4 두 장)을 번갈아 배치
export function DetailImages({ images, name }: { images: string[]; name: string }) {
  const rows: string[][] = [];
  for (let i = 0, full = true; i < images.length; full = !full) {
    const take = full ? 1 : 2;
    rows.push(images.slice(i, i + take));
    i += take;
  }
  return (
    <div className="flex flex-col gap-2 md:gap-3">
      {rows.map((row, r) => (
        <div key={r} className={row.length === 1 ? '' : 'grid grid-cols-2 gap-2 md:gap-3'}>
          {row.map((src, i) => (
            <div key={`${src}-${i}`} className={`relative bg-gray-100 ${row.length === 1 ? 'aspect-[4/3] md:aspect-[16/9]' : 'aspect-[3/4]'}`}>
              <Image src={src} alt={`${name} 상세 이미지`} fill sizes={row.length === 1 ? '100vw' : '50vw'} loading="lazy" className="object-cover" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
