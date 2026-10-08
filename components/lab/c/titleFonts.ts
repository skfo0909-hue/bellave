import { Bodoni_Moda } from 'next/font/google';

// 굵기 대비가 큰 세리프 (가변 폰트). 광학 크기(opsz) 축은 titleConfig의 opsz로 조절한다.
export const titleFont = Bodoni_Moda({ subsets: ['latin'], axes: ['opsz'], display: 'swap' });
