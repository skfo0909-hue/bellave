import { discountRate, formatPrice } from '@/lib/format';

// 할인가도 검정으로 표기, 정가 취소선은 gray-600
export function PriceText({ price, salePrice, showRate = false }: { price: number; salePrice?: number; showRate?: boolean }) {
  const rate = discountRate({ price, salePrice });
  if (!salePrice || rate === null) return <span>{formatPrice(price)}</span>;
  return (
    <span className="inline-flex items-baseline gap-2">
      <s className="text-gray-600">{formatPrice(price)}</s>
      <span>{formatPrice(salePrice)}</span>
      {showRate && <span className="text-micro">{rate}%</span>}
    </span>
  );
}
