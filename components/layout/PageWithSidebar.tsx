import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

export function PageWithSidebar({ menu, children }: { menu: 'shop' | 'community'; children: ReactNode }) {
  return (
    <div className="page-x mx-auto flex max-w-page">
      <Sidebar menu={menu} />
      <div className="min-w-0 flex-1 pb-30">{children}</div>
    </div>
  );
}
