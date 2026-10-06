# BELLAVE 커머스 사이트 작업지시서 (구조)

이 문서는 사이트의 구조, 페이지, 데이터, 작업 순서를 정의한다.
시각 규칙(컬러, 타이포, 간격, 컴포넌트 스타일)은 `DESIGN_GUIDE.md`를 따른다. 두 문서가 충돌하면 구조는 이 문서, 스타일은 `DESIGN_GUIDE.md`가 우선한다.

## 1. 프로젝트 개요

- 브랜드: BELLAVE(벨라브), 여성 패션 커머스
- 목적: 쇼핑몰 디자인 아키텍처를 빠르게 시연하는 프론트엔드 구축. 실제 DB, 인증, 결제 연동은 이번 범위가 아니다.
- 디자인 방향: ZARA 계열의 미니멀하고 모던한 톤
- 기기 대응: PC, 태블릿, 모바일 반응형
- 구매 정책: 회원 구매만 허용. 장바구니 담기는 비로그인도 가능하고, 구매 버튼을 누를 때 로그인으로 유도한다.

## 2. 기술 스택

- Next.js (App Router), TypeScript
- Tailwind CSS (토큰은 `DESIGN_GUIDE.md` 9장 기준으로 설정)
- Zustand + persist 미들웨어: 장바구니, 위시리스트 (localStorage 저장)
- 데이터: `/data` 폴더의 목업 JSON. 화면은 반드시 `/lib/api.ts`의 조회 함수를 거쳐 데이터를 읽는다. 이후 실제 API로 교체할 때 화면을 수정하지 않기 위함이다.
- 이미지: `next/image` 사용

## 3. 이번 작업 범위 (1차)

| 구분 | 대상 | 처리 |
|---|---|---|
| 구현 | 공통 레이아웃(헤더, 사이드바, 모바일 드로어, 푸터) | 완전 구현 |
| 구현 | 메인, 상품 리스트, 상품 상세, 장바구니(드로어 + 페이지) | 완전 구현 |
| 구현(보여주기용) | 로그인, 커뮤니티 3종 | 로그인: 입력 폼과 안내 메시지만 있고 API 연동 없음. 커뮤니티: 공지 3건, FAQ 3건, 리뷰 3건의 임시 데이터 |
| 자리만 | 주문내역, 마이페이지, 검색 결과 | 제목과 "준비 중" 문구만 있는 페이지. 공통 레이아웃은 적용 |
| 제외 | 결제, 회원가입, 관리자, 실제 인증과 DB | 만들지 않는다 |

## 4. 라우트

| 경로 | 페이지 | 사이드바 |
|---|---|---|
| `/` | 메인 | 없음 |
| `/new-arrivals` | 상품 리스트 (신상품) | 없음 |
| `/shop` | 상품 리스트 (ALL) | SHOP 메뉴 |
| `/shop/[category]` | 상품 리스트 (카테고리) | SHOP 메뉴 |
| `/product/[id]` | 상품 상세 | 없음 |
| `/cart` | 장바구니 | 없음 |
| `/search` | 검색 결과 (자리만) | SHOP 메뉴 |
| `/login` | 로그인 (보여주기용) | 없음 |
| `/order` | 주문내역 (자리만) | 없음 |
| `/mypage` | 마이페이지 (자리만) | 없음 |
| `/community/notice` `/community/faq` `/community/review` | 커뮤니티 (임시 데이터) | COMMUNITY 메뉴 |

카테고리 slug: `outerwear`, `top`, `bottom`, `dresses`, `acc`

## 5. 메뉴 구조

- 1뎁스: `NEW ARRIVALS` / `SHOP` / `COMMUNITY`
  - SHOP 2뎁스: `ALL` / `OUTERWEAR` / `TOP` / `BOTTOM` / `DRESSES` / `ACC`
  - COMMUNITY 2뎁스: `NOTICE` / `FAQ` / `REVIEW`
- 글로벌 메뉴: `LOGIN` / `ORDER` / `CART (n)`
  - 로그인 상태에서는 `LOGIN`이 `MY PAGE`로 바뀐다. 1차에서는 비로그인 상태로 고정한다.
  - 비로그인 상태에서 `ORDER`를 누르면 `/login`으로 이동한다.
- `SHOP`을 누르면 `/shop`으로, `COMMUNITY`를 누르면 `/community/notice`로 이동한다.
- SEARCH는 PC와 태블릿에서 헤더 맨 오른쪽에 둔다(사이드바에는 두지 않는다). 입력 후 Enter를 누르면 `/search?q=검색어`로 이동한다. 모바일은 메뉴 드로어 안에 둔다.

## 6. 폴더 구조

```
/app
  layout.tsx                 공통 레이아웃 (Header, Footer, CartDrawer)
  page.tsx                   메인
  new-arrivals/page.tsx
  shop/page.tsx
  shop/[category]/page.tsx
  product/[id]/page.tsx
  cart/page.tsx
  search/page.tsx
  login/page.tsx
  order/page.tsx
  mypage/page.tsx
  community/[board]/page.tsx
/components
  layout/    Header, Sidebar, MobileDrawer, Footer, PageWithSidebar
  product/   ProductCard, ProductGrid, ProductGallery, ProductInfoPanel,
             StyledWith, RelatedProducts, ReviewList, QnaList
  cart/      CartDrawer, CartItemCard, CartSummary
  home/      LookbookGrid, NewArrivalsSection
  ui/        Button, Accordion, QuantityStepper, Pagination, ColorChip,
             SizeSelector, IconButton
/data        products.json, lookbook.json, reviews.json, qna.json, community.json
/lib         api.ts, format.ts (가격 표기), types.ts
/store       cart.ts, wishlist.ts, ui.ts (드로어 열림 상태)
/public      logo.svg, images/
```

## 7. 데이터 구조

```ts
type Category = 'outerwear' | 'top' | 'bottom' | 'dresses' | 'acc';

interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;              // 정가 (원)
  salePrice?: number;         // 할인가. 없으면 할인 없음
  colors: { name: string; hex: string }[];
  sizes: { label: string; soldOut: boolean }[];
  images: {
    product: string;          // 상품 컷 (리스트 기본 이미지)
    worn: string;             // 착용 컷 (리스트 호버 이미지)
    gallery: string[];        // 상세 상단 갤러리
    detail: string[];         // 상세 본문 이미지
  };
  description: string;        // DETAILS 아코디언
  sizeGuide: string;          // SIZE GUIDE 아코디언
  styledWith: string[];       // 같이 입은 상품 id
  isNew: boolean;
  createdAt: string;
}

interface LookbookItem {
  id: string;
  image: string;
  size: 'normal' | 'large';   // large는 2열 x 2행
  productIds: string[];       // 이 컷에 쓰인 상품
}

interface Lookbook {
  title: string;              // 시즌 타이틀
  description: string;
  items: LookbookItem[];
}

interface Review {
  id: string; productId: string; rating: number;
  content: string; author: string; createdAt: string;
}

interface Qna {
  id: string; productId: string; title: string;
  question: string; answer?: string; author: string; createdAt: string;
}

interface CartItem {
  productId: string; color: string; size: string; quantity: number;
}
```

목업 데이터 분량: 상품 22개(OUTERWEAR 6 / TOP 6 / BOTTOM 4 / DRESSES 4 / ACC 2, 신상품 12개), 룩북 컷 10개, 상품당 리뷰 0~5개, Q&A 0~3개.
실제 이미지가 없는 동안에는 3:4 비율의 회색 임시 이미지를 쓰되, 상품 컷과 착용 컷은 호버 전환이 눈에 보이도록 서로 다른 명도로 구분한다.

## 8. 공통 레이아웃

### Header
- PC: 왼쪽 로고(메인으로 이동), 오른쪽에 1뎁스 3개, 간격을 두고 글로벌 메뉴 3개, 맨 오른쪽 SEARCH 입력. 상단 고정. 배경은 반투명 흰색에 블러(backdrop-blur)를 적용해 아래로 지나가는 콘텐츠가 흐리게 비친다.
- 현재 위치한 1뎁스는 활성 표시.
- CART는 담긴 수량을 함께 표시한다. 누르면 `/cart`로 이동한다.
- 모바일(767px 이하): 왼쪽 햄버거, 가운데 로고, 오른쪽 검색 아이콘과 CART.

### Sidebar (PC, 태블릿)
- 사이드바가 있는 라우트에서만 노출한다(4장 표 참조).
- 구성: 2뎁스 메뉴 목록.
- 현재 메뉴는 활성 표시. 스크롤 시 헤더 아래에 고정.
- `/new-arrivals`에서는 사이드바(모바일은 카테고리 탭)를 노출하지 않는다.

### MobileDrawer
- 햄버거를 누르면 전체 화면으로 열린다.
- 구성: 1뎁스(SHOP, COMMUNITY는 아코디언으로 2뎁스 펼침), 구분선, 글로벌 메뉴, SEARCH 입력.
- 열려 있는 동안 본문 스크롤을 잠근다. 메뉴 이동 시 자동으로 닫힌다.
- 모바일의 상품 리스트(`/shop` 계열)에서는 사이드바 대신 그리드 위에 2뎁스 가로 스크롤 탭을 둔다.

### Footer
- 브랜드명, 사업자 정보(임시 문구), 이용약관, 개인정보처리방침 링크(임시), 저작권 표기.

## 9. 페이지별 정의

### 9-1. 메인 `/`

1. **LookbookGrid**
   - PC 3열 모자이크. `size: 'large'` 컷은 2열 x 2행을 차지한다.
   - 그리드 마지막에 시즌 타이틀 블록(타이틀, 소개 문구)을 둔다.
   - 컷을 누르면 `productIds[0]`의 상세로 이동한다.
   - 모바일 2열, large 컷은 전체 폭.
2. **NewArrivalsSection**
   - 섹션 제목 `NEW ARRIVALS`.
   - 룩북의 `productIds`에 포함된 상품만 중복 없이 노출한다. ProductGrid 재사용.
   - 하단 `VIEW ALL` 버튼은 `/new-arrivals`로 이동한다.

### 9-2. 상품 리스트 `/new-arrivals` `/shop` `/shop/[category]`

하나의 템플릿을 공유한다. 데이터 조건만 다르다.

- `/new-arrivals`: `isNew`가 true인 상품
- `/shop`: 전체
- `/shop/[category]`: 해당 카테고리. 없는 slug는 404.

구성
- 그리드 상단 바: 왼쪽 카테고리명과 상품 수, 오른쪽 정렬 선택(신상품순, 낮은 가격순, 높은 가격순). 정렬 값은 URL 쿼리 `?sort=`에 반영한다.
- ProductGrid: PC 4열, 태블릿 3열, 모바일 2열.
- Pagination: 페이지당 24개, 숫자형. 쿼리 `?page=`에 반영한다.
- 결과가 없으면 안내 문구를 보여준다.

ProductCard
- 구성 순서: 이미지, 상품명, 가격, 컬러 칩.
- 이미지 기본은 상품 컷, 마우스 오버 시 착용 컷으로 페이드 전환(호버 가능한 기기에서만).
- 이미지 우하단 `+` 버튼은 위시리스트 토글. 카드 이동과 분리한다.
- 할인 상품은 정가 취소선과 할인가를 함께 표시한다.
- 카드 전체를 누르면 `/product/[id]`로 이동한다.

### 9-3. 상품 상세 `/product/[id]`

위에서 아래 순서로 배치한다. 페이지 전체의 콘텐츠 폭은 최대 1160px(좌우 여백 포함)로 제한해 PC에서 양옆 여백을 더 둔다.

1. **상단 2단 영역**
   - 왼쪽(약 60%) ProductGallery: `images.gallery`를 좌우 슬라이드. 좌우 화살표, 현재 위치 표시, 모바일은 스와이프.
   - 오른쪽(약 40%) ProductInfoPanel: 스크롤 시 헤더 아래에 고정되고, 상단 2단 영역이 끝나면 고정이 풀린다.
2. **ProductInfoPanel 내부 순서**
   1. 상품명
   2. 가격 (할인 시 정가 취소선, 할인가, 할인율)
   3. 컬러 선택
   4. 사이즈 선택 (품절 사이즈는 선택 불가)
   5. 수량, 합계 금액
   6. `BUY NOW` / `ADD TO CART` / 위시리스트(하트)
   7. 아코디언: `DETAILS` / `SIZE GUIDE` / `DELIVERY & RETURNS`
   8. `STYLED WITH`: 같이 입은 상품 썸네일 2~4개. 누르면 해당 상세로 이동. `styledWith`가 비어 있으면 섹션을 숨긴다.
3. **상세 본문**: `images.detail`을 순서대로 나열. 1열 전체 폭과 2열 배치를 섞는다.
4. **RELATED PRODUCTS**: 같은 카테고리의 다른 상품 4개. ProductCard 재사용.
5. **REVIEW**: 평균 별점과 개수, 목록(별점, 내용, 작성자, 날짜), 5개씩 페이지네이션. 없으면 안내 문구.
6. **Q&A**: 제목 목록, 누르면 질문과 답변 펼침. 없으면 안내 문구.

동작
- 컬러와 사이즈를 선택하지 않고 구매 버튼을 누르면 해당 선택 영역 아래에 안내 문구를 표시한다.
- `ADD TO CART`: 장바구니에 추가하고 CartDrawer를 연다.
- `BUY NOW`: 장바구니에 추가하고 `/login`으로 이동한다(1차 기준).
- 모바일: 갤러리 아래에 정보 패널이 이어지고, `BUY NOW`와 `ADD TO CART`는 화면 하단에 고정한다.
- 없는 id는 404.

### 9-4. 장바구니

**CartDrawer (담기 직후)**
- 화면 오른쪽에서 슬라이드로 열린다. 뒤 배경은 어둡게 처리하고 본문 스크롤을 잠근다.
- 상단: `ADD TO CART (총 수량)`, 닫기 버튼.
- 본문: 담긴 상품 목록(썸네일, 상품명, 옵션, 수량, 가격). 방금 담은 상품이 맨 위. 길어지면 본문만 스크롤.
- 하단 고정: `장바구니 바로가기`(→ `/cart`), `구매하기`(→ `/login`).
- 닫기: 닫기 버튼, 배경 클릭, ESC.

**장바구니 페이지 `/cart`**
- 상단: 페이지 제목, 전체 선택 체크박스, 선택 삭제.
- 본문: CartItemCard를 가로로 나열(PC 5열, 태블릿 3열, 모바일 2열).
  - 카드 구성: 체크박스(이미지 좌상단), 이미지, 상품명, 위시리스트(하트), 삭제(x), 가격, 옵션(컬러/사이즈), 수량 조절.
  - 수량 최소 1. 이미지와 상품명을 누르면 상세로 이동.
- 하단 CartSummary: 구분선 아래 왼쪽 `TOTAL PRICE`(선택한 상품 합계), 오른쪽 `SELECT ORDER`(선택 상품 주문), `ALL ORDER`(전체 주문). 둘 다 1차에서는 `/login`으로 이동.
- 선택한 상품이 없으면 `SELECT ORDER`는 비활성.
- 빈 장바구니: 안내 문구와 `SHOP` 이동 버튼.

## 10. 상태 관리

- `store/cart.ts`: items, add(같은 상품, 컬러, 사이즈면 수량 합산), remove, updateQuantity, clear, 총 수량과 총 금액 계산. persist 적용.
- `store/wishlist.ts`: productIds, toggle. persist 적용.
- `store/ui.ts`: cartDrawerOpen, mobileDrawerOpen.
- persist 사용으로 인한 서버와 클라이언트 렌더 불일치(hydration)가 없도록 처리한다. 헤더의 CART 수량 포함.

## 11. 작업 순서

각 단계가 끝나면 PC(1440px)와 모바일(375px)에서 확인한 뒤 다음으로 넘어간다.

1. 프로젝트 생성, Tailwind 토큰 설정, 폰트, 전역 스타일
2. 타입, 목업 데이터, `lib/api.ts`
3. ui 컴포넌트 (Button, Accordion, QuantityStepper, Pagination 등)
4. Header, Sidebar, MobileDrawer, Footer, 자리만 있는 페이지
5. ProductCard, ProductGrid, 상품 리스트 페이지
6. 상품 상세 페이지
7. 장바구니 스토어, CartDrawer, 장바구니 페이지
8. 메인 페이지
9. 반응형, 접근성, 빈 상태와 404 점검

## 12. 완료 기준

- 메인 → 리스트 → 상세 → 담기(드로어) → 장바구니 페이지 흐름이 끊김 없이 동작한다.
- 모든 메뉴 링크가 실제 페이지로 연결된다(404 없음).
- 새로고침해도 장바구니와 위시리스트가 유지된다.
- 375px, 768px, 1024px, 1440px, 1920px에서 레이아웃이 깨지지 않고 가로 스크롤이 생기지 않는다.
- 색상, 간격, 글자 크기를 임의 값으로 쓰지 않고 `DESIGN_GUIDE.md`의 토큰만 사용한다.
- 키보드만으로 메뉴 이동, 드로어 열고 닫기, 옵션 선택이 가능하다.
- 콘솔 오류와 타입 오류가 없다.
