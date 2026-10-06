'use client';
import { useState } from 'react';
import { MinusIcon, PlusIcon } from '@/components/ui/Icon';
import { formatDate } from '@/lib/format';

export interface BoardItem {
  id: string;
  title: string;
  body: string;
  date?: string;
}

// 제목을 누르면 내용이 펼쳐지는 목록 (공지사항, FAQ 공용)
export function BoardList({ items }: { items: BoardItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <ul>
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <li key={item.id} className="border-b border-gray-200 first:border-t">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="min-w-0">
                <span className="block text-body">{item.title}</span>
                {item.date && <span className="block text-caption text-gray-600">{formatDate(item.date)}</span>}
              </span>
              {open ? <MinusIcon /> : <PlusIcon />}
            </button>
            {open && <p className="pb-4 text-body text-gray-600">{item.body}</p>}
          </li>
        );
      })}
    </ul>
  );
}
