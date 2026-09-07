import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Heart, ShoppingBag, Minus, Plus, Star, Truck, Shield, Leaf, ChevronLeft, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Skeleton } from "../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { useStore, useIsInWishlist } from "../lib/store";
import { getProduct } from "../lib/firebase";
import { useToast } from "../hooks/use-toast";
import type { Product } from "@shared/schema";
import teaBoxImage from "../assets/generated_images/flowey_premium_tea_box.png";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { user, products, addToCart, toggleWishlist, setCartOpen } = useStore();
  const isInWishlist = useIsInWishlist(id || "");
  const { toast } = useToast();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      const cachedProduct = products.find((p) => p.id === id);
      if (cachedProduct) {
        setProduct(cachedProduct);
        setLoading(false);
        return;
      }

      try {
        const fetchedProduct = await getProduct(id);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, products]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-medium mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  const variation = product.variations[selectedVariation];
  const isLowStock = variation.stock > 0 && variation.stock < 10;
  const isOutOfStock = variation.stock === 0;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      packSize: variation.packSize,
      quantity,
      price: variation.price,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} (${variation.packSize} bags) x ${quantity}`,
    });
    setCartOpen(true);
  };

  const handleToggleWishlist = () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "Login to save items to your wishlist",
        variant: "destructive",
      });
      return;
    }
    toggleWishlist(product.id);
    toast({
      title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: product.name,
    });
  };

  const images = product.images?.length > 0 ? product.images : [teaBoxImage];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-4">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/products">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </Button>
      </div>

      <div className="container mx-auto px-6 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isNew && (
                <Badge className="absolute top-4 left-4">New</Badge>
              )}
              {product.isBestseller && (
                <Badge variant="secondary" className="absolute top-4 left-4">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Bestseller
                </Badge>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {product.category}
              </p>
              <h1 className="font-serif text-3xl lg:text-4xl font-medium mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span>4.8 (128 reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold">
                Rs.{variation.price.toLocaleString()}
              </span>
              {variation.compareAtPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  Rs.{variation.compareAtPrice.toLocaleString()}
                </span>
              )}
            </div>

            {isLowStock && (
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Only {variation.stock} left - selling fast!
                </span>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-sm font-medium">Pack Size</label>
              <div className="flex flex-wrap gap-2">
                {product.variations.map((v, idx) => (
                  <Button
                    key={v.packSize}
                    variant={selectedVariation === idx ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedVariation(idx);
                      setQuantity(1);
                    }}
                    disabled={v.stock === 0}
                    data-testid={`button-pack-${v.packSize}`}
                  >
                    {v.packSize} bags - Rs.{v.price.toLocaleString()}
                    {v.stock === 0 && " (Out of Stock)"}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  data-testid="button-quantity-decrease"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(variation.stock, quantity + 1))}
                  disabled={quantity >= variation.stock}
                  data-testid="button-quantity-increase"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                data-testid="button-add-to-cart"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleWishlist}
                data-testid="button-add-to-wishlist"
              >
                <Heart
                  className={`h-4 w-4 ${
                    isInWishlist ? "fill-destructive text-destructive" : ""
                  }`}
                />
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 rounded-lg p-3">
              <Sparkles className="h-4 w-4" />
              <span>AI recommends this based on your preferences</span>
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Leaf className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">100% Natural</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Fast Shipping</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Quality Assured</p>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="description">
                <AccordionTrigger>Description</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </AccordionContent>
              </AccordionItem>
              {product.brewingInstructions && (
                <AccordionItem value="brewing">
                  <AccordionTrigger>Brewing Guide</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {product.brewingInstructions}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}
              {product.ingredients && (
                <AccordionItem value="ingredients">
                  <AccordionTrigger>Ingredients</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{product.ingredients}</p>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
