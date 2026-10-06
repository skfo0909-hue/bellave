import Image from 'next/image';
import Link from 'next/link';

// 로고는 변형하지 않는다. SVG 준비 전까지 제공된 PNG를 임시 사용. 비율 1704:586
export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" aria-label="BELLAVE 홈" onClick={onClick} className="flex items-center p-2">
      <Image src="/logo.png" alt="BELLAVE" width={1704} height={586} priority className="h-[32px] w-auto bg-transparent lg:h-[44px]" />
    </Link>
  );
}
