import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Package, ShoppingCart, TrendingUp, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { useStore } from "../../lib/store";
import { getAllOrders, getProducts } from "../../lib/firebase";
import type { Order, Product, InventoryAlert } from "../../../../shared/schema";

export default function AdminDashboard() {
  const { user, isAuthLoading } = useStore();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && (!user || user.role !== "admin")) {
      setLocation("/");
      return;
    }
    if (isAuthLoading || !user) return;
    const fetchData = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([
          getAllOrders(),
          getProducts(),
        ]);
        setOrders(ordersData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isAuthLoading, setLocation]);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const totalOrders = orders.length;

  const lowStockAlerts: InventoryAlert[] = products.flatMap((product) =>
    product.variations
      .filter((v) => v.stock < 20)
      .map((v) => ({
        productId: product.id,
        productName: product.name,
        packSize: v.packSize,
        currentStock: v.stock,
        threshold: 20,
        urgency: v.stock === 0 ? "out_of_stock" as const : v.stock < 5 ? "critical" as const : "low" as const,
      }))
  );

  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-medium">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your store performance
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          data-testid="button-refresh-dashboard"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card data-testid="card-total-revenue">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs.{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From {totalOrders} orders
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-orders">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingOrders} pending
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-products">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active listings
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-inventory-alerts">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Inventory Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockAlerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Low stock items
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card data-testid="card-recent-orders">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders" data-testid="link-view-all-orders">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                No orders yet
              </p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-4 pb-4 border-b last:border-0 last:pb-0"
                    data-testid={`order-row-${order.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        Order #{order.id.slice(-8)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">Rs.{order.total}</p>
                      <Badge
                        variant={
                          order.status === "delivered"
                            ? "default"
                            : order.status === "cancelled"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-low-stock">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle>Low Stock Alerts</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products" data-testid="link-manage-products">
                Manage
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {lowStockAlerts.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                All products well stocked
              </p>
            ) : (
              <div className="space-y-4">
                {lowStockAlerts.slice(0, 5).map((alert, idx) => (
                  <div
                    key={`${alert.productId}-${alert.packSize}-${idx}`}
                    className="flex items-center justify-between gap-4 pb-4 border-b last:border-0 last:pb-0"
                    data-testid={`alert-row-${alert.productId}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {alert.productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Pack of {alert.packSize}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{alert.currentStock} left</p>
                      <Badge
                        variant={
                          alert.urgency === "out_of_stock"
                            ? "destructive"
                            : alert.urgency === "critical"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {alert.urgency.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-8">
        <Button variant="outline" size="lg" asChild className="h-auto py-6">
          <Link href="/admin/orders" data-testid="link-admin-orders">
            <ShoppingCart className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Manage Orders</div>
              <div className="text-xs text-muted-foreground">
                Update order status and tracking
              </div>
            </div>
          </Link>
        </Button>

        <Button variant="outline" size="lg" asChild className="h-auto py-6">
          <Link href="/admin/products" data-testid="link-admin-products">
            <Package className="h-5 w-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Manage Products</div>
              <div className="text-xs text-muted-foreground">
                Add, edit, and manage inventory
              </div>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
}
