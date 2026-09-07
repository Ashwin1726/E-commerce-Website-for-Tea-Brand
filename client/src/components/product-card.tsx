import { Link } from "wouter";
import { Heart, ShoppingBag, Star, Flame } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { useStore, useIsInWishlist } from "../lib/store";
import type { Product } from "@shared/schema";
import teaBoxImage from "../assets/generated_images/flowey_premium_tea_box.png";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user, addToCart, toggleWishlist, setCartOpen } = useStore();
  const isInWishlist = useIsInWishlist(product.id);
  
  const minPrice = Math.min(...product.variations.map((v) => v.price));
  const maxPrice = Math.max(...product.variations.map((v) => v.price));
  const totalStock = product.variations.reduce((sum, v) => sum + v.stock, 0);
  const isLowStock = totalStock > 0 && totalStock < 20;
  const isOutOfStock = totalStock === 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariation = product.variations[0];
    addToCart({
      productId: product.id,
      packSize: defaultVariation.packSize,
      quantity: 1,
      price: defaultVariation.price,
    });
    setCartOpen(true);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      toggleWishlist(product.id);
    }
  };

  return (
    <Link href={`/product/${product.id}`}>
      <Card 
        className="group overflow-visible cursor-pointer transition-all duration-300 hover-elevate"
        data-testid={`card-product-${product.id}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg bg-muted">
          <img
            src={product.images?.[0] || teaBoxImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge variant="default" className="text-xs">New</Badge>
            )}
            {product.isBestseller && (
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Bestseller
              </Badge>
            )}
            {isLowStock && !isOutOfStock && (
              <Badge variant="destructive" className="text-xs">
                <Flame className="h-3 w-3 mr-1" />
                Low Stock
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="outline" className="text-xs bg-background">
                Out of Stock
              </Badge>
            )}
          </div>

          {user && (
            <Button
              variant="ghost"
              size="icon"
              className={`absolute top-3 right-3 rounded-full bg-background/80 backdrop-blur-sm transition-opacity ${
                isInWishlist ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              onClick={handleToggleWishlist}
              data-testid={`button-wishlist-${product.id}`}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isInWishlist ? "fill-destructive text-destructive" : ""
                }`}
              />
            </Button>
          )}

          <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              className="w-full"
              size="sm"
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              data-testid={`button-quick-add-${product.id}`}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {isOutOfStock ? "Out of Stock" : "Quick Add"}
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
          <h3 className="font-serif text-lg font-medium line-clamp-1 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.shortDescription}
          </p>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold">
                Rs.{minPrice.toLocaleString()}
              </span>
              {minPrice !== maxPrice && (
                <span className="text-sm text-muted-foreground">
                  - Rs.{maxPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.variations.length} sizes
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
