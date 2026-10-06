import Link from 'next/link';

export function Footer() {
  return (
    <footer className="page-x mx-auto max-w-page border-t border-gray-200 pb-12 pt-10 text-micro text-gray-600">
      <p className="section-title text-black">BELLAVE</p>
      <p className="mt-4">상호명: BELLAVE (임시) · 대표자: 홍길동 · 사업자등록번호: 000-00-00000</p>
      <p>통신판매업신고: 제0000-서울-0000호 · 주소: 서울특별시 (임시 주소) · 고객센터: 000-0000-0000</p>
      <ul className="mt-4 flex gap-4">
        <li>
          <Link href="#" className="inline-flex min-h-[44px] items-center hover:underline">
            이용약관
          </Link>
        </li>
        <li>
          <Link href="#" className="inline-flex min-h-[44px] items-center hover:underline">
            개인정보처리방침
          </Link>
        </li>
      </ul>
      <p className="mt-2">© 2026 BELLAVE. All rights reserved.</p>
    </footer>
  );
}
