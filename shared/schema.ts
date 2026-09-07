import { z } from "zod";

// Pack size variations for tea products
export const packSizes = [10, 20, 30, 40, 60, 100] as const;
export type PackSize = typeof packSizes[number];

// Order status enum
export const orderStatuses = ["pending", "packed", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = typeof orderStatuses[number];

// User roles
export const userRoles = ["customer", "admin"] as const;
export type UserRole = typeof userRoles[number];

// Loyalty tiers
export const loyaltyTiers = ["bronze", "silver", "gold", "royal"] as const;
export type LoyaltyTier = typeof loyaltyTiers[number];

// Product variation pricing
export const productVariationSchema = z.object({
  packSize: z.number(),
  price: z.number(),
  compareAtPrice: z.number().optional(),
  stock: z.number(),
});
export type ProductVariation = z.infer<typeof productVariationSchema>;

// Product schema
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  shortDescription: z.string(),
  category: z.string(),
  images: z.array(z.string()),
  variations: z.array(productVariationSchema),
  tags: z.array(z.string()),
  isFeatured: z.boolean(),
  isNew: z.boolean(),
  isBestseller: z.boolean(),
  brewingInstructions: z.string().optional(),
  ingredients: z.string().optional(),
  createdAt: z.string(),
});
export type Product = z.infer<typeof productSchema>;

export const insertProductSchema = productSchema.omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;

// Cart item schema
export const cartItemSchema = z.object({
  productId: z.string(),
  packSize: z.number(),
  quantity: z.number(),
  price: z.number(),
});
export type CartItem = z.infer<typeof cartItemSchema>;

// Order item schema
export const orderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  packSize: z.number(),
  quantity: z.number(),
  price: z.number(),
});
export type OrderItem = z.infer<typeof orderItemSchema>;

// Address schema
export const addressSchema = z.object({
  fullName: z.string(),
  phone: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
});
export type Address = z.infer<typeof addressSchema>;

// Order schema
export const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(orderItemSchema),
  shippingAddress: addressSchema,
  status: z.enum(orderStatuses),
  trackingId: z.string().optional(),
  subtotal: z.number(),
  shippingCost: z.number(),
  discount: z.number(),
  total: z.number(),
  paymentMethod: z.string(),
  paymentStatus: z.string(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Order = z.infer<typeof orderSchema>;

export const insertOrderSchema = orderSchema.omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;

// User schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  photoURL: z.string().optional(),
  role: z.enum(userRoles),
  loyaltyPoints: z.number(),
  loyaltyTier: z.enum(loyaltyTiers),
  wishlist: z.array(z.string()),
  cart: z.array(cartItemSchema),
  addresses: z.array(addressSchema),
  createdAt: z.string(),
});
export type User = z.infer<typeof userSchema>;

export const insertUserSchema = userSchema.omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;

// Reward/Spin result schema
export const rewardSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(["discount", "points", "free_shipping", "free_product"]),
  value: z.number(),
  code: z.string().optional(),
  expiresAt: z.string(),
  isUsed: z.boolean(),
  createdAt: z.string(),
});
export type Reward = z.infer<typeof rewardSchema>;

// AI Recommendation schema
export const recommendationSchema = z.object({
  productId: z.string(),
  score: z.number(),
  reason: z.string(),
});
export type Recommendation = z.infer<typeof recommendationSchema>;

// Inventory alert schema
export const inventoryAlertSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  packSize: z.number(),
  currentStock: z.number(),
  threshold: z.number(),
  urgency: z.enum(["low", "critical", "out_of_stock"]),
});
export type InventoryAlert = z.infer<typeof inventoryAlertSchema>;

// Analytics data schema
export const analyticsSchema = z.object({
  totalRevenue: z.number(),
  totalOrders: z.number(),
  averageOrderValue: z.number(),
  topProducts: z.array(z.object({
    productId: z.string(),
    productName: z.string(),
    sales: z.number(),
    revenue: z.number(),
  })),
  recentOrders: z.array(orderSchema),
  lowStockAlerts: z.array(inventoryAlertSchema),
});
export type Analytics = z.infer<typeof analyticsSchema>;
