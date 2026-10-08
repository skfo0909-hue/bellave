import type { LookbookChapter } from '@/lib/types';

/** 소개 문구: 01 화보 바로 아래, 가운데 정렬, 폭 최대 480px, 위아래 여백 80px. 문구는 lookbook.json의 값. */
export function IntroCopy({ chapter }: { chapter: LookbookChapter }) {
  return (
    <section aria-label="소개" className="mx-auto max-w-[480px] px-4 py-20 text-center">
      <p className="text-title">{chapter.copyLead}</p>
      <p className="mt-3 text-caption text-gray-600">{chapter.copy}</p>
    </section>
  );
}
