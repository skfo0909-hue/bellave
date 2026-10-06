import { EmptyState } from '@/components/ui/EmptyState';

export default function NotFound() {
  return (
    <div className="page-x mx-auto max-w-page">
      <EmptyState message="페이지를 찾을 수 없습니다." href="/" cta="HOME" />
    </div>
  );
}
