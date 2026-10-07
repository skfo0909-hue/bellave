# BELLAVE

여성 패션 커머스 프론트엔드 (Next.js App Router, TypeScript, Tailwind, Zustand).
구조는 `CLAUDE.md`, 시각 규칙은 `DESIGN_GUIDE.md`를 따른다.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
node scripts/generate-data.mjs   # SHOP 목업 데이터와 임시 이미지 재생성
npm run build:main               # 메인 데이터 생성 (lookbook.json, main-products.json)
npm run build:main -- --seed 7   # seed를 바꿔 룩북 배치를 새로 섞기
```
