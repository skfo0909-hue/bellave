/**
 * /lab/c 전용: 헤더 배경을 블러 없는 불투명 흰색(#FFFFFF)으로 고정한다.
 * 공용 Header는 수정하지 않는다. 이 페이지가 열려 있는 동안만 아래 스타일이 header에 덮어씌워지고, 다른 페이지로 이동하면 사라진다.
 */
export function HeaderWhite() {
  return <style>{`header { background-color: #ffffff !important; -webkit-backdrop-filter: none !important; backdrop-filter: none !important; }`}</style>;
}
