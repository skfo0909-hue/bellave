export type Category = 'outerwear' | 'top' | 'bottom' | 'dresses' | 'acc';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number; // 정가 (원)
  salePrice?: number; // 할인가. 없으면 할인 없음
  colors: { name: string; hex: string }[];
  sizes: { label: string; soldOut: boolean }[];
  images: {
    product: string; // 상품 컷 (리스트 기본 이미지)
    worn: string; // 착용 컷 (리스트 호버 이미지)
    gallery: string[]; // 상세 상단 갤러리
    detail: string[]; // 상세 본문 이미지
  };
  description: string; // DETAILS 아코디언
  sizeGuide: string; // SIZE GUIDE 아코디언
  styledWith: string[]; // 같이 입은 상품 id
  isNew: boolean;
  hiddenInShop?: boolean; // true면 SHOP 목록과 관련 상품에서 숨긴다 (룩북 전용 상품)
  createdAt: string;
}

export interface LookbookImage {
  src: string;
  alt: string;
  productIds: string[]; // 이 컷에 쓰인 상품
  poster?: string; // src가 영상일 때 로딩 전, 모션 줄이기 설정에서 보여줄 이미지
}

export interface LookbookChapter {
  id: string;
  layout: 'split' | 'duo'; // split: 이미지 1장 + 여백, duo: 이미지 2장
  title: string; // 스크립트 대형 타이틀 (예: Reverie)
  subtitle: string; // 스크립트 소형 (예: New Collection)
  label: string; // 예: FW26 · CHAPTER 01
  description: string; // 영문 설명
  descriptionKo: string; // 국문 설명
  productsTitle: string; // 예: SHOP THE LOOK — REVERIE
  images: LookbookImage[]; // split 1장, duo 2장
}

export type Lookbook = LookbookChapter[];

export interface Review {
  id: string;
  productId: string;
  rating: number;
  content: string;
  author: string;
  createdAt: string;
}

export interface Qna {
  id: string;
  productId: string;
  title: string;
  question: string;
  answer?: string;
  author: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  color: string;
  size: string;
  quantity: number;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface CommunityReview {
  id: string;
  productId: string;
  rating: number;
  content: string;
  author: string;
  createdAt: string;
}

/** 클라이언트 컴포넌트(장바구니 등)가 상품 정보를 읽을 때 쓰는 요약 */
export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
}

export type SortKey = 'new' | 'price-asc' | 'price-desc';
