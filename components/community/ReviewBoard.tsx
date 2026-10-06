import Link from 'next/link';
import { Stars } from '@/components/product/Stars';
import { formatDate } from '@/lib/format';
import type { CommunityReview } from '@/lib/types';

export function ReviewBoard({ reviews, productNames }: { reviews: CommunityReview[]; productNames: Record<string, string> }) {
  return (
    <ul>
      {reviews.map((r) => (
        <li key={r.id} className="border-b border-gray-200 py-4 first:border-t">
          <Stars rating={r.rating} />
          <p className="mt-2 text-body">{r.content}</p>
          <p className="mt-2 text-caption text-gray-600">
            <Link href={`/product/${r.productId}`} className="underline">
              {productNames[r.productId] ?? r.productId}
            </Link>
            {' · '}
            {r.author} · {formatDate(r.createdAt)}
          </p>
        </li>
      ))}
    </ul>
  );
}
