import type { LookbookChapter } from '@/lib/types';

/** 소개 문구: 가운데 정렬, 폭 최대 480px. 첫 줄은 title 크기, 본문은 caption 크기 gray-600. */
export function IntroCopy({ chapter }: { chapter: LookbookChapter }) {
  return (
    <section aria-label="소개" className="mx-auto max-w-[480px] px-4 py-20 text-center lg:py-30">
      <p className="text-title">{chapter.copyLead}</p>
      <p className="mt-3 text-caption text-gray-600">{chapter.copy}</p>
    </section>
  );
}
