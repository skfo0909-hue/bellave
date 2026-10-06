import { MinusIcon, PlusIcon } from './Icon';

const cell = 'flex h-[32px] w-[32px] items-center justify-center border border-gray-200';

export function QuantityStepper({ value, onChange, label = '수량' }: { value: number; onChange: (n: number) => void; label?: string }) {
  return (
    <div className="inline-flex items-center" role="group" aria-label={label}>
      <button type="button" aria-label={`${label} 줄이기`} disabled={value <= 1} onClick={() => onChange(value - 1)} className={`${cell} disabled:text-gray-400`}>
        <MinusIcon size={12} />
      </button>
      <span className={`${cell} -mx-px text-micro`} aria-live="polite">
        {value}
      </span>
      <button type="button" aria-label={`${label} 늘리기`} onClick={() => onChange(value + 1)} className={cell}>
        <PlusIcon size={12} />
      </button>
    </div>
  );
}
