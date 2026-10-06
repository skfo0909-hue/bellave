'use client';
import { useId, useState, type ReactNode } from 'react';
import { MinusIcon, PlusIcon } from './Icon';

export function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-gray-200 first:border-t">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="flex h-[48px] w-full items-center justify-between text-left text-label uppercase"
      >
        {title}
        {open ? <MinusIcon /> : <PlusIcon />}
      </button>
      {/* grid-rows 전환으로 높이 변화만 허용 */}
      <div
        id={id}
        role="region"
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="pb-4 text-body text-gray-600">{children}</div>
        </div>
      </div>
    </div>
  );
}
