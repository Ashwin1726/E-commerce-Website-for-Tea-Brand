// Firebase configuration for Flowey e-commerce app
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, orderBy, limit, addDoc, deleteDoc, onSnapshot, Timestamp } from "firebase/firestore";
import type { User, Product, Order, CartItem, Reward } from "@shared/schema";

const firebaseConfig = {
  apiKey: "AIzaSyD-AH3gZ0KKbElL9GqiZldsBIjZppddLBY",
  authDomain: "flowey-2dbb3.firebaseapp.com",
  projectId: "flowey-2dbb3",
  storageBucket: "flowey-2dbb3.firebasestorage.app",
  messagingSenderId: "585507578458",
  appId: "1:585507578458:web:0600f8f24c84f7479d2e63",
  measurementId: "G-HS08JQ0FBY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const signInWithEmail = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);

export const signUpWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const logOut = () => signOut(auth);

// User functions
export const createUserDocument = async (firebaseUser: FirebaseUser, role: "customer" | "admin" = "customer"): Promise<User> => {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const newUser: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || "User",
      photoURL: firebaseUser.photoURL || undefined,
      role,
      loyaltyPoints: 0,
      loyaltyTier: "bronze",
      wishlist: [],
      cart: [],
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    await setDoc(userRef, newUser);
    return newUser;
  }
  
  return userSnap.data() as User;
};

export const getUserDocument = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() as User : null;
};

export const updateUserDocument = async (userId: string, data: Partial<User>) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data);
};

// Product functions (use backend API)
export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch("/api/products");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const data = await response.json();
  return data.products || [];
};

export const getProduct = async (productId: string): Promise<Product | null> => {
  const response = await fetch(`/api/products/${productId}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error("Failed to fetch product");
  }
  const data = await response.json();
  return data.product || null;
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const products = await getProducts();
  return products.filter(p => p.isFeatured).slice(0, 8);
};

export const createProduct = async (product: Omit<Product, "id" | "createdAt">): Promise<string> => {
  const productsRef = collection(db, "products");
  const docRef = await addDoc(productsRef, {
    ...product,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const updateProduct = async (productId: string, data: Partial<Product>) => {
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, data);
};

export const deleteProduct = async (productId: string) => {
  const productRef = doc(db, "products", productId);
  await deleteDoc(productRef);
};

// Cart functions
export const updateCart = async (userId: string, cart: CartItem[]) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { cart });
};

// Wishlist functions
export const updateWishlist = async (userId: string, wishlist: string[]) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { wishlist });
};

// Order functions
export const createOrder = async (order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  const ordersRef = collection(db, "orders");
  const now = new Date().toISOString();
  const docRef = await addDoc(ordersRef, {
    ...order,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
};

export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
};

export const getAllOrders = async (): Promise<Order[]> => {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
};

export const updateOrder = async (orderId: string, data: Partial<Order>) => {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, { ...data, updatedAt: new Date().toISOString() });
};

// Rewards functions
export const createReward = async (reward: Omit<Reward, "id" | "createdAt">): Promise<string> => {
  const rewardsRef = collection(db, "rewards");
  const docRef = await addDoc(rewardsRef, {
    ...reward,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const getRewardsByUser = async (userId: string): Promise<Reward[]> => {
  const rewardsRef = collection(db, "rewards");
  const q = query(rewardsRef, where("userId", "==", userId), where("isUsed", "==", false));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Reward));
};

export const useReward = async (rewardId: string) => {
  const rewardRef = doc(db, "rewards", rewardId);
  await updateDoc(rewardRef, { isUsed: true });
};

// Real-time listeners
export const subscribeToOrders = (userId: string, callback: (orders: Order[]) => void) => {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
    callback(orders);
  });
};

export const subscribeToAllOrders = (callback: (orders: Order[]) => void) => {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Order));
    callback(orders);
  });
};

export const subscribeToAuthState = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export type { FirebaseUser };
