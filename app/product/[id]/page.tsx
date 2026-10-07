import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DetailImages } from '@/components/product/DetailImages';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductInfoPanel } from '@/components/product/ProductInfoPanel';
import { QnaList } from '@/components/product/QnaList';
import { ReviewList } from '@/components/product/ReviewList';
import { getProduct, getProductsByIds, getQna, getRelatedProducts, getReviews } from '@/lib/api';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = await getProduct(params.id);
  return { title: p?.name };
}

const section = 'mt-16 md:mt-20 lg:mt-30';
const heading = 'section-title mb-6 lg:mb-8';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();
  const [styledWith, related, reviews, qna] = await Promise.all([
    getProductsByIds(product.styledWith),
    getRelatedProducts(product, 4),
    getReviews(product.id),
    getQna(product.id),
  ]);

  return (
    <div className="page-x mx-auto max-w-[1160px] pb-30">
      {/* 상단 2단: 정보 패널은 헤더 아래에 고정되고 이 영역이 끝나면 풀린다 */}
      <div className="pt-4 md:grid md:grid-cols-[3fr_2fr] md:items-start md:pt-6">
        <ProductGallery images={product.images.gallery} name={product.name} />
        <div className="md:sticky md:top-[56px] md:z-side lg:top-[80px]">
          <ProductInfoPanel product={product} styledWith={styledWith} />
        </div>
      </div>

      {product.images.detail.length > 0 && (
        <section className={section} aria-label="상품 상세">
          <DetailImages images={product.images.detail} name={product.name} />
        </section>
      )}

      {related.length > 0 && (
        <section className={section} aria-labelledby="related">
          <h2 id="related" className={heading}>
            Related Products
          </h2>
          <ProductGrid products={related} />
        </section>
      )}

      <section className={section} aria-labelledby="review">
        <h2 id="review" className={heading}>
          Review
        </h2>
        <ReviewList reviews={reviews} />
      </section>

      <section className={section} aria-labelledby="qna">
        <h2 id="qna" className={heading}>
          Q&amp;A
        </h2>
        <QnaList items={qna} />
      </section>
    </div>
  );
}
