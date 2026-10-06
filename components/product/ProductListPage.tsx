import { PageWithSidebar } from '@/components/layout/PageWithSidebar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { getProducts, type ProductQuery } from '@/lib/api';
import type { SortKey } from '@/lib/types';
import { CategoryTabs } from './CategoryTabs';
import { ProductGrid } from './ProductGrid';
import { SortSelect } from './SortSelect';

const SORTS: SortKey[] = ['new', 'price-asc', 'price-desc'];

export function parseListParams(sp: { sort?: string; page?: string }): { sort: SortKey; page: number } {
  const sort = SORTS.includes(sp.sort as SortKey) ? (sp.sort as SortKey) : 'new';
  const page = Math.max(1, parseInt(sp.page ?? '1', 10) || 1);
  return { sort, page };
}

/** /new-arrivals, /shop, /shop/[category]가 공유하는 리스트 템플릿 */
export async function ProductListPage({
  title,
  basePath,
  scope,
  sp,
  showMenu = true,
}: {
  title: string;
  basePath: string;
  scope: ProductQuery['scope'];
  sp: { sort?: string; page?: string };
  showMenu?: boolean; // false면 왼쪽 카테고리(사이드바, 모바일 탭)를 노출하지 않는다
}) {
  const { sort, page } = parseListParams(sp);
  const result = await getProducts({ scope, sort, page });
  const hrefFor = (p: number) => {
    const q = new URLSearchParams();
    if (sort !== 'new') q.set('sort', sort);
    if (p > 1) q.set('page', String(p));
    const s = q.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  const content = (
      <div className="pt-4 md:pt-6">
        {showMenu && <CategoryTabs />}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-section uppercase">
            {title} <span className="text-gray-600">({result.total})</span>
          </h1>
          <SortSelect value={sort} />
        </div>
        {result.items.length === 0 ? (
          <EmptyState message="등록된 상품이 없습니다." href="/shop" cta="SHOP" />
        ) : (
          <>
            <ProductGrid products={result.items} priorityCount={4} />
            <Pagination page={result.page} totalPages={result.totalPages} hrefFor={hrefFor} />
          </>
        )}
      </div>
  );

  return showMenu ? (
    <PageWithSidebar menu="shop">{content}</PageWithSidebar>
  ) : (
    <div className="page-x mx-auto max-w-page pb-30">{content}</div>
  );
}
