import { Link } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { Separator } from "../components/ui/separator";
import { Progress } from "../components/ui/progress";
import { ScrollArea } from "../components/ui/scroll-area";
import { useStore, useCartTotal, useCartItemCount } from "../lib/store";
import teaBoxImage from "../assets/generated_images/flowey_premium_tea_box.png";

const FREE_SHIPPING_THRESHOLD = 499;

export function CartDrawer() {
  const { cart, products, isCartOpen, setCartOpen, updateCartQuantity, removeFromCart } = useStore();
  const cartTotal = useCartTotal();
  const cartItemCount = useCartItemCount();
  
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const freeShippingProgress = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  const getProductDetails = (productId: string) => {
    return products.find((p) => p.id === productId);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
            {cartItemCount > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({cartItemCount} items)
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">
                Add some premium teas to get started
              </p>
            </div>
            <Button onClick={() => setCartOpen(false)} asChild>
              <Link href="/products" data-testid="link-browse-products">
                Browse Products
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {remainingForFreeShipping > 0 && (
              <div className="bg-primary/5 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    Add Rs.{remainingForFreeShipping.toLocaleString()} more for free shipping!
                  </span>
                </div>
                <Progress value={freeShippingProgress} className="h-2" />
              </div>
            )}

            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {cart.map((item) => {
                  const product = getProductDetails(item.productId);
                  return (
                    <div
                      key={`${item.productId}-${item.packSize}`}
                      className="flex gap-4"
                      data-testid={`cart-item-${item.productId}`}
                    >
                      <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        <img
                          src={product?.images?.[0] || teaBoxImage}
                          alt={product?.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">
                          {product?.name || "Product"}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {item.packSize} tea bags
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateCartQuantity(
                                  item.productId,
                                  item.packSize,
                                  item.quantity - 1
                                )
                              }
                              data-testid={`button-decrease-${item.productId}`}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateCartQuantity(
                                  item.productId,
                                  item.packSize,
                                  item.quantity + 1
                                )
                              }
                              data-testid={`button-increase-${item.productId}`}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              removeFromCart(item.productId, item.packSize)
                            }
                            data-testid={`button-remove-${item.productId}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          Rs.{(item.price * item.quantity).toLocaleString()}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground">
                            Rs.{item.price.toLocaleString()} each
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="pt-4 space-y-4">
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rs.{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className={remainingForFreeShipping <= 0 ? "text-green-600" : ""}>
                    {remainingForFreeShipping <= 0 ? "Free" : "Rs.49"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    Rs.{(cartTotal + (remainingForFreeShipping <= 0 ? 0 : 49)).toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => setCartOpen(false)}
                asChild
              >
                <Link href="/checkout" data-testid="button-checkout">
                  Proceed to Checkout
                </Link>
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
