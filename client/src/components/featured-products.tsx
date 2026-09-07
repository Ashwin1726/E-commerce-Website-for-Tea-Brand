import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { ProductCard } from "../components/product-card";
import { useStore } from "../lib/store";

export function FeaturedProducts() {
  const { products } = useStore();
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  if (products.length === 0) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 text-primary mb-2">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium uppercase tracking-wider">
                  Curated for You
                </span>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl font-medium">
                Featured Collection
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-primary mb-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Curated for You
              </span>
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium">
              Featured Collection
            </h2>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/products" data-testid="link-view-all-products">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
