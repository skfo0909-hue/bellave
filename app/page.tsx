import { LookbookGrid } from '@/components/home/LookbookGrid';
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection';
import { getLookbook, getLookbookProducts } from '@/lib/api';

export default async function Home() {
  const [lookbook, products] = await Promise.all([getLookbook(), getLookbookProducts()]);
  return (
    <div className="pb-30">
      <LookbookGrid lookbook={lookbook} />
      <NewArrivalsSection products={products} />
    </div>
  );
}
