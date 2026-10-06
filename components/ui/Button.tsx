import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'text';
type Size = 'md' | 'sm';

const base = 'inline-flex items-center justify-center text-label uppercase transition-colors duration-200 disabled:cursor-not-allowed';
const variants: Record<Variant, string> = {
  primary: 'bg-black text-white hover:bg-ink disabled:bg-gray-200 disabled:text-gray-400',
  secondary: 'border border-black bg-white text-black hover:bg-black hover:text-white disabled:border-gray-200 disabled:bg-white disabled:text-gray-400',
  text: 'text-black hover:underline disabled:text-gray-400 disabled:no-underline',
};
const sizes: Record<Size, string> = { md: 'h-[48px] px-6', sm: 'h-[40px] px-6' };

interface Common {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function buttonClass({ variant = 'primary', size = 'md', className = '' }: Omit<Common, 'children'>) {
  return `${base} ${variants[variant]} ${variant === 'text' ? '' : sizes[size]} ${className}`;
}

export function Button({ variant, size, className, children, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={buttonClass({ variant, size, className })} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({ href, variant, size, className, children, onClick }: Common & { href: string; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className={buttonClass({ variant, size, className })}>
      {children}
    </Link>
  );
}
