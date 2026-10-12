import { Img } from '@/components/ui/Img';

/** 로고(스크립트체 워드마크)를 가로 폭 가득 크게 보여주는 구분 배너. */
export function Wordmark() {
  return (
    <div className="mx-auto w-full px-4 py-20 md:px-10 lg:w-[80%] lg:px-0 lg:py-30">
      <Img
        src="/logo.png"
        alt="BELLAVE"
        width={1704}
        height={586}
        sizes="(min-width:1024px) 80vw, 100vw"
        className="h-auto w-full bg-transparent"
      />
    </div>
  );
}
