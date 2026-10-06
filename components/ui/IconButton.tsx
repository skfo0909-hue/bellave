import type { ButtonHTMLAttributes, ReactNode } from 'react';

// 아이콘 전용 버튼: aria-label 필수, 터치 영역 최소 44px
export function IconButton({
  label,
  children,
  className = '',
  ...rest
}: { label: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" aria-label={label} className={`inline-flex h-[44px] w-[44px] items-center justify-center ${className}`} {...rest}>
      {children}
    </button>
  );
}
