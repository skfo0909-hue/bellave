// 목업 데이터와 3:4 회색 임시 이미지를 생성한다. 실행: node scripts/generate-data.mjs
import { writeFileSync, mkdirSync } from 'node:fs';

mkdirSync('data', { recursive: true });
mkdirSync('public/images/ph', { recursive: true });

// ---------- 임시 이미지 (상품 컷은 밝게, 착용 컷은 어둡게) ----------
const tones = {
  product: ['#F2F2F0', 'PRODUCT'],
  'worn-1': ['#CFCFCB', 'WORN 1'],
  'worn-2': ['#BDBDB9', 'WORN 2'],
  'worn-3': ['#D9D9D5', 'WORN 3'],
  'gallery-1': ['#E3E3DF', 'GALLERY 1'],
  'gallery-2': ['#D2D2CE', 'GALLERY 2'],
  'gallery-3': ['#C4C4C0', 'GALLERY 3'],
  'gallery-4': ['#DADAD6', 'GALLERY 4'],
  'detail-1': ['#E8E8E4', 'DETAIL 1'],
  'detail-2': ['#D6D6D2', 'DETAIL 2'],
  'detail-3': ['#CACAC6', 'DETAIL 3'],
  'detail-4': ['#DEDEDA', 'DETAIL 4'],
  'look-1': ['#C9C9C5', 'LOOK 1'],
  'look-2': ['#D4D4D0', 'LOOK 2'],
  'look-3': ['#BFBFBB', 'LOOK 3'],
  'look-4': ['#DCDCD8', 'LOOK 4'],
  'look-5': ['#C2C2BE', 'LOOK 5'],
};
for (const [name, [fill, label]] of Object.entries(tones)) {
  writeFileSync(
    `public/images/ph/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800"><rect width="600" height="800" fill="${fill}"/><text x="300" y="404" text-anchor="middle" font-family="sans-serif" font-size="14" letter-spacing="2" fill="#9A9A96">${label}</text></svg>\n`,
  );
}
const img = (n) => `/images/ph/${n}.svg`;

// ---------- PRNG ----------
let seed = 20261006;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const pad = (n, w = 2) => String(n).padStart(w, '0');

// ---------- 상품 ----------
const palette = [
  { name: 'Black', hex: '#111111' },
  { name: 'Ivory', hex: '#F4F1EA' },
  { name: 'Beige', hex: '#D8C7AE' },
  { name: 'Camel', hex: '#B58B5A' },
  { name: 'Navy', hex: '#1F2A44' },
  { name: 'Grey', hex: '#8C8C8C' },
  { name: 'Khaki', hex: '#6B6B4F' },
  { name: 'Burgundy', hex: '#6E1F2B' },
];
// 실제 이미지는 public/images/products, lookbook에 있고 아래 정의에서 상품에 연결한다.
// SHOP 6개: OUTERWEAR 2 / TOP 2 / BOTTOM 1 / DRESSES 1 / ACC 0
// 룩북 전용 5개(hiddenInShop): SHOP 목록에는 나오지 않고, 룩북과 NEW ARRIVALS에서 상세로 연결된다.
const P = (f) => `/images/products/${f}.jpg`;
const pair = (slug) => ({ product: P(`${slug}-product`), worn: P(`${slug}-worn`), gallery: [P(`${slug}-worn`), P(`${slug}-product`)], detail: [] });
const single = (slug) => ({ product: P(slug), worn: P(slug), gallery: [P(slug)], detail: [] }); // 컷이 1장뿐인 상품
const biker = (k) => P(`faux-leather-biker-jacket-${k}`);
const defs = [
  {
    id: 'p01', cat: 'outerwear', name: 'Faux Leather Biker Jacket', colors: [{ name: 'Brown', hex: '#5B4A3A' }],
    images: { product: biker('front'), worn: biker('worn'), gallery: ['worn', 'front', 'back', 'detail'].map(biker), detail: ['detail', 'back', 'front'].map(biker) },
  },
  { id: 'p02', cat: 'outerwear', name: 'Frayed Hem Cropped Jacket', colors: [{ name: 'Black', hex: '#111111' }], images: pair('frayed-hem-cropped-jacket') },
  { id: 'p03', cat: 'top', name: 'Fine Knit V-Neck Top', colors: [{ name: 'Black', hex: '#111111' }], images: pair('fine-knit-v-neck-top') },
  { id: 'p04', cat: 'top', name: 'Hooded Knit Top', colors: [{ name: 'Navy', hex: '#1F2A44' }], images: pair('hooded-knit-top') },
  { id: 'p05', cat: 'bottom', name: 'Black Flare Pants', colors: [{ name: 'Black', hex: '#111111' }], images: pair('black-flare-pants') },
  { id: 'p06', cat: 'dresses', name: 'Pinstripe Mini Skirt', colors: [{ name: 'Charcoal', hex: '#5E5E5E' }], images: pair('pinstripe-mini-skirt') },
  // 룩북 전용
  { id: 'p07', cat: 'bottom', name: 'Washed Flare Jeans', colors: [{ name: 'Indigo', hex: '#4A6B8A' }], images: pair('washed-flare-jeans') },
  { id: 'p08', cat: 'bottom', name: 'Satin Midi Skirt', colors: [{ name: 'Black', hex: '#111111' }, { name: 'Brown', hex: '#4A2B26' }], images: pair('satin-midi-skirt') },
  { id: 'p09', cat: 'bottom', name: 'Washed Wide Leg Jeans', colors: [{ name: 'Charcoal', hex: '#3A3F44' }], images: pair('washed-wide-leg-jeans') },
  { id: 'p10', cat: 'outerwear', name: 'Faux Leather Funnel Jacket', colors: [{ name: 'Brown', hex: '#3E2A22' }], images: single('faux-leather-funnel-jacket') },
  { id: 'p11', cat: 'outerwear', name: 'Hooded Zip-Up Jacket', colors: [{ name: 'Navy', hex: '#1F2A44' }], images: single('hooded-zip-up-jacket') },
];
const priceBase = { outerwear: [159000, 329000], top: [39900, 99000], bottom: [59900, 129000], dresses: [89900, 189000], acc: [19900, 169000] };
// 룩북 챕터에 연결되는 상품: Reverie 4개, Nocturne 1개. 이 5개가 신상품이며 SHOP 목록에서는 숨긴다.
const chapterProducts = {
  reverie: ['p07', 'p08', 'p09', 'p10'],
  nocturne: ['p11'],
};
const newSet = new Set([...chapterProducts.reverie, ...chapterProducts.nocturne]);

const products = [];
defs.forEach(({ id, cat, name, colors, images }, i) => {
  const n = i + 1;
  const [lo, hi] = priceBase[cat];
  const price = Math.round((lo + rnd() * (hi - lo)) / 1000) * 1000 - 100;
  const onSale = n % 4 === 0;
  const salePrice = onSale ? Math.round((price * (rnd() > 0.5 ? 0.8 : 0.7)) / 1000) * 1000 - 100 : undefined;
  const sizes = ['XS', 'S', 'M', 'L'].map((label) => ({ label, soldOut: rnd() < 0.18 }));
  if (sizes.every((s) => s.soldOut)) sizes[1].soldOut = false;
  const isNew = newSet.has(id);
  const day = isNew ? 1 + ((n * 2) % 28) : 1 + ((n * 3) % 28);
  products.push({
    id,
    name,
    category: cat,
    price,
    ...(salePrice ? { salePrice } : {}),
    colors,
    sizes,
    images,
    description: `${name}. 부드러운 촉감의 소재로 제작했으며 일상에서 편안하게 입을 수 있는 실루엣입니다. 소재: 폴리에스터 60%, 면 40%. 모델 착용 사이즈 S. 드라이클리닝을 권장합니다.`,
    sizeGuide: '모델 신장 172cm, 체중 52kg, S 사이즈 착용. 측정 방법에 따라 1~2cm 오차가 있을 수 있습니다. XS 총장 62 / S 64 / M 66 / L 68 (cm).',
    styledWith: [],
    isNew,
    ...(isNew ? { hiddenInShop: true } : {}),
    createdAt: `2026-${isNew ? '09' : '07'}-${pad(day)}`,
  });
});
// 같이 입은 상품: 서로 다른 카테고리의 상품 2~4개
products.forEach((p, idx) => {
  const others = products.filter((o) => o.category !== p.category);
  const count = idx % 7 === 6 ? 0 : 2 + (idx % 3); // 일부는 비워 섹션 숨김을 확인할 수 있게 한다
  const picked = new Set();
  while (picked.size < count) picked.add(others[Math.floor(rnd() * others.length)].id);
  p.styledWith = [...picked];
});

// ---------- 룩북 (챕터 배열) ----------
const lookbook = [
  {
    id: 'ch01',
    layout: 'split',
    title: 'Reverie',
    subtitle: 'New Collection',
    label: 'FW26 · CHAPTER 01',
    description: 'A quiet afternoon, softened in wool and light. Pieces made to move slowly through the season.',
    descriptionKo: '느린 오후의 빛, 울과 니트로 부드럽게 흐르는 실루엣.',
    productsTitle: 'SHOP THE LOOK — REVERIE',
    images: [
      {
        src: '/images/lookbook/scene-reverie.mp4', // 무음 영상 (H.264, 오디오 트랙 없음)
        poster: '/images/lookbook/scene-reverie-poster.jpg',
        alt: 'Reverie 룩북 영상',
        productIds: chapterProducts.reverie,
      },
    ],
  },
  {
    id: 'ch02',
    layout: 'duo',
    title: 'Nocturne',
    subtitle: 'Evening Edit',
    label: 'FW26 · CHAPTER 02',
    description: 'After dusk, the line grows sharper. Black, satin and a single gleam of gold.',
    descriptionKo: '해가 진 뒤 더 선명해지는 선. 블랙과 새틴, 한 점의 골드.',
    productsTitle: 'SHOP THE LOOK — NOCTURNE',
    images: [
      { src: '/images/lookbook/scene-nocturne-1.jpg', alt: 'Nocturne 룩북 화보 1', productIds: chapterProducts.nocturne },
      { src: '/images/lookbook/scene-nocturne-2.jpg', alt: 'Nocturne 룩북 화보 2', productIds: chapterProducts.nocturne },
    ],
  },
];

// ---------- 리뷰, Q&A ----------
const authors = ['kim', 'lee', 'park', 'choi', 'jung', 'han', 'yoon', 'shin'];
const mask = () => `${pick(authors)}${Math.floor(rnd() * 9)}***`;
const reviewTexts = ['핏이 정말 예뻐요. 사진과 색감이 똑같아요.', '소재가 부드럽고 가벼워서 매일 입게 됩니다.', '생각보다 크게 나와서 한 사이즈 작게 주문하는 것을 추천해요.', '배송이 빨랐고 마감도 깔끔합니다.', '가격 대비 만족스러워요. 다른 색상도 사고 싶어요.'];
const qnaTexts = [
  ['사이즈 문의드립니다', '키 165cm에 어떤 사이즈가 맞을까요?', '165cm 기준 S 사이즈를 권장드립니다. 편하게 입으시려면 M도 좋습니다.'],
  ['재입고 일정이 궁금해요', '품절된 사이즈는 재입고 예정이 있나요?', '현재 재입고 일정은 미정이며, 확정되는 대로 공지드리겠습니다.'],
  ['세탁 방법 문의', '집에서 물세탁이 가능한가요?', undefined],
];
const reviews = [];
const qna = [];
products.forEach((p, idx) => {
  const rc = (idx * 3) % 6; // 0~5
  for (let k = 0; k < rc; k++)
    reviews.push({
      id: `r${pad(reviews.length + 1, 3)}`,
      productId: p.id,
      rating: 3 + Math.floor(rnd() * 3),
      content: reviewTexts[(idx + k) % reviewTexts.length],
      author: mask(),
      createdAt: `2026-09-${pad(1 + ((idx + k * 4) % 28))}`,
    });
  const qc = (idx * 2) % 4; // 0~3
  for (let k = 0; k < qc; k++) {
    const [title, question, answer] = qnaTexts[k % qnaTexts.length];
    qna.push({
      id: `q${pad(qna.length + 1, 3)}`,
      productId: p.id,
      title,
      question,
      ...(answer ? { answer } : {}),
      author: mask(),
      createdAt: `2026-09-${pad(1 + ((idx * 2 + k * 3) % 28))}`,
    });
  }
});

const out = (f, d) => writeFileSync(`data/${f}.json`, JSON.stringify(d, null, 2) + '\n');
out('products', products);
out('lookbook', lookbook);
out('reviews', reviews);
out('qna', qna);
console.log(`products ${products.length} (new ${newSet.size}), reviews ${reviews.length}, qna ${qna.length}`);
