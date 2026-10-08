'use client';
import { useState } from 'react';
import { LAB_VARIANTS } from './variants';

type Device = 'pc' | 'mobile';
const DEVICES: Record<Device, { label: string; width: number; height: number }> = {
  pc: { label: 'PC 1440', width: 1440, height: 2400 },
  mobile: { label: '모바일 375', width: 375, height: 2400 },
};
/** 화면에 보이는 시안 폭(px). iframe은 실제 폭으로 렌더하고 scale로 줄인다. */
const SHOWN_WIDTH: Record<Device, number> = { pc: 312, mobile: 300 };

export function LabCompare() {
  const [device, setDevice] = useState<Device>('pc');
  const d = DEVICES[device];
  const scale = SHOWN_WIDTH[device] / d.width;

  return (
    <div className="page-x mx-auto max-w-[1600px] py-10">
      <div className="flex items-center justify-between">
        <h1 className="section-title">MAIN LAB</h1>
        <div role="group" aria-label="기기 전환" className="flex gap-2">
          {(Object.keys(DEVICES) as Device[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={device === key}
              onClick={() => setDevice(key)}
              className={`h-[44px] border px-4 text-label uppercase ${device === key ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-black'}`}
            >
              {DEVICES[key].label}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-8 flex gap-8 overflow-x-auto pb-4">
        {LAB_VARIANTS.map((v) => (
          <li key={v.id} className="shrink-0" style={{ width: SHOWN_WIDTH[device] }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-label font-semibold uppercase">{v.name}</p>
                <p className="mt-1 text-micro text-gray-600">{v.description}</p>
              </div>
              <a href={`/lab/${v.id}`} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center whitespace-nowrap text-label uppercase underline">
                전체 화면
              </a>
            </div>
            <div className="mt-3 overflow-hidden border border-gray-200" style={{ width: SHOWN_WIDTH[device], height: d.height * scale }}>
              <iframe
                title={`${v.name} 시안`}
                src={`/lab/${v.id}`}
                loading="lazy"
                style={{ width: d.width, height: d.height, transform: `scale(${scale})`, transformOrigin: 'top left', border: 0 }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
