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
    worn?: string; // 착용 컷 (리스트 호버 이미지). 없으면 호버 전환 없음
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
  src: string; // public/images/lookbook/ 의 파일
  alt: string;
  width: number; // 원본 크기 (큰 컷 자리 판정, next/image 용)
  height: number;
  productIds?: string[]; // 연결된 상품 (선택)
}

export interface LookbookChapter {
  id: string;
  title: string; // 키 타이틀, 대문자 한 단어 (예: OCTOBER)
  subline: string; // 서브 라인 (예: FW26, SEOUL)
  copy: string; // 키 카피 영문
  copyKo: string; // 키 카피 국문
  productsTitle: string; // 예: SHOP THE LOOK — OCTOBER
  seed: number; // 무작위 순서 결정 값
  pinLarge?: string[]; // 큰 컷으로 고정할 파일명 (최대 2)
  images: LookbookImage[]; // 섞인 뒤의 순서로 12컷. 5번째, 10번째가 큰 컷
  productIds: string[]; // 섞인 뒤의 순서로 상품 8개
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
