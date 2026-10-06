import { ProductGrid } from '@/components/product/ProductGrid';
import { ButtonLink } from '@/components/ui/Button';
import type { Product } from '@/lib/types';

export function NewArrivalsSection({ products }: { products: Product[] }) {
  return (
    <section aria-labelledby="new-arrivals" className="page-x mx-auto mt-16 max-w-page md:mt-20 lg:mt-30">
      <h2 id="new-arrivals" className="section-title mb-6 lg:mb-8">
        New Arrivals
      </h2>
      <ProductGrid products={products} />
      <div className="mt-12 flex justify-center">
        <ButtonLink href="/new-arrivals" variant="secondary" className="min-w-[200px]">
          VIEW ALL
        </ButtonLink>
      </div>
    </section>
  );
}
