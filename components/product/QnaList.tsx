'use client';
import { useState } from 'react';
import { MinusIcon, PlusIcon } from '@/components/ui/Icon';
import { formatDate } from '@/lib/format';
import type { Qna } from '@/lib/types';

export function QnaList({ items }: { items: Qna[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  if (items.length === 0) return <p className="text-body text-gray-600">등록된 문의가 없습니다.</p>;
  return (
    <ul>
      {items.map((q) => {
        const open = openId === q.id;
        return (
          <li key={q.id} className="border-b border-gray-200 first:border-t">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : q.id)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span>
                <span className="block text-body">{q.title}</span>
                <span className="block text-caption text-gray-600">
                  {q.author} · {formatDate(q.createdAt)} · {q.answer ? '답변 완료' : '답변 대기'}
                </span>
              </span>
              {open ? <MinusIcon /> : <PlusIcon />}
            </button>
            {open && (
              <div className="pb-4 text-body">
                <p>{q.question}</p>
                {q.answer && <p className="mt-4 text-gray-600">{q.answer}</p>}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
