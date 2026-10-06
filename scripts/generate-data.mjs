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
const catalog = {
  outerwear: ['Wool Blend Long Coat', 'Belted Trench Coat', 'Oversized Blazer', 'Cropped Tweed Jacket', 'Padded Puffer Jacket', 'Faux Leather Biker Jacket', 'Single-Breasted Wool Coat'],
  top: ['Cotton Poplin Shirt', 'Ribbed Knit Top', 'Boat Neck Knit Sweater', 'Cropped Cardigan', 'Linen Blend Blouse', 'Basic Crew Neck Tee', 'Satin Camisole Top'],
  bottom: ['High-Waist Wide Trousers', 'Pleated Midi Skirt', 'Straight Leg Jeans', 'Tailored Bermuda Shorts', 'Wool Blend Slacks', 'Denim Mini Skirt', 'Pull-On Jersey Pants'],
  dresses: ['Slip Midi Dress', 'Knit Wrap Dress', 'Shirt Dress with Belt', 'Pleated Chiffon Dress', 'A-Line Mini Dress', 'Tweed Sheath Dress', 'Linen Maxi Dress'],
  acc: ['Leather Mini Shoulder Bag', 'Wool Muffler', 'Chain Hoop Earrings', 'Leather Belt', 'Silk Scarf', 'Canvas Tote Bag', 'Knit Beanie'],
};
// 카테고리별 상품 수: OUTERWEAR 6 / TOP 6 / BOTTOM 4 / DRESSES 4 / ACC 2 (총 22)
const counts = { outerwear: 6, top: 6, bottom: 4, dresses: 4, acc: 2 };
const priceBase = { outerwear: [159000, 329000], top: [39900, 99000], bottom: [59900, 129000], dresses: [89900, 189000], acc: [19900, 169000] };
const newIdx = { outerwear: [0, 1, 2], top: [0, 1, 2], bottom: [0, 1], dresses: [0, 1], acc: [0, 1] }; // 합계 12

const products = [];
let n = 0;
for (const [cat, allNames] of Object.entries(catalog)) {
  allNames.slice(0, counts[cat]).forEach((name, i) => {
    n += 1;
    const id = `p${pad(n)}`;
    const [lo, hi] = priceBase[cat];
    const price = Math.round((lo + rnd() * (hi - lo)) / 1000) * 1000 - 100;
    const onSale = n % 4 === 0;
    const salePrice = onSale ? Math.round((price * (rnd() > 0.5 ? 0.8 : 0.7)) / 1000) * 1000 - 100 : undefined;
    const colorCount = 1 + Math.floor(rnd() * 3);
    const start = Math.floor(rnd() * palette.length);
    const colors = Array.from({ length: colorCount }, (_, k) => palette[(start + k * 3) % palette.length]);
    const sizes =
      cat === 'acc'
        ? [{ label: 'ONE SIZE', soldOut: false }]
        : ['XS', 'S', 'M', 'L'].map((label) => ({ label, soldOut: rnd() < 0.18 }));
    if (sizes.every((s) => s.soldOut)) sizes[1].soldOut = false;
    const w = pick(['worn-1', 'worn-2', 'worn-3']);
    const isNew = newIdx[cat].includes(i);
    const day = isNew ? 1 + ((n * 2) % 28) : 1 + ((n * 3) % 28);
    products.push({
      id,
      name,
      category: cat,
      price,
      ...(salePrice ? { salePrice } : {}),
      colors,
      sizes,
      images: {
        product: img('product'),
        worn: img(w),
        gallery: [img(w), img('product'), img('gallery-1'), img('gallery-2'), img('gallery-3')],
        detail: [img('detail-1'), img('detail-2'), img('detail-3'), img('detail-4'), img('detail-1')],
      },
      description: `${name}. 부드러운 촉감의 소재로 제작했으며 일상에서 편안하게 입을 수 있는 실루엣입니다. 소재: 폴리에스터 60%, 면 40%. 모델 착용 사이즈 S. 드라이클리닝을 권장합니다.`,
      sizeGuide:
        cat === 'acc'
          ? '프리 사이즈 상품입니다. 상세 치수는 측정 방법에 따라 1~2cm 오차가 있을 수 있습니다.'
          : '모델 신장 172cm, 체중 52kg, S 사이즈 착용. 측정 방법에 따라 1~2cm 오차가 있을 수 있습니다. XS 총장 62 / S 64 / M 66 / L 68 (cm).',
      styledWith: [],
      isNew,
      createdAt: `2026-${isNew ? '09' : '07'}-${pad(day)}`,
    });
  });
}
// 같이 입은 상품: 서로 다른 카테고리의 상품 2~4개
products.forEach((p, idx) => {
  const others = products.filter((o) => o.category !== p.category);
  const count = idx % 7 === 6 ? 0 : 2 + (idx % 3); // 일부는 비워 섹션 숨김을 확인할 수 있게 한다
  const picked = new Set();
  while (picked.size < count) picked.add(others[Math.floor(rnd() * others.length)].id);
  p.styledWith = [...picked];
});

// ---------- 룩북 ----------
const newIds = products.filter((p) => p.isNew).map((p) => p.id);
const looks = ['look-1', 'look-2', 'look-3', 'look-4', 'look-5'];
const lookbook = {
  title: 'AUTUMN WINTER 26',
  description: '차분한 톤과 구조적인 실루엣으로 완성한 이번 시즌의 룩. 한 장의 컷에서 시작되는 스타일을 만나보세요.',
  items: Array.from({ length: 10 }, (_, i) => ({
    id: `l${pad(i + 1)}`,
    image: img(looks[i % looks.length]),
    size: i === 0 || i === 6 ? 'large' : 'normal',
    productIds: i < 2 ? [newIds[i * 2], newIds[i * 2 + 1]] : [newIds[(i + 2) % newIds.length]],
  })),
};
// 12개 신상품 모두 룩북에 등장하도록 남은 상품을 컷에 나눠 담는다
const used = new Set(lookbook.items.flatMap((l) => l.productIds));
newIds.filter((id) => !used.has(id)).forEach((id, k) => lookbook.items[2 + (k % 8)].productIds.push(id));

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
console.log(`products ${products.length} (new ${newIds.length}), reviews ${reviews.length}, qna ${qna.length}`);
