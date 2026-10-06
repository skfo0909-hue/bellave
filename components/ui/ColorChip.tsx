// 상품 데이터의 hex 값을 그대로 사용. 흰색 계열은 gray-200 테두리.
function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (r * 299 + g * 587 + b * 114) / 1000 > 225;
}

export function ColorDot({ hex, name }: { hex: string; name: string }) {
  return (
    <span
      title={name}
      aria-label={name}
      role="img"
      className={`inline-block h-2 w-2 ${isLight(hex) ? 'border border-gray-200' : ''}`}
      style={{ backgroundColor: hex }}
    />
  );
}

export function ColorSelector({
  colors,
  value,
  onChange,
}: {
  colors: { name: string; hex: string }[];
  value: string | null;
  onChange: (name: string) => void;
}) {
  return (
    <div className="flex items-center gap-3" role="radiogroup" aria-label="컬러 선택">
      <div className="flex items-center gap-2">
        {colors.map((c) => {
          const selected = value === c.name;
          return (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={c.name}
              onClick={() => onChange(c.name)}
              className={`flex h-[44px] w-[32px] items-center justify-center`}
            >
              <span className={`flex h-[32px] w-[32px] items-center justify-center ${selected ? 'border border-black' : 'border border-transparent'}`}>
                <span
                  className={`block h-[24px] w-[24px] ${isLight(c.hex) ? 'border border-gray-200' : ''}`}
                  style={{ backgroundColor: c.hex }}
                />
              </span>
            </button>
          );
        })}
      </div>
      {value && <span className="text-caption">{value}</span>}
    </div>
  );
}
