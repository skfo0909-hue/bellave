# 메인 시안 보관

메인 페이지 시안 A~E를 정리하기 전의 상태를 git 태그 `main-drafts-archive`에 보관했다. 이 문서는 시안별 파일 위치와 복원 방법을 적는다.
시안은 `/lab/a` ~ `/lab/e`로 열었고, `/lab`에서 나란히 비교했다. (정리 후에는 채택한 시안 B만 실제 메인 `/`에 남는다.)

## 시안 한눈에 보기

| 시안 | 이름 | 한 줄 설명 | 상태 |
|---|---|---|---|
| A | GRID | 3열 모자이크 룩북 (큰 컷 2개, 6행) | 폐기 |
| B | COLLAGE | 컷이 겹치고 어긋나게 놓이는 콜라주 룩북 | **채택 → 실제 메인(`/`)** |
| C | COLLAGE + BG | B에 고정 배경 이미지, 두꺼운 흰 테두리, 기울어진 컷, 스크롤 블러 → 선명, 검은 타이틀 블록(BoilTitle), 상품 리스트부터 흰 배경 | 폐기 |
| D | HERO + CAROUSEL | 전체 폭 비주얼 룩북 2개 + 세부 룩 캐러셀 2개 (이미지는 회색 자리) | 폐기 |
| E | EDITORIAL | 좌우 분할 히어로, 이미지 쌍, 워드마크, 슬라이더, 선으로 나뉜 상품 격자, 2×2 이미지 | 폐기 |

## 공통 파일 (/lab 인프라)

| 파일 | 역할 |
|---|---|
| `app/lab/page.tsx` | `/lab` 비교 페이지 (LabCompare 렌더) |
| `app/lab/[variant]/page.tsx` | `/lab/a` ~ `/lab/e` 라우트. `variants.ts`의 목록으로 정적 생성 |
| `components/lab/LabCompare.tsx` | 시안을 iframe으로 축소해 나란히 보여주고 PC(1440) / 모바일(375)을 전환 |
| `components/lab/LabMain.tsx` | 시안 A·B·C의 공통 골격 (공용 타이틀·상품 리스트·컨테이너 + 시안별 슬롯 `lookbook`, `title`, `productsWrap`, `before`) |
| `components/lab/variants.ts` | 시안 목록 (id, 이름, 설명, 컴포넌트) |

## 시안별 파일

### A · GRID
- `components/lab/a/LabA.tsx`
- 의존: `components/home/LookbookGrid.tsx` (3열 모자이크), `LookbookTitle`, `LookbookProducts`, `MainContainer`
- 데이터: 같은 `data/lookbook.json` (12컷, seed 순서. 5번째·10번째가 큰 컷)

### B · COLLAGE (채택)
- `components/lab/b/LabB.tsx`
- 의존: `components/home/LookbookCollage.tsx` (기본 옵션), `LookbookTitle`, `LookbookProducts`, `MainContainer`
- 채택 후에는 `app/page.tsx`가 같은 구성을 직접 렌더한다.

### C · COLLAGE + BG
- `components/lab/c/LabC.tsx` (조립), `SteelBackground.tsx` (고정 배경), `WhiteProducts.tsx` (상품 리스트부터 흰 배경, 푸터까지), `HeaderWhite.tsx` (헤더를 불투명 흰색으로 덮어쓰는 `<style>`), `LabTitle.tsx` (상단 타이틀 블록), `BoilTitle.tsx` (손으로 그린 듯 떨리는 이중 윤곽선 타이틀), `titleConfig.ts` (색, 노이즈, 떨림 조절 값), `titleFonts.ts` (Bodoni Moda)
- 이미지: `public/images/lab/bg01.webp` (배경). 이전에 썼던 steel, bg02 배경 파일은 git 히스토리에만 있다.
- `components/home/LookbookCollage.tsx`에 시안 C용 선택 옵션이 들어 있었다: `frame`(모든 컷에 8px 흰 테두리), `blurReveal`(스크롤 블러 → 선명, 객체로 강도 조절), `tilt`(컷을 살짝 기울임). 기본값은 꺼짐.
- `LabMain`의 `title`, `productsWrap`, `before` 슬롯을 사용한다.

### D · HERO + CAROUSEL
- `components/lab/d/LabD.tsx` (조립), `HeroVisual.tsx`, `IntroCopy.tsx`, `LookCarousel.tsx`, `HeaderOverlay.tsx` (헤더를 첫 화보 위에 투명하게 겹침), `SlotImage.tsx`, `images.ts` (이미지 자리. `src`를 채우면 그 자리에 들어간다)
- 이미지는 아직 올리지 않았다. (`public/images/lab-d/`를 쓰려던 계획이었고 폴더는 만들지 않았다.)

### E · EDITORIAL
- `components/lab/e/LabE.tsx` (조립), `HeroSplit.tsx`, `IntroCopy.tsx`, `TeasePair.tsx`, `Wordmark.tsx`, `FeatureSlider.tsx`, `WideVisual.tsx`, `ProductGrid.tsx`, `SpaceGrid.tsx`, `Pic.tsx`
- 이미지는 룩북 12컷과 상품 컷을 그대로 사용한다.

## 데이터·스크립트에서 시안 때문에 있던 것
- `data/lookbook.json`의 `layout` 필드 (`'grid'` | `'collage'`)와 `lib/types.ts`의 `LookbookChapter.layout`
- `scripts/build-main-data.ts`의 `--layout` 옵션과 기본값 `layout`
- `app/page.tsx`의 `layout` 값에 따른 `LookbookGrid` / `LookbookCollage` 전환

## 복원 방법

태그 `main-drafts-archive`가 가리키는 커밋(`76a6b0d`)이 정리 직전 상태다. 이 커밋은 브랜치 `claude/new-session-xxjxfq`의 기록에도 들어 있어서, 태그가 없는 복제본에서는 `main-drafts-archive` 대신 `76a6b0d`를 쓰면 된다. (태그 자체는 원격으로 올라가지 않아 로컬에만 있다. 필요하면 `git tag main-drafts-archive 76a6b0d && git push origin main-drafts-archive`로 만든다.)

1. **전체를 그 시점으로 보기**
   ```bash
   git switch -c restore-drafts main-drafts-archive
   ```
2. **현재 브랜치에 시안만 가져오기** (예: 시안 E)
   ```bash
   git checkout main-drafts-archive -- app/lab components/lab public/images/lab
   ```
   시안별로 추가로 필요한 파일:
   - A: `git checkout main-drafts-archive -- components/home/LookbookGrid.tsx`
   - C: 보관 시점의 `components/home/LookbookCollage.tsx` (옵션 `frame`, `blurReveal`, `tilt` 포함). 현재 파일을 덮어쓰므로 `git show main-drafts-archive:components/home/LookbookCollage.tsx`로 내용을 보고 옵션 부분만 합치는 편이 안전하다.
   - B, D, E: `components/lab/<id>/`만으로 동작한다. (`app/lab`과 `components/lab/variants.ts`, `LabMain.tsx`, `LabCompare.tsx`는 위 명령에 포함)
3. **/lab 비교 페이지만 다시 열기:** 2번의 명령으로 `app/lab`과 `components/lab` 전체를 가져오면 된다. `components/lab/variants.ts`에서 쓰지 않는 시안 한 줄을 지우면 비교 대상에서 빠진다.

## Figma
시안 B·C·D·E를 1440px로 옮긴 프레임이 Figma 파일 `사이트 참조`의 `디자인` 페이지에 있다(`lab/c`, `lab/b`, `lab/d`, `lab/e`). 사진·로고는 회색 자리다.
