import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { z, ZodError } from "zod";
import type { Product, InventoryAlert, Recommendation } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function isOpenAIConfigured(): boolean {
  const key = process.env.OPENAI_API_KEY;
  return !!key && key.startsWith("sk-");
}

const recommendationRequestSchema = z.object({
  preferences: z.string(),
  purchaseHistory: z.array(z.string()).optional(),
});

const descriptionRequestSchema = z.object({
  name: z.string(),
  category: z.string(),
  ingredients: z.string().optional(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/ai/recommendations", async (req, res) => {
    try {
      const body = recommendationRequestSchema.parse(req.body);
      const { preferences, purchaseHistory } = body;

      const products = await storage.getAllProducts();
      
      if (products.length === 0) {
        return res.json({ recommendations: [] });
      }

      if (!isOpenAIConfigured()) {
        const fallbackRecommendations: Recommendation[] = products
          .slice(0, 4)
          .map((p, i) => ({
            productId: p.id,
            score: 0.9 - i * 0.1,
            reason: `Recommended based on our bestselling ${p.category} products`,
          }));
        return res.json({ recommendations: fallbackRecommendations });
      }

      const productList = products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        description: p.shortDescription,
        tags: p.tags,
      }));

      const prompt = `You are a tea recommendation expert for Flowey, a premium blue tea brand. 
Based on the customer's preferences and purchase history, recommend the best products from our catalog.

Customer Preferences: ${preferences}
${purchaseHistory?.length ? `Previous Purchases: ${purchaseHistory.join(", ")}` : ""}

Available Products:
${JSON.stringify(productList, null, 2)}

Provide recommendations in JSON format:
{
  "recommendations": [
    { "productId": "id", "score": 0.95, "reason": "Why this product fits" }
  ]
}

Return up to 4 products, sorted by relevance. Only include products from the list above.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        return res.json({ recommendations: [] });
      }

      const parsed = JSON.parse(content);
      const recommendations: Recommendation[] = parsed.recommendations || [];

      res.json({ recommendations });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid request", details: error.errors });
      }
      console.error("AI recommendations error:", error);
      const products = await storage.getAllProducts();
      const fallbackRecommendations: Recommendation[] = products
        .slice(0, 4)
        .map((p, i) => ({
          productId: p.id,
          score: 0.9 - i * 0.1,
          reason: `Recommended from our ${p.category} collection`,
        }));
      res.json({ recommendations: fallbackRecommendations });
    }
  });

  app.post("/api/ai/description", async (req, res) => {
    try {
      const body = descriptionRequestSchema.parse(req.body);
      const { name, category, ingredients } = body;

      if (!isOpenAIConfigured()) {
        return res.json({
          description: `Discover the exquisite ${name} from our ${category}. ${ingredients ? `Crafted with ${ingredients.toLowerCase()}, this ` : "This "}premium blend offers a soothing experience that nurtures both body and mind.`,
          shortDescription: `Premium ${category.toLowerCase()} tea for mindful moments`,
        });
      }

      const prompt = `You are a copywriter for Flowey, a premium blue tea brand known for elegant, health-conscious products.

Generate a compelling product description for:
Name: ${name}
Category: ${category}
${ingredients ? `Ingredients: ${ingredients}` : ""}

Provide the response in JSON format:
{
  "description": "A detailed, elegant product description (2-3 sentences)",
  "shortDescription": "A brief tagline (under 15 words)"
}

The tone should be sophisticated, calming, and emphasize wellness benefits.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        return res.status(500).json({ error: "Failed to generate description" });
      }

      const parsed = JSON.parse(content);
      res.json({
        description: parsed.description || "",
        shortDescription: parsed.shortDescription || "",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid request", details: error.errors });
      }
      console.error("AI description error:", error);
      res.json({
        description: `Experience the refined taste of ${req.body.name || "our premium tea"}. Carefully curated for those who appreciate quality and wellness.`,
        shortDescription: "Premium tea for discerning tastes",
      });
    }
  });

  app.post("/api/products/seed", async (req, res) => {
    try {
      const seedProducts: Omit<Product, "id" | "createdAt">[] = [
        {
          name: "Flowey Classic Blue",
          description: "Our signature blue tea blend, carefully crafted from premium butterfly pea flowers harvested at peak bloom. This enchanting tea transforms from deep blue to purple when you add a splash of citrus, creating a mesmerizing experience with every cup. Rich in antioxidants and naturally caffeine-free, it's the perfect companion for mindful moments.",
          shortDescription: "Signature butterfly pea flower tea with color-changing magic",
          category: "Classic Collection",
          images: ["/attached_assets/generated_images/flowey_premium_tea_box.png"],
          variations: [
            { packSize: 10, price: 299, compareAtPrice: 349, stock: 100 },
            { packSize: 20, price: 549, compareAtPrice: 649, stock: 80 },
            { packSize: 30, price: 749, compareAtPrice: 899, stock: 60 },
            { packSize: 40, price: 949, compareAtPrice: 1149, stock: 40 },
            { packSize: 60, price: 1299, compareAtPrice: 1549, stock: 30 },
            { packSize: 100, price: 1999, compareAtPrice: 2399, stock: 20 },
          ],
          tags: ["bestseller", "antioxidant", "caffeine-free", "color-changing"],
          isFeatured: true,
          isNew: false,
          isBestseller: true,
          brewingInstructions: "Steep 3-5 tea bags in 200ml hot water (85°C) for 3-5 minutes. Add lemon or lime for a magical color transformation.",
          ingredients: "100% Butterfly Pea Flowers (Clitoria ternatea)",
        },
        {
          name: "Flowey Lavender Dreams",
          description: "A soothing blend of butterfly pea flowers and French lavender, designed to calm the mind and uplift the spirit. This aromatic infusion combines the visual magic of blue tea with the renowned relaxing properties of lavender, creating a bedtime ritual you'll cherish.",
          shortDescription: "Calming blue tea with French lavender for restful nights",
          category: "Wellness Collection",
          images: ["/attached_assets/generated_images/blue_tea_lifestyle_scene.png"],
          variations: [
            { packSize: 10, price: 349, compareAtPrice: 399, stock: 75 },
            { packSize: 20, price: 649, compareAtPrice: 749, stock: 55 },
            { packSize: 30, price: 899, compareAtPrice: 1049, stock: 45 },
            { packSize: 40, price: 1099, compareAtPrice: 1299, stock: 35 },
            { packSize: 60, price: 1499, compareAtPrice: 1749, stock: 25 },
            { packSize: 100, price: 2299, compareAtPrice: 2699, stock: 15 },
          ],
          tags: ["relaxation", "lavender", "sleep-aid", "stress-relief"],
          isFeatured: true,
          isNew: true,
          isBestseller: false,
          brewingInstructions: "Steep 2-3 tea bags in 200ml hot water (80°C) for 4-6 minutes. Best enjoyed 30 minutes before bedtime.",
          ingredients: "Butterfly Pea Flowers, French Lavender, Chamomile",
        },
        {
          name: "Flowey Citrus Burst",
          description: "Experience the vibrant fusion of blue tea with zesty lemon and orange peel. This refreshing blend is designed for those who love a tangy twist with their tea. Watch as the blue transforms to purple with every sip, thanks to the natural citrus acids.",
          shortDescription: "Zesty blue tea blend with natural citrus twist",
          category: "Refreshing Collection",
          images: ["/attached_assets/generated_images/tea_gift_collection_display.png"],
          variations: [
            { packSize: 10, price: 329, compareAtPrice: 379, stock: 90 },
            { packSize: 20, price: 599, compareAtPrice: 699, stock: 70 },
            { packSize: 30, price: 849, compareAtPrice: 999, stock: 50 },
            { packSize: 40, price: 1049, compareAtPrice: 1249, stock: 35 },
            { packSize: 60, price: 1449, compareAtPrice: 1699, stock: 20 },
            { packSize: 100, price: 2199, compareAtPrice: 2599, stock: 10 },
          ],
          tags: ["citrus", "vitamin-c", "refreshing", "immunity"],
          isFeatured: false,
          isNew: true,
          isBestseller: false,
          brewingInstructions: "Steep 2-3 tea bags in 200ml hot or cold water for 3-5 minutes. Perfect for iced tea preparations.",
          ingredients: "Butterfly Pea Flowers, Lemon Peel, Orange Peel, Lemongrass",
        },
        {
          name: "Flowey Mint Fresh",
          description: "A cooling blend that marries the beauty of blue tea with crisp peppermint. This invigorating combination aids digestion and freshens the palate, making it an excellent choice after meals or as an afternoon pick-me-up.",
          shortDescription: "Cooling blue tea with refreshing peppermint",
          category: "Refreshing Collection",
          images: ["/attached_assets/generated_images/flowey_premium_tea_box.png"],
          variations: [
            { packSize: 10, price: 319, compareAtPrice: 369, stock: 85 },
            { packSize: 20, price: 589, compareAtPrice: 689, stock: 65 },
            { packSize: 30, price: 829, compareAtPrice: 979, stock: 45 },
            { packSize: 40, price: 1029, compareAtPrice: 1229, stock: 30 },
            { packSize: 60, price: 1429, compareAtPrice: 1679, stock: 8 },
            { packSize: 100, price: 2149, compareAtPrice: 2549, stock: 5 },
          ],
          tags: ["mint", "digestive", "cooling", "after-meal"],
          isFeatured: false,
          isNew: false,
          isBestseller: false,
          brewingInstructions: "Steep 2-3 tea bags in 200ml hot water (85°C) for 3-4 minutes. Excellent hot or over ice.",
          ingredients: "Butterfly Pea Flowers, Peppermint Leaves, Spearmint",
        },
        {
          name: "Flowey Royal Blend",
          description: "Our most luxurious offering, the Royal Blend combines butterfly pea flowers with rare saffron threads and cardamom. This opulent tea is reserved for special occasions and discerning palates who appreciate the finer things in life.",
          shortDescription: "Premium blue tea with saffron and cardamom",
          category: "Luxury Collection",
          images: ["/attached_assets/generated_images/tea_gift_collection_display.png"],
          variations: [
            { packSize: 10, price: 499, compareAtPrice: 599, stock: 40 },
            { packSize: 20, price: 949, compareAtPrice: 1149, stock: 30 },
            { packSize: 30, price: 1349, compareAtPrice: 1649, stock: 20 },
            { packSize: 40, price: 1699, compareAtPrice: 2099, stock: 15 },
            { packSize: 60, price: 2399, compareAtPrice: 2899, stock: 10 },
            { packSize: 100, price: 3799, compareAtPrice: 4599, stock: 5 },
          ],
          tags: ["luxury", "saffron", "premium", "gift-worthy"],
          isFeatured: true,
          isNew: false,
          isBestseller: false,
          brewingInstructions: "Steep 1-2 tea bags in 150ml hot water (80°C) for 5-7 minutes to fully release the saffron.",
          ingredients: "Butterfly Pea Flowers, Saffron Threads, Cardamom, Rose Petals",
        },
        {
          name: "Flowey Immunity Shield",
          description: "A powerful wellness blend crafted for modern immunity needs. This therapeutic tea combines butterfly pea flowers with turmeric, ginger, and black pepper for enhanced absorption. Start your day with this golden-blue elixir for optimal health.",
          shortDescription: "Immunity-boosting blend with turmeric and ginger",
          category: "Wellness Collection",
          images: ["/attached_assets/generated_images/blue_tea_lifestyle_scene.png"],
          variations: [
            { packSize: 10, price: 379, compareAtPrice: 449, stock: 70 },
            { packSize: 20, price: 699, compareAtPrice: 849, stock: 50 },
            { packSize: 30, price: 999, compareAtPrice: 1199, stock: 35 },
            { packSize: 40, price: 1249, compareAtPrice: 1499, stock: 25 },
            { packSize: 60, price: 1749, compareAtPrice: 2099, stock: 15 },
            { packSize: 100, price: 2699, compareAtPrice: 3249, stock: 8 },
          ],
          tags: ["immunity", "turmeric", "ginger", "anti-inflammatory"],
          isFeatured: false,
          isNew: true,
          isBestseller: false,
          brewingInstructions: "Steep 2-3 tea bags in 200ml hot water (90°C) for 5-7 minutes. Add honey and black pepper for best results.",
          ingredients: "Butterfly Pea Flowers, Turmeric Root, Ginger, Black Pepper, Tulsi",
        },
      ];

      const createdProducts: Product[] = [];
      for (const product of seedProducts) {
        const created = await storage.createProduct(product);
        createdProducts.push(created);
      }

      res.json({ 
        success: true, 
        message: `Seeded ${createdProducts.length} products`,
        products: createdProducts 
      });
    } catch (error) {
      console.error("Seed products error:", error);
      res.status(500).json({ error: "Failed to seed products" });
    }
  });

  app.get("/api/inventory/alerts", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      const alerts: InventoryAlert[] = [];
      const threshold = 10;

      for (const product of products) {
        for (const variation of product.variations) {
          if (variation.stock <= threshold) {
            let urgency: "low" | "critical" | "out_of_stock" = "low";
            if (variation.stock === 0) {
              urgency = "out_of_stock";
            } else if (variation.stock <= 5) {
              urgency = "critical";
            }

            alerts.push({
              productId: product.id,
              productName: product.name,
              packSize: variation.packSize,
              currentStock: variation.stock,
              threshold,
              urgency,
            });
          }
        }
      }

      alerts.sort((a, b) => {
        const urgencyOrder = { out_of_stock: 0, critical: 1, low: 2 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      });

      res.json({ alerts });
    } catch (error) {
      console.error("Inventory alerts error:", error);
      res.status(500).json({ error: "Failed to get inventory alerts" });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json({ products });
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ error: "Failed to get products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ product });
    } catch (error) {
      console.error("Get product error:", error);
      res.status(500).json({ error: "Failed to get product" });
    }
  });

  return httpServer;
}
