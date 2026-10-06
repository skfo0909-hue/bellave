import Link from 'next/link';

export function Pagination({ page, totalPages, hrefFor }: { page: number; totalPages: number; hrefFor: (p: number) => string }) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="페이지" className="mt-16 flex justify-center gap-4 text-label">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          aria-current={p === page ? 'page' : undefined}
          className={`inline-flex h-[44px] min-w-[24px] items-center justify-center ${p === page ? 'font-semibold underline' : 'text-gray-600 hover:text-black'}`}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}
