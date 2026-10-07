/**
 * 메인 페이지 데이터 생성 (CLAUDE.md 9-1장)
 *
 *   npm run build:main              현재 seed로 다시 생성
 *   npm run build:main -- --seed 7  seed를 바꿔 새 배치로 생성
 *
 * 읽는 곳
 *   public/images/lookbook/   룩북 컷 12장 (폴더의 이미지 전부)
 *   public/images/products/   메인 상품 컷 8장 (파일명이 look_list_ 로 시작하는 것. SHOP 상품 컷과 같은 폴더라 접두사로 구분)
 *
 * 만드는 것
 *   data/lookbook.json        챕터 배열. 이미지 12컷과 상품 8개를 seed로 섞은 순서로 담는다.
 *   data/main-products.json   메인 상품 8개 (신상품, SHOP 목록에서는 숨김)
 *
 * 규칙
 *   - 섞기는 이 스크립트에서 한 번만 한다(같은 seed면 같은 순서). 접속마다 섞지 않는다.
 *   - 큰 컷 자리는 5번과 10번. 원본 가로 1600px 미만은 큰 컷에서 제외한다.
 *   - pinLarge(최대 2개)에 적은 파일은 큰 컷으로 고정하고, 나머지는 무작위로 채운다.
 *   - 수량이 12컷, 8컷과 다르면 채우거나 버리지 않고 보고한 뒤 멈춘다.
 *   - 이미 있는 lookbook.json의 seed, pinLarge, 문구는 유지한다. 문구를 바꾸려면 lookbook.json을 고치고 다시 실행한다.
 *   - 상품명, 가격 등은 data/main-products.meta.json(파일명 기준)에 적으면 임시 값 대신 쓴다.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { imageSize } from 'image-size';
import type { Category, Lookbook, LookbookChapter, LookbookImage, Product } from '../lib/types';

const ROOT = process.cwd();
const LOOKBOOK_DIR = 'public/images/lookbook';
const PRODUCTS_DIR = 'public/images/products';
const MAIN_PRODUCT_PREFIX = /^look_list_/i;
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

const EXPECT = { lookbook: 12, products: 8 };
const LARGE_SLOTS = [5, 10]; // 1부터 센 큰 컷 자리
const LARGE_MIN_WIDTH = 1600;

const DEFAULT_CHAPTER = {
  id: 'ch01',
  title: 'OCTOBER',
  subline: 'FW26, SEOUL',
  copy: "Autumn, undone. The air turns, the collar goes up, and the city slows to the pace of falling leaves. A selection of this season's essential pieces in wool, leather and knit, worn the way October asks: layered, unhurried, certain.",
  copyKo: '가을, 풀어 헤치다. 공기가 바뀌고 깃이 올라가면, 도시는 낙엽이 떨어지는 속도로 느려진다. 울과 레더, 니트로 고른 이번 시즌의 필수 아이템. 겹쳐 입고, 서두르지 않고, 분명하게.',
  productsTitle: 'SHOP THE LOOK — OCTOBER',
  seed: 1007,
  pinLarge: [] as string[],
};

// 상품명, 가격 등이 주어지지 않았을 때 쓰는 임시 값 (파일 정렬 순서 기준). 실제 값은 main-products.meta.json으로 덮어쓴다.
interface ProductMeta {
  name: string;
  category: Category;
  price: number;
  salePrice?: number;
  colors: { name: string; hex: string }[];
  sizes?: string[];
}
const TEMP_PRODUCTS: ProductMeta[] = [
  { name: 'Zip-Up Bomber Jacket', category: 'outerwear', price: 129000, colors: [{ name: 'Black', hex: '#111111' }] },
  { name: 'Satin Midi Skirt', category: 'bottom', price: 89000, colors: [{ name: 'Aubergine', hex: '#2B1F2A' }] },
  { name: 'Faux Leather Belted Jacket', category: 'outerwear', price: 199000, colors: [{ name: 'Black', hex: '#111111' }] },
  { name: 'Wool Blend Cropped Jacket', category: 'outerwear', price: 169000, colors: [{ name: 'Beige', hex: '#CBB8A0' }] },
  { name: 'Suede Slouch Ankle Boots', category: 'acc', price: 119000, colors: [{ name: 'Khaki Brown', hex: '#7A6A50' }], sizes: ['230', '240', '250'] },
  { name: 'Straight Leg Jeans', category: 'bottom', price: 79000, colors: [{ name: 'Indigo', hex: '#4A6B8A' }] },
  { name: 'Distressed Barrel Jeans', category: 'bottom', price: 99000, salePrice: 79000, colors: [{ name: 'Washed Blue', hex: '#6C8CAB' }] },
  { name: 'Lace Trim V-Neck Top', category: 'top', price: 59000, colors: [{ name: 'Black', hex: '#111111' }] },
];

// ---------- 유틸 ----------
const natural = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });
const pad = (n: number) => String(n).padStart(2, '0');

/** mulberry32: 같은 seed면 같은 수열 */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle<T>(list: T[], seed: number): T[] {
  const r = rng(seed);
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const listImages = (dir: string, filter: (f: string) => boolean = () => true) =>
  (existsSync(join(ROOT, dir)) ? readdirSync(join(ROOT, dir)) : []).filter((f) => IMAGE_EXT.test(f) && filter(f)).sort(natural);
const sizeOf = (dir: string, file: string) => {
  const { width, height } = imageSize(readFileSync(join(ROOT, dir, file)));
  if (!width || !height) throw new Error(`이미지 크기를 읽을 수 없습니다: ${dir}/${file}`);
  return { width, height };
};
const readJson = <T>(file: string): T | null => (existsSync(join(ROOT, file)) ? (JSON.parse(readFileSync(join(ROOT, file), 'utf8')) as T) : null);
const fail = (msg: string): never => {
  console.error(`\n[중단] ${msg}`);
  process.exit(1);
};

// ---------- 1. 이미지 목록 읽기와 수량 검증 ----------
const lookFiles = listImages(LOOKBOOK_DIR);
const productFiles = listImages(PRODUCTS_DIR, (f) => MAIN_PRODUCT_PREFIX.test(f));

console.log('이미지 폴더 확인');
console.log(`  ${LOOKBOOK_DIR}: ${lookFiles.length}컷 (필요 ${EXPECT.lookbook})`);
console.log(`  ${PRODUCTS_DIR} (look_list_*): ${productFiles.length}컷 (필요 ${EXPECT.products})`);
if (lookFiles.length !== EXPECT.lookbook || productFiles.length !== EXPECT.products) {
  fail(`수량이 맞지 않습니다. 임의로 채우거나 버리지 않았고 데이터도 바꾸지 않았습니다.\n  룩북 ${lookFiles.length}/${EXPECT.lookbook}, 상품 ${productFiles.length}/${EXPECT.products}`);
}

// ---------- 2. 챕터 설정 (기존 lookbook.json이 있으면 유지) ----------
const existing = readJson<Lookbook>('data/lookbook.json');
const prev = existing?.[0] && 'subline' in existing[0] ? existing[0] : undefined; // 옛 스키마(룩북 씬)는 무시
const seedArg = process.argv.indexOf('--seed');
const base = {
  ...DEFAULT_CHAPTER,
  ...(prev ? { id: prev.id, title: prev.title, subline: prev.subline, copy: prev.copy, copyKo: prev.copyKo, productsTitle: prev.productsTitle, seed: prev.seed, pinLarge: prev.pinLarge ?? [] } : {}),
};
if (seedArg > -1) {
  const n = Number(process.argv[seedArg + 1]);
  if (!Number.isInteger(n)) fail('--seed 뒤에는 정수를 적어 주세요.');
  base.seed = n;
}
const pins = (base.pinLarge ?? []).slice(0, LARGE_SLOTS.length);

// ---------- 3. 룩북 12컷 섞기, 큰 컷 선택 ----------
const meta = lookFiles.map((file) => ({ file, ...sizeOf(LOOKBOOK_DIR, file) }));
const byFile = new Map(meta.map((m) => [m.file, m]));
for (const pin of pins) if (!byFile.has(pin)) fail(`pinLarge의 파일이 룩북 폴더에 없습니다: ${pin}`);
for (const pin of pins) {
  const m = byFile.get(pin)!;
  if (m.width < LARGE_MIN_WIDTH) console.warn(`  [주의] 고정한 큰 컷 ${pin}은 가로 ${m.width}px로 ${LARGE_MIN_WIDTH}px 미만입니다.`);
}

const shuffled = shuffle(meta, base.seed);
// 무작위로 뽑되 원본 가로가 1600px 미만이면 제외하고 다시 뽑는다 (섞인 순서에서 조건에 맞는 것을 앞에서부터 사용)
const eligible = shuffled.filter((m) => m.width >= LARGE_MIN_WIDTH && !pins.includes(m.file));
const pinned = pins.map((p) => byFile.get(p)!);
const need = LARGE_SLOTS.length - pinned.length;
if (eligible.length < need) {
  fail(`큰 컷으로 쓸 수 있는 이미지(가로 ${LARGE_MIN_WIDTH}px 이상)가 부족합니다. 필요 ${need}장, 사용 가능 ${eligible.length}장.`);
}
const larges = shuffle([...pinned, ...eligible.slice(0, need)], base.seed + 17); // 5번과 10번 중 어디에 들어갈지도 무작위
const rest = shuffled.filter((m) => !larges.includes(m));

const ordered: typeof meta = [];
let li = 0;
let ri = 0;
for (let slot = 1; slot <= EXPECT.lookbook; slot++) ordered.push(LARGE_SLOTS.includes(slot) ? larges[li++] : rest[ri++]);

const images: LookbookImage[] = ordered.map((m, i) => ({
  src: `/${LOOKBOOK_DIR.replace(/^public\//, '')}/${m.file}`,
  alt: `${base.title} 룩북 컷 ${i + 1}`,
  width: m.width,
  height: m.height,
}));

// ---------- 4. 상품 8개 데이터 ----------
const overrides = readJson<Record<string, Partial<ProductMeta>>>('data/main-products.meta.json') ?? {};
const stem = (f: string) => f.replace(/\.[^.]+$/, '');
const usedTemp: { file: string; id: string; name: string; price: number; temp: boolean }[] = [];

const products: Product[] = productFiles.map((file, i) => {
  const fromTemp = TEMP_PRODUCTS[i] ?? { name: `Item ${i + 1}`, category: 'top' as Category, price: 59000, colors: [{ name: 'Black', hex: '#111111' }] };
  const o = overrides[stem(file)] ?? {};
  const m: ProductMeta = { ...fromTemp, ...o };
  const num = stem(file).match(/(\d+)$/)?.[1];
  const id = `m${pad(num ? Number(num) : i + 1)}`;
  const src = `/${PRODUCTS_DIR.replace(/^public\//, '')}/${file}`;
  usedTemp.push({ file, id, name: m.name, price: m.salePrice ?? m.price, temp: !o.name });
  return {
    id,
    name: m.name,
    category: m.category,
    price: m.price,
    ...(m.salePrice ? { salePrice: m.salePrice } : {}),
    colors: m.colors,
    sizes: (m.sizes ?? ['XS', 'S', 'M', 'L']).map((label) => ({ label, soldOut: false })),
    // 착용 컷이 없으므로 worn은 비워 둔다 (ProductCard는 호버 전환을 하지 않는다)
    images: { product: src, gallery: [src], detail: [] },
    description: `${m.name}. 이번 시즌 필수 아이템으로, 일상에서 편안하게 입을 수 있는 실루엣입니다. (임시 설명)`,
    sizeGuide: '측정 방법에 따라 1~2cm 오차가 있을 수 있습니다. (임시 안내)',
    styledWith: [],
    isNew: true,
    hiddenInShop: true, // SHOP 목록에는 나오지 않고 메인과 NEW ARRIVALS에서 노출
    createdAt: `2026-10-${pad(Math.max(1, 9 - (i + 1)))}`,
  };
});
const productIds = shuffle(
  products.map((p) => p.id),
  base.seed + 101,
);

// ---------- 5. 저장 ----------
const chapter: LookbookChapter = {
  id: base.id,
  title: base.title,
  subline: base.subline,
  copy: base.copy,
  copyKo: base.copyKo,
  productsTitle: base.productsTitle,
  seed: base.seed,
  ...(pins.length ? { pinLarge: pins } : {}),
  images,
  productIds,
};
writeFileSync(join(ROOT, 'data/lookbook.json'), JSON.stringify([chapter] satisfies Lookbook, null, 2) + '\n');
writeFileSync(join(ROOT, 'data/main-products.json'), JSON.stringify(products, null, 2) + '\n');

// ---------- 6. 보고 ----------
console.log(`\n생성 완료 (seed ${base.seed})`);
console.log('룩북 순서 (큰 컷 = ★):');
ordered.forEach((m, i) => console.log(`  ${pad(i + 1)}${LARGE_SLOTS.includes(i + 1) ? '★' : ' '} ${m.file}  ${m.width}x${m.height}`));
console.log('\n상품 순서:');
productIds.forEach((id, i) => {
  const t = usedTemp.find((u) => u.id === id)!;
  console.log(`  ${i + 1}. ${id}  ${t.name}  ₩ ${t.price.toLocaleString('en-US')}  (${t.file})${t.temp ? '  [임시 값]' : ''}`);
});
