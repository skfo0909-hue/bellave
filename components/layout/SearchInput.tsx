'use client';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';

export function SearchInput({ className = '', onSubmitted }: { className?: string; onSubmitted?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const id = useId();
  return (
    <form
      role="search"
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const v = q.trim();
        if (!v) return;
        router.push(`/search?q=${encodeURIComponent(v)}`);
        onSubmitted?.();
      }}
    >
      <label className="sr-only" htmlFor={id}>
        검색어
      </label>
      <input id={id} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="SEARCH" className="underline-input text-label uppercase" />
    </form>
  );
}
