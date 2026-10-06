import { ButtonLink } from '@/components/ui/Button';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/format';

export function CartSummary({ total, selectedCount }: { total: number; selectedCount: number }) {
  return (
    <div className="mt-16 flex flex-col gap-6 border-t border-gray-200 pt-6 md:flex-row md:items-center md:justify-between">
      <p className="flex items-baseline gap-4">
        <span className="text-section uppercase">Total Price</span>
        <span className="text-title">{formatPrice(total)}</span>
      </p>
      {/* 1차: 두 버튼 모두 로그인으로 이동 */}
      <div className="flex gap-2">
        {selectedCount === 0 ? (
          <Button variant="secondary" disabled className="flex-1 md:w-[200px] md:flex-none">
            SELECT ORDER
          </Button>
        ) : (
          <ButtonLink href="/login" variant="secondary" className="flex-1 md:w-[200px] md:flex-none">
            SELECT ORDER
          </ButtonLink>
        )}
        <ButtonLink href="/login" className="flex-1 md:w-[200px] md:flex-none">
          ALL ORDER
        </ButtonLink>
      </div>
    </div>
  );
}
