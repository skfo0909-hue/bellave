export function SizeSelector({
  sizes,
  value,
  onChange,
}: {
  sizes: { label: string; soldOut: boolean }[];
  value: string | null;
  onChange: (label: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="사이즈 선택">
      {sizes.map((s) => {
        const selected = value === s.label;
        return (
          <button
            key={s.label}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-disabled={s.soldOut}
            disabled={s.soldOut}
            onClick={() => onChange(s.label)}
            className={`relative h-[44px] min-w-[48px] border px-3 text-label ${
              s.soldOut
                ? 'border-gray-200 text-gray-400'
                : selected
                  ? 'border-black font-semibold'
                  : 'border-gray-200 hover:border-black'
            }`}
          >
            {s.label}
            {s.soldOut && (
              <>
                <svg className="pointer-events-none absolute inset-0 h-full w-full text-gray-200" preserveAspectRatio="none" viewBox="0 0 10 10" aria-hidden="true">
                  <line x1="0" y1="10" x2="10" y2="0" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                </svg>
                <span className="sr-only"> (품절)</span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );
}
