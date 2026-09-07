// Global state management with Zustand for Flowey e-commerce
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Product, CartItem, Reward } from "@shared/schema";

interface AppState {
  user: User | null;
  isAuthLoading: boolean;
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  rewards: Reward[];
  isCartOpen: boolean;
  searchQuery: string;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setProducts: (products: Product[]) => void;
  setCart: (cart: CartItem[]) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, packSize: number) => void;
  updateCartQuantity: (productId: string, packSize: number, quantity: number) => void;
  clearCart: () => void;
  setWishlist: (wishlist: string[]) => void;
  toggleWishlist: (productId: string) => void;
  setRewards: (rewards: Reward[]) => void;
  setCartOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthLoading: true,
      products: [],
      cart: [],
      wishlist: [],
      rewards: [],
      isCartOpen: false,
      searchQuery: "",

      setUser: (user) => set({ user }),
      setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
      setProducts: (products) => set({ products }),
      
      setCart: (cart) => set({ cart }),
      
      addToCart: (item) => {
        const { cart } = get();
        const existingIndex = cart.findIndex(
          (i) => i.productId === item.productId && i.packSize === item.packSize
        );
        
        if (existingIndex >= 0) {
          const newCart = [...cart];
          newCart[existingIndex].quantity += item.quantity;
          set({ cart: newCart });
        } else {
          set({ cart: [...cart, item] });
        }
      },
      
      removeFromCart: (productId, packSize) => {
        const { cart } = get();
        set({
          cart: cart.filter(
            (item) => !(item.productId === productId && item.packSize === packSize)
          ),
        });
      },
      
      updateCartQuantity: (productId, packSize, quantity) => {
        const { cart } = get();
        if (quantity <= 0) {
          set({
            cart: cart.filter(
              (item) => !(item.productId === productId && item.packSize === packSize)
            ),
          });
        } else {
          set({
            cart: cart.map((item) =>
              item.productId === productId && item.packSize === packSize
                ? { ...item, quantity }
                : item
            ),
          });
        }
      },
      
      clearCart: () => set({ cart: [] }),
      
      setWishlist: (wishlist) => set({ wishlist }),
      
      toggleWishlist: (productId) => {
        const { wishlist } = get();
        if (wishlist.includes(productId)) {
          set({ wishlist: wishlist.filter((id) => id !== productId) });
        } else {
          set({ wishlist: [...wishlist, productId] });
        }
      },
      
      setRewards: (rewards) => set({ rewards }),
      setCartOpen: (isCartOpen) => set({ isCartOpen }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
    }),
    {
      name: "flowey-store",
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
      }),
    }
  )
);

// Computed values
export const useCartTotal = () => {
  const cart = useStore((state) => state.cart);
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const useCartItemCount = () => {
  const cart = useStore((state) => state.cart);
  return cart.reduce((count, item) => count + item.quantity, 0);
};

export const useIsInWishlist = (productId: string) => {
  const wishlist = useStore((state) => state.wishlist);
  return wishlist.includes(productId);
};
