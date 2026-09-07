import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { useStore } from "./lib/store";
import { subscribeToAuthState, getUserDocument, createUserDocument } from "./lib/firebase";
import type { Product } from "@shared/schema";
import Home from "./pages/home";
import Products from "./pages/products";
import ProductDetail from "./pages/product-detail";
import Login from "./pages/login";
import Checkout from "./pages/checkout";
import Orders from "./pages/orders";
import Wishlist from "./pages/wishlist";
import Rewards from "./pages/rewards";
import About from "./pages/about";
import AdminDashboard from "./pages/admin/index";
import AdminOrders from "./pages/admin/orders";
import AdminProducts from "./pages/admin/products";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/login" component={Login} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/orders" component={Orders} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/rewards" component={Rewards} />
      <Route path="/about" component={About} />
      <Route path="/admin" component={AdminDashboard} />

      <Route path="/admin/orders" component={AdminOrders} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthListener() {
  const { setUser, setAuthLoading, setWishlist, setCart, setRewards } = useStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          let userData = await getUserDocument(firebaseUser.uid);
          if (!userData) {
            userData = await createUserDocument(firebaseUser);
          }
          setUser(userData);
          setWishlist(userData.wishlist || []);
          setCart(userData.cart || []);
        } catch (error) {
          console.error("Error loading user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
        setWishlist([]);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setAuthLoading, setWishlist, setCart, setRewards]);

  return null;
}

function ProductsLoader() {
  const { setProducts } = useStore();
  
  const { data } = useQuery<{ products: Product[] }>({
    queryKey: ["/api/products"],
  });

  useEffect(() => {
    if (data?.products) {
      setProducts(data.products);
    }
  }, [data, setProducts]);

  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthListener />
          <ProductsLoader />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
