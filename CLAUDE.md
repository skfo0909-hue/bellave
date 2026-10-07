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
- 모션: `motion` (Framer Motion). 메인 룩북의 스크롤 연출에만 사용한다.

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
  home/      LookbookScene (split, duo), ScriptTitle, LookbookProducts
  ui/        Button, Accordion, QuantityStepper, Pagination, ColorChip,
             SizeSelector, IconButton
/data        products.json, lookbook.json, reviews.json, qna.json, community.json
/lib         api.ts, format.ts (가격 표기), types.ts
/store       cart.ts, wishlist.ts, ui.ts (드로어 열림 상태)
/public      logo.svg, images/ (lookbook/ 화보, products/ 상품 컷, ph/ 회색 임시 이미지)
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

interface LookbookImage {
  src: string;
  alt: string;
  productIds: string[];       // 이 컷에 쓰인 상품
  poster?: string;            // src가 영상일 때의 대체 이미지
}

interface LookbookChapter {
  id: string;
  layout: 'split' | 'duo';    // split: 이미지 1장 + 여백, duo: 이미지 2장
  title: string;              // 스크립트 대형 타이틀 (예: Reverie)
  subtitle: string;           // 스크립트 소형 (예: New Collection)
  label: string;              // 예: FW26 · CHAPTER 01
  description: string;        // 영문 설명
  descriptionKo: string;      // 국문 설명
  productsTitle: string;      // 예: SHOP THE LOOK — REVERIE
  images: LookbookImage[];    // split 1장, duo 2장
}

type Lookbook = LookbookChapter[];

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

목업 데이터 분량: 상품 13개(OUTERWEAR 2 / TOP 6 / BOTTOM 2 / DRESSES 2 / ACC 1, 신상품 6개 = 룩북 챕터에 연결된 상품), 룩북 챕터 2개(챕터 01 상품 4개, 챕터 02 상품 2개 연결), 상품당 리뷰 0~5개, Q&A 0~3개.
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

화보 이미지와 스크립트 타이포가 겹쳐지는 에디토리얼 구성이다. 챕터 2개가 `룩북 → 상품 리스트 → 룩북 → 상품 리스트` 순서로 이어진다. 모션의 수치와 타이포 규칙은 `DESIGN_GUIDE.md` 3장, 10장을 따른다.

**섹션 순서**

| 순서 | 섹션 | 컴포넌트 | 내용 |
|---|---|---|---|
| 1 | 룩북 01 | LookbookScene (`layout: 'split'`) | 타이틀 `Reverie` |
| 2 | 상품 리스트 01 | LookbookProducts | 룩북 01에 쓰인 상품 |
| 3 | 룩북 02 | LookbookScene (`layout: 'duo'`) | 타이틀 `Nocturne` |
| 4 | 상품 리스트 02 | LookbookProducts | 룩북 02에 쓰인 상품, 마지막에 `VIEW ALL` |

**타이틀 텍스트 (lookbook.json 기본값)**

| 항목 | 룩북 01 | 룩북 02 |
|---|---|---|
| 타이틀 (스크립트) | Reverie | Nocturne |
| 서브 타이틀 (스크립트, 작게) | New Collection | Evening Edit |
| 라벨 | FW26 · CHAPTER 01 | FW26 · CHAPTER 02 |
| 설명 (영문) | A quiet afternoon, softened in wool and light. Pieces made to move slowly through the season. | After dusk, the line grows sharper. Black, satin and a single gleam of gold. |
| 설명 (국문, 모바일과 대체 텍스트용) | 느린 오후의 빛, 울과 니트로 부드럽게 흐르는 실루엣. | 해가 진 뒤 더 선명해지는 선. 블랙과 새틴, 한 점의 골드. |
| 상품 리스트 제목 | SHOP THE LOOK — REVERIE | SHOP THE LOOK — NOCTURNE |

**LookbookScene: split 레이아웃 (룩북 01)**
- 한 화면(뷰포트 높이에서 헤더 제외)을 채운다.
- 왼쪽 약 60%: 화보 1장. 이미지 또는 mp4 영상(룩북 01은 영상: 무음, 자동 재생, 반복, 화면 밖에서는 일시정지, 모션 줄이기에서는 포스터 이미지). 화면 왼쪽 여백부터 시작해 위아래를 채운다.
- 오른쪽 약 40%: 흰 여백. 세로 가운데에 서브 타이틀과 설명을 가운데 정렬로 둔다(폭 최대 280px). 상단에 라벨.
- 타이틀: 화면 오른쪽 아래에 크게 놓고, 왼쪽 끝이 이미지 위로 겹쳐지게 한다.
- 모바일: 이미지 전체 폭(4:5), 타이틀이 이미지 하단에 절반 걸치고, 그 아래 라벨, 서브 타이틀, 국문 설명.

**LookbookScene: duo 레이아웃 (룩북 02)**
- 한 화면을 채운다. 이미지 2장을 좌우 50%씩 여백 없이 붙이고, 가운데 1px 세로 라인.
- 타이틀: 두 이미지의 경계 위에 가운데 정렬로 크게 겹친다.
- 타이틀 바로 아래에 흰색 카드(폭 280px, 1px 검정 테두리)를 겹쳐 놓고, 안에 라벨, 서브 타이틀, 설명.
- 모바일: 이미지 2장을 세로로 쌓고(각 4:5), 타이틀은 두 이미지 경계에 겹침, 카드는 두 번째 이미지 아래 일반 흐름으로.

**공통 동작**
- 씬의 이미지를 누르면 해당 이미지 `productIds[0]`의 상세로 이동한다.
- 타이틀은 이미지 위에 겹쳐도 클릭을 가로막지 않는다(`pointer-events: none`).
- 타이틀은 장식 텍스트가 아니라 섹션 제목(`h2`)으로 마크업한다.

**LookbookProducts**
- 상단: 왼쪽 상품 리스트 제목, 오른쪽 상품 수.
- 해당 챕터의 모든 이미지 `productIds`를 중복 없이 모아 노출한다. ProductGrid 재사용(PC 4열). 상품 수는 챕터 01이 4개, 챕터 02가 2개.
- 상품 리스트 02 아래에만 `VIEW ALL` 버튼(→ `/new-arrivals`).

**스크롤 모션 구현**
- 라이브러리: `motion` (Framer Motion)의 `useScroll`, `useTransform`, `whileInView` 사용.
- PC(1024px 이상): 각 LookbookScene은 높이 200vh의 바깥 래퍼 안에 `position: sticky` 100vh 씬을 두어, 스크롤 100vh 동안 화면이 고정된 채 연출이 진행된다. 진행도(0~1)는 `useScroll({ target, offset: ['start start', 'end end'] })`로 얻는다.
- 첫 번째 룩북(`Reverie`)만 PC에서 로드 시 진행도 0 → 0.8을 시간(1.4초)으로 자동 재생하고, 이후 스크롤이 0.8 → 1을 이어받는다. 첫 화면이 비어 보이지 않게 하기 위함이며 `DESIGN_GUIDE.md` 10장의 구간 수치는 그대로다.
- 태블릿, 모바일: 고정 없음. 뷰포트 진입 시 한 번 재생되는 단순 등장으로 대체한다.
- `prefers-reduced-motion`: 모든 연출을 끄고 최종 상태로 바로 보여준다.
- 모션은 `transform`과 `opacity`만 사용한다. 레이아웃 속성은 애니메이션하지 않는다.
- 스크롤 가로채기(스냅, 휠 하이재킹)는 쓰지 않는다. 브라우저 기본 스크롤을 유지한다.

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
- 할인 상품은 정가 취소선과 할인가를 함께 표시한다.
- 카드 전체를 누르면 `/product/[id]`로 이동한다.

### 9-3. 상품 상세 `/product/[id]`

위에서 아래 순서로 배치한다. 페이지 전체의 콘텐츠 폭은 최대 1360px(좌우 여백 포함)로 제한해 PC에서 양옆 여백을 더 둔다.

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
- 메인 룩북의 스크롤 연출이 PC에서 끊김 없이 동작하고, 모바일과 모션 줄이기 설정에서는 단순 등장으로 대체된다.
- 콘솔 오류와 타입 오류가 없다.
