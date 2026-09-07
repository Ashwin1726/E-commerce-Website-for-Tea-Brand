import { useState } from "react";
import { Gift, Leaf, Truck, Shield, Star, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { HeroSection } from "../components/hero-section";
import { FeaturedProducts } from "../components/featured-products";
import { SpinWheel } from "../components/spin-wheel";
import { useStore } from "../lib/store";
import collectionImage from "../assets/generated_images/tea_gift_collection_display.png";

const trustBadges = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Pure butterfly pea flower tea",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders above Rs.499",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "Premium grade tea leaves",
  },
  {
    icon: Star,
    title: "4.9 Rating",
    description: "From 50K+ customers",
  },
];

export default function Home() {
  const [spinWheelOpen, setSpinWheelOpen] = useState(false);
  const { user } = useStore();

  return (
    <div className="min-h-screen">
      <HeroSection />

      <section className="py-12 bg-card border-y">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {trustBadges.map((badge) => (
              <div
                key={badge.title}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <badge.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{badge.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProducts />

      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/5">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-medium mb-6">
                The Perfect Gift Collection
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Delight your loved ones with our exquisite gift sets. Each
                collection is thoughtfully curated and elegantly packaged,
                making it the perfect present for any tea enthusiast.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Star className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Premium Packaging</h4>
                    <p className="text-sm text-muted-foreground">
                      Luxurious gift boxes with gold foil details
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Gift className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Personalized Messages</h4>
                    <p className="text-sm text-muted-foreground">
                      Add a custom note to make it special
                    </p>
                  </div>
                </div>
              </div>
              <Button asChild>
                <Link href="/products" data-testid="button-shop-gifts">
                  Shop Gift Sets
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src={collectionImage}
                alt="Gift collection"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {user && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <Gift className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Daily Rewards
              </span>
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium mb-4">
              Spin & Win Exciting Prizes
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">
              Try your luck with our daily spin wheel! Win discounts, loyalty
              points, and free shipping on your orders.
            </p>
            <Button
              size="lg"
              onClick={() => setSpinWheelOpen(true)}
              data-testid="button-spin-wheel-open"
            >
              <Gift className="h-4 w-4 mr-2" />
              Spin the Wheel
            </Button>
          </div>
        </section>
      )}

      <SpinWheel open={spinWheelOpen} onOpenChange={setSpinWheelOpen} />
    </div>
  );
}
