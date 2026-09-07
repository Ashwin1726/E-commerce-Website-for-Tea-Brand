import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronRight, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Separator } from "../components/ui/separator";
import { useStore } from "../lib/store";
import { subscribeToOrders } from "../lib/firebase";
import type { Order } from "@shared/schema";
import teaBoxImage from "../assets/generated_images/flowey_premium_tea_box.png";

const statusConfig = {
  pending: { icon: Clock, label: "Pending", color: "bg-yellow-500" },
  packed: { icon: Package, label: "Packed", color: "bg-blue-500" },
  shipped: { icon: Truck, label: "Shipped", color: "bg-purple-500" },
  delivered: { icon: CheckCircle, label: "Delivered", color: "bg-green-500" },
  cancelled: { icon: XCircle, label: "Cancelled", color: "bg-red-500" },
};

export default function Orders() {
  const { user, products } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToOrders(user.id, (fetchedOrders) => {
      setOrders(fetchedOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const getProductImage = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product?.images?.[0] || teaBoxImage;
  };

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-medium mb-4">Please Login</h1>
        <p className="text-muted-foreground mb-8">
          Login to view your order history
        </p>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <h1 className="font-serif text-3xl font-medium mb-8">My Orders</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="w-20 h-20 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
          <Package className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-medium mb-4">No Orders Yet</h1>
        <p className="text-muted-foreground mb-8">
          Your order history will appear here once you make a purchase
        </p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-6 py-8">
        <h1 className="font-serif text-3xl font-medium mb-8">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;

            return (
              <Card key={order.id} data-testid={`order-card-${order.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                        <Badge variant="secondary" className={`${status.color} text-white`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Rs.{order.total.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex-shrink-0 w-16 h-16 rounded-lg bg-muted overflow-hidden"
                      >
                        <img
                          src={getProductImage(item.productId)}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </span>
                    </div>

                    {order.trackingId && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Tracking: </span>
                        <span className="font-medium">{order.trackingId}</span>
                      </div>
                    )}
                  </div>

                  {order.status !== "delivered" && order.status !== "cancelled" && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {["pending", "packed", "shipped", "delivered"].map((step, idx) => {
                            const stepIndex = ["pending", "packed", "shipped", "delivered"].indexOf(order.status);
                            const isActive = idx <= stepIndex;
                            const StepIcon = statusConfig[step as keyof typeof statusConfig].icon;
                            
                            return (
                              <div key={step} className="flex items-center gap-2">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    isActive ? "bg-primary text-primary-foreground" : "bg-muted"
                                  }`}
                                >
                                  <StepIcon className="h-4 w-4" />
                                </div>
                                {idx < 3 && (
                                  <div
                                    className={`w-8 h-0.5 ${
                                      idx < stepIndex ? "bg-primary" : "bg-muted"
                                    }`}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
