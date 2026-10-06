'use client';
import { useState } from 'react';
import { formatDate } from '@/lib/format';
import type { Review } from '@/lib/types';
import { Stars } from './Stars';

const PER_PAGE = 5;

export function ReviewList({ reviews }: { reviews: Review[] }) {
  const [page, setPage] = useState(1);
  if (reviews.length === 0) return <p className="text-body text-gray-600">등록된 리뷰가 없습니다.</p>;

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const totalPages = Math.ceil(reviews.length / PER_PAGE);
  const rows = reviews.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <p className="mb-4 flex items-center gap-2 text-body">
        <Stars rating={avg} />
        <span>{avg.toFixed(1)}</span>
        <span className="text-gray-600">({reviews.length})</span>
      </p>
      <ul>
        {rows.map((r) => (
          <li key={r.id} className="border-b border-gray-200 py-4 first:border-t">
            <Stars rating={r.rating} />
            <p className="mt-2 text-body">{r.content}</p>
            <p className="mt-2 text-caption text-gray-600">
              {r.author} · {formatDate(r.createdAt)}
            </p>
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <nav aria-label="리뷰 페이지" className="mt-8 flex justify-center gap-4 text-label">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              aria-current={p === page ? 'page' : undefined}
              onClick={() => setPage(p)}
              className={`inline-flex h-[44px] min-w-[24px] items-center justify-center ${p === page ? 'font-semibold underline' : 'text-gray-600'}`}
            >
              {p}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
