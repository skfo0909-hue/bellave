import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = { title: 'LOGIN' };

export default function Page() {
  return (
    <div className="page-x mx-auto max-w-[1160px] pb-30 pt-8 md:pt-16">
      <LoginForm />
    </div>
  );
}
