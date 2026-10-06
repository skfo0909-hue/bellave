import type { Config } from 'tailwindcss';

// DESIGN_GUIDE.md 9장: 기본 팔레트와 글자 크기를 교체해 정의되지 않은 값을 쓸 수 없게 한다.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',
      ink: '#333333', // 주 버튼 호버
      gray: { 100: '#F2F2F0', 200: '#E5E5E5', 400: '#B3B3B3', 600: '#767676' },
      error: '#C8102E',
      overlay: 'rgba(0,0,0,0.4)',
    },
    screens: { md: '768px', lg: '1024px' },
    borderRadius: { none: '0' },
    spacing: {
      0: '0px',
      px: '1px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
      20: '80px',
      30: '120px',
    },
    fontFamily: {
      sans: [
        'Pretendard Variable',
        'Pretendard',
        '-apple-system',
        'Apple SD Gothic Neo',
        'Malgun Gothic',
        'sans-serif',
      ],
    },
    fontSize: {
      display: ['32px', { lineHeight: '40px', letterSpacing: '0.02em', fontWeight: '600' }],
      'display-sm': ['24px', { lineHeight: '32px', letterSpacing: '0.02em', fontWeight: '600' }],
      title: ['18px', { lineHeight: '26px', letterSpacing: '0.02em', fontWeight: '600' }],
      section: ['13px', { lineHeight: '20px', letterSpacing: '0.08em', fontWeight: '600' }],
      body: ['14px', { lineHeight: '22px' }],
      label: ['12px', { lineHeight: '18px', letterSpacing: '0.06em' }],
      caption: ['12px', { lineHeight: '18px' }],
      micro: ['11px', { lineHeight: '16px', letterSpacing: '0.04em' }],
    },
    fontWeight: { normal: '400', semibold: '600' },
    extend: {
      zIndex: { side: '10', header: '100', overlay: '200', drawer: '210' },
      transitionDuration: { 200: '200ms', 300: '300ms' },
      maxWidth: { page: '1920px' },
    },
  },
  plugins: [],
};
export default config;
