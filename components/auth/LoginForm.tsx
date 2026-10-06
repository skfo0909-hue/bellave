'use client';
import { useId, useState } from 'react';
import { Button } from '@/components/ui/Button';

// 보여주기용 로그인 화면. 실제 인증/API 연동은 없다.
export function LoginForm() {
  const id = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keep, setKeep] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setMessage({ text: '이메일과 비밀번호를 입력해 주세요.', error: true });
      return;
    }
    setMessage({ text: '데모 화면입니다. 로그인은 아직 연결되어 있지 않습니다.', error: false });
  };

  return (
    <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-30">
      <form onSubmit={submit} noValidate aria-labelledby={`${id}-title`}>
        <h1 id={`${id}-title`} className="text-title uppercase">
          LOGIN
        </h1>
        <div className="mt-8 flex flex-col gap-6">
          <div>
            <label htmlFor={`${id}-email`} className="text-label uppercase text-gray-600">
              이메일
            </label>
            <input id={`${id}-email`} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="underline-input" />
          </div>
          <div>
            <label htmlFor={`${id}-pw`} className="text-label uppercase text-gray-600">
              비밀번호
            </label>
            <input id={`${id}-pw`} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="underline-input" />
          </div>
        </div>

        <label className="mt-4 flex min-h-[44px] cursor-pointer items-center gap-2 text-caption">
          <input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} className="peer sr-only" />
          <span className="flex h-[16px] w-[16px] items-center justify-center border border-black bg-white text-white peer-checked:bg-black peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-black">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" className={keep ? '' : 'hidden'}>
              <path d="M1.5 5.2l2.4 2.3L8.5 2.5" />
            </svg>
          </span>
          로그인 상태 유지
        </label>

        <p role="status" className={`mt-2 min-h-[22px] text-caption ${message?.error ? 'text-error' : 'text-gray-600'}`}>
          {message?.text}
        </p>

        <Button type="submit" className="mt-4 w-full">
          LOGIN
        </Button>

        <ul className="mt-4 flex gap-4 text-caption text-gray-600">
          <li>
            <button type="button" className="inline-flex min-h-[44px] items-center hover:text-black hover:underline">
              이메일 찾기
            </button>
          </li>
          <li>
            <button type="button" className="inline-flex min-h-[44px] items-center hover:text-black hover:underline">
              비밀번호 찾기
            </button>
          </li>
        </ul>
      </form>

      <section aria-labelledby={`${id}-join`} className="md:border-l md:border-gray-200 md:pl-16 lg:pl-30">
        <h2 id={`${id}-join`} className="text-title uppercase">
          JOIN
        </h2>
        <p className="mt-4 text-body text-gray-600">회원이 되시면 주문 내역 조회와 위시리스트 관리, 회원 전용 구매가 가능합니다.</p>
        <Button variant="secondary" disabled className="mt-8 w-full">
          회원가입 (준비 중)
        </Button>
      </section>
    </div>
  );
}
