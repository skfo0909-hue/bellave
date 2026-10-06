'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SearchInput({ className = '', onSubmitted }: { className?: string; onSubmitted?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState('');
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
      <label className="sr-only" htmlFor="search-q">
        검색어
      </label>
      <input id="search-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="SEARCH" className="underline-input text-label uppercase" />
    </form>
  );
}
