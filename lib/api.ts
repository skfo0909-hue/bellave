// 화면은 반드시 이 파일의 함수를 거쳐 데이터를 읽는다. 실제 API로 교체할 때 이 파일만 바꾼다.
import productsData from '@/data/products.json';
import lookbookData from '@/data/lookbook.json';
import reviewsData from '@/data/reviews.json';
import qnaData from '@/data/qna.json';
import communityData from '@/data/community.json';
import type { Category, CommunityReview, Faq, Lookbook, Notice, Product, ProductSummary, Qna, Review, SortKey } from './types';

const products = productsData as Product[];
const lookbook = lookbookData as Lookbook;
const reviews = reviewsData as Review[];
const qna = qnaData as Qna[];
const community = communityData as { notice: Notice[]; faq: Faq[]; review: CommunityReview[] };

export const PAGE_SIZE = 24;

export interface ProductQuery {
  scope: 'new' | 'all' | Category;
  sort?: SortKey;
  page?: number;
}

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
}

const price = (p: Product) => p.salePrice ?? p.price;

export async function getProducts({ scope, sort = 'new', page = 1 }: ProductQuery): Promise<ProductPage> {
  let list = products.filter((p) => (scope === 'new' ? p.isNew : scope === 'all' ? true : p.category === scope));
  list = [...list].sort((a, b) => {
    if (sort === 'price-asc') return price(a) - price(b);
    if (sort === 'price-desc') return price(b) - price(a);
    return b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id);
  });
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  return { items: list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE), total, page: current, totalPages };
}

export async function getProduct(id: string): Promise<Product | undefined> {
  return products.find((p) => p.id === id);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  return ids.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => Boolean(p));
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit);
}

export async function getProductSummaries(): Promise<Record<string, ProductSummary>> {
  return Object.fromEntries(
    products.map((p) => [p.id, { id: p.id, name: p.name, price: p.price, salePrice: p.salePrice, image: p.images.product }]),
  );
}

export async function getLookbook(): Promise<Lookbook> {
  return lookbook;
}

/** 룩북에 쓰인 상품을 중복 없이 반환 */
export async function getLookbookProducts(): Promise<Product[]> {
  const ids = [...new Set(lookbook.items.flatMap((i) => i.productIds))];
  return getProductsByIds(ids);
}

export async function getReviews(productId: string): Promise<Review[]> {
  return reviews.filter((r) => r.productId === productId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getQna(productId: string): Promise<Qna[]> {
  return qna.filter((q) => q.productId === productId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getNotices(): Promise<Notice[]> {
  return [...community.notice].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getFaqs(): Promise<Faq[]> {
  return community.faq;
}

export async function getCommunityReviews(): Promise<CommunityReview[]> {
  return [...community.review].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
