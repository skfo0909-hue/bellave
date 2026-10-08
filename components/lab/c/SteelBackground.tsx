/** 사이트 전체 배경. 뷰포트에 고정되어 스크롤해도 움직이지 않고, 헤더, 본문, 푸터 뒤에 깔린다. */
export function SteelBackground() {
  return <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/lab/steel.webp')" }} />;
}
