import { Link } from "wouter";
import { Leaf, Heart, Award, Users, ArrowRight, MapPin, Mail, Phone } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import lifestyleImage from "../assets/generated_images/blue_tea_lifestyle_scene.png";

const values = [
  {
    icon: Leaf,
    title: "100% Natural",
    description:
      "We source only the finest butterfly pea flowers, grown without pesticides or harmful chemicals.",
  },
  {
    icon: Heart,
    title: "Wellness First",
    description:
      "Our teas are rich in antioxidants and natural compounds that support your overall health.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "Every batch undergoes rigorous quality testing to ensure the highest standards.",
  },
  {
    icon: Users,
    title: "Community Focused",
    description:
      "We work directly with farmers, ensuring fair wages and sustainable practices.",
  },
];

const milestones = [
  { year: "2020", title: "Founded", description: "Flowey was born from a passion for premium tea" },
  { year: "2021", title: "First 1000 Customers", description: "Growing community of tea lovers" },
  { year: "2022", title: "National Expansion", description: "Shipping across India" },
  { year: "2023", title: "AI-Powered Experience", description: "Personalized recommendations launched" },
];

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-serif text-4xl lg:text-5xl font-medium mb-6">
                The Story of Flowey
              </h1>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                At Flowey, we believe that every cup of tea should be an experience.
                Our journey began with a simple mission: to bring the exquisite beauty
                and health benefits of butterfly pea flower tea to tea lovers everywhere.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                What started as a passion project in 2020 has grown into a beloved
                brand trusted by thousands. We carefully source our flowers from
                sustainable farms, ensuring that every sip delivers the authentic
                taste and remarkable color-changing properties that make blue tea unique.
              </p>
              <Button asChild>
                <Link href="/products" data-testid="button-explore-products">
                  Explore Our Products
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src={lifestyleImage}
                alt="Blue tea lifestyle"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm opacity-90">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-medium mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do, from sourcing to shipping.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} data-testid={`card-value-${value.title.toLowerCase().replace(" ", "-")}`}>
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-card border-y">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-medium mb-4">
              Our Journey
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From a small idea to a nationwide brand loved by tea enthusiasts.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.year}
                    className="relative pl-12"
                    data-testid={`milestone-${milestone.year}`}
                  >
                    <div className="absolute left-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm text-primary font-medium mb-1">
                        {milestone.year}
                      </div>
                      <h3 className="font-medium mb-1">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-3xl font-medium mb-6">
                Get in Touch
              </h2>
              <p className="text-muted-foreground mb-8">
                Have questions about our products or want to collaborate? We would love
                to hear from you.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium" data-testid="text-email">ashwinkumaras59@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium" data-testid="text-phone">+91 9840436472</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium" data-testid="text-address">
                      no 3 kamarajar st, Babu nagar pattabiram,ch-72
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">
                  <Leaf className="h-16 w-16 mx-auto text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-medium mb-4">
                  Join Our Community
                </h3>
                <p className="text-muted-foreground mb-6">
                  Sign up for updates on new products, exclusive offers, and tea tips.
                </p>
                <Button asChild className="w-full">
                  <Link href="/login" data-testid="button-join-community">
                    Create Account
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
