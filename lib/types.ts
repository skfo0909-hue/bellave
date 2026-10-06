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
  createdAt: string;
}

export interface LookbookItem {
  id: string;
  image: string;
  size: 'normal' | 'large'; // large는 2열 x 2행
  productIds: string[]; // 이 컷에 쓰인 상품
}

export interface Lookbook {
  title: string; // 시즌 타이틀
  description: string;
  items: LookbookItem[];
}

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
