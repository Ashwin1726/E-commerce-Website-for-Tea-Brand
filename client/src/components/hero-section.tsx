import { Link } from "wouter";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import heroImage from "../assets/generated_images/blue_tea_lifestyle_scene.png";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Premium blue tea experience"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl">
          <Badge 
            variant="outline" 
            className="mb-6 bg-white/10 backdrop-blur-sm border-white/20 text-white"
          >
            <Sparkles className="h-3 w-3 mr-2" />
            AI-Personalized for You
          </Badge>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal text-white mb-6 leading-tight">
            Discover the Art of
            <span className="block text-primary-foreground/90">Premium Blue Tea</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg leading-relaxed">
            Experience the tranquil elegance of butterfly pea flower tea. 
            Handcrafted for connoisseurs who appreciate life's finer moments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="text-base" 
              asChild
            >
              <Link href="/products" data-testid="button-shop-now">
                Shop Premium Tea
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-base bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              asChild
            >
              <Link href="/about" data-testid="button-explore">
                Explore Collections
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/20">
            <div>
              <p className="text-3xl font-semibold text-white">50K+</p>
              <p className="text-sm text-white/60">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white">100%</p>
              <p className="text-sm text-white/60">Natural Ingredients</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-white">4.9</p>
              <p className="text-sm text-white/60">Customer Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
