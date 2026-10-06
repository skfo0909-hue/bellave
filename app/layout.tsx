import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { Providers } from '@/components/layout/Providers';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { getProductSummaries } from '@/lib/api';

export const metadata: Metadata = {
  title: { default: 'BELLAVE', template: '%s | BELLAVE' },
  description: 'BELLAVE - 여성 패션 커머스',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const catalog = await getProductSummaries();
  return (
    <html lang="ko">
      <body>
        <Providers catalog={catalog}>
          <Header />
          <MobileDrawer />
          <CartDrawer />
          <main className="min-h-screen pt-[56px] lg:pt-[80px]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
