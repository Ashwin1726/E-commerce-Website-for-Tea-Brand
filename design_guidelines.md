# Flowey Premium Tea E-Commerce Design Guidelines

## Design Approach

**Reference-Based Luxury E-Commerce**
Drawing inspiration from premium digital storefronts like Blue Bottle Coffee, Aesop, and high-end Shopify stores. The design emphasizes sophistication, breathing room, and trust-building through clean aesthetics and purposeful visual hierarchy.

**Core Principle**: Convey premium quality through restraint, elegance, and strategic use of whitespace rather than visual clutter.

## Color Foundation

Light-blue luxury theme as specified - soft, calming blues that evoke premium tea culture with clean whites and subtle accents. Color palette will be refined in implementation phase.

## Typography System

**Font Families** (via Google Fonts):
- **Primary**: Playfair Display (serif) - Headers, product names, luxury messaging
- **Secondary**: Inter (sans-serif) - Body text, UI elements, functional content
- **Accent**: Cormorant Garamond (serif) - Quotes, testimonials, special callouts

**Type Scale**:
- Hero Headlines: text-5xl to text-7xl, font-light to font-normal
- Section Headers: text-3xl to text-4xl, font-medium
- Product Titles: text-2xl, font-semibold
- Body Text: text-base to text-lg, leading-relaxed
- Captions/Meta: text-sm, font-light

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Micro spacing (icons, buttons): 2, 4
- Component padding: 6, 8, 12
- Section spacing: 16, 20, 24
- Large breakpoints: 32, 40

**Grid Strategy**:
- Container: max-w-7xl with px-6 for breathing room
- Product grids: 1-2-3-4 column responsive (sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4)
- Content sections: max-w-4xl for readability

**Vertical Rhythm**: 
- Section padding: py-16 on mobile, py-24 on desktop
- Hero sections: min-h-screen or 80vh for impact

## Component Library

### Navigation
**Primary Header**:
- Sticky position with subtle blur backdrop
- Left: Flowey logo (elegant, minimalist wordmark)
- Center: Main nav links (Products, Subscriptions, About, Gamification)
- Right: Search icon, Wishlist count badge, Cart count badge, Profile/Login
- Secondary bar: Trust indicators ("Free Shipping Over ₹499" | "Premium Blue Tea" | "AI-Powered Recommendations")

### Hero Section (Homepage)
**Full-width immersive hero** (80vh):
- Large lifestyle image: Premium tea setup with Flowey packaging in elegant environment (soft natural lighting, minimalist styling)
- Overlay: Gradient fade to ensure text legibility
- Centered content with blurred-background buttons
- Headline: Large serif typography announcing premium positioning
- Subheading: Brief value proposition
- Dual CTAs: Primary "Shop Premium Tea" + Secondary "Explore Collections"
- Floating badge: "AI-Personalized for You" with subtle animation

### Product Display

**Product Cards** (Grid View):
- Image: Aspect ratio 3:4, hover zoom effect
- Badge overlay: "Low Stock" / "Bestseller" / "New"
- Product name: Serif, text-lg
- Variation display: "Available in 6 pack sizes"
- Price: Bold, prominent
- Quick Add to Cart button appears on hover
- Wishlist heart icon (top-right)

**Product Detail Page**:
- Two-column layout (lg:)
- Left: 3D viewer / Image gallery with thumbnails
- Right: Product information hierarchy
  - Name (text-4xl serif)
  - Rating stars + review count
  - Price with pack size selector (buttons, not dropdown)
  - Urgency message: "Only 3 left - AI predicts next restock in 5 days"
  - Quantity selector
  - Add to Cart (large, primary)
  - Add to Wishlist (secondary)
  - Trust badges: "Premium Quality" | "AI Recommended for You"
  - Expandable sections: Description, Brewing Guide, Ingredients

### Shopping Cart
**Slide-out drawer** (right side):
- Header: "Your Cart" with item count
- List items: Image thumbnail, name, variation, quantity controls, remove
- Subtotal calculation
- Upsell section: "Add ₹40 more for free shipping" with progress bar
- AI suggestions: "Complete your collection" with 2-3 product cards
- Primary CTA: "Proceed to Checkout"

### Gamification Elements

**Spin & Win Wheel**:
- Centered modal with premium styling
- Wheel graphic with Flowey branding
- Prizes: Discount codes, free shipping, loyalty points
- "Spin Now" button with shimmer effect
- Rules in collapsed accordion below

**Loyalty Dashboard**:
- Card-based layout showing tier (Silver/Gold/Royal)
- Progress bar to next tier
- Points balance prominently displayed
- Rewards catalog grid (3 columns)
- Achievement badges with unlock conditions

### Admin Dashboard

**Sidebar Navigation**:
- Fixed left sidebar (w-64)
- Sections: Overview, Products, Orders, Customers, Inventory, Analytics, AI Insights, Marketing
- Active state indicator

**Main Content Area**:
- Top bar: Page title, action buttons (right-aligned)
- Stats cards (4-column grid): Revenue, Orders, Low Stock, Active Customers
- Charts: Line graphs for sales trends, bar charts for product performance
- Data tables: Sortable, filterable, with action dropdowns
- Heatmap viewer: Visual click/scroll patterns overlay

### AI Features Presentation

**AI Recommendations Widget**:
- Section header: "Curated Just for You"
- Horizontal scroll carousel of products
- Each card shows AI confidence badge
- Reasoning tooltip: "Based on your recent purchases"

**AI Business Advisor Panel** (Admin):
- Dashboard card with robot/advisor icon
- Daily insights in bulleted list
- Color-coded alerts (green=opportunity, yellow=warning, red=urgent)
- Action buttons for each suggestion

## Forms & Inputs

**Consistent Style**:
- Border: 1px solid with rounded-lg
- Focus state: Ring with light-blue accent
- Labels: Above input, text-sm font-medium
- Helper text: Below input, text-xs
- Error states: Red accent with icon

**Checkout Form**:
- Single-column on mobile, two-column on desktop
- Grouped sections: Contact, Shipping, Payment
- UPI payment: Radio buttons with icons for PhonePe, GPay, Paytm
- Order summary sticky sidebar (desktop)

## Images Strategy

**Hero Images**: Use large, professional lifestyle photography
- Homepage hero: Premium tea ritual scene (cup, packaging, natural setting)
- Collection pages: Thematic imagery matching each collection
- About page: Tea sourcing, craftsmanship imagery

**Product Images**: 
- High-resolution with consistent white/light backgrounds
- Lifestyle shots showing scale and context
- 3D viewer assets for interactive experience

**Supporting Imagery**:
- Trust section: Icons for certifications, quality badges
- Process/story section: Step-by-step visual narrative
- Testimonials: Customer photos (circular crops)

## Animations

**Minimal, purposeful motion**:
- Page transitions: Subtle fade-in
- Add to cart: Brief scale animation + flying icon to cart
- Spin wheel: Smooth rotation with easing
- Hover states: Gentle scale (1.02) and shadow deepening
- Loading states: Elegant skeleton screens in light-blue theme

## Accessibility

- Focus indicators on all interactive elements
- ARIA labels for icons and image buttons
- Keyboard navigation support
- Screen reader-friendly product information hierarchy
- Color contrast meeting WCAG AA standards

## PWA Considerations

- Bottom navigation bar on mobile (persistent)
- Touch-friendly tap targets (min 44px)
- Swipe gestures for product galleries
- Offline state messaging with Flowey branding
- Install prompt with benefit highlights

---

This design creates a premium, trustworthy shopping experience that balances luxury aesthetics with functional AI-powered features, maintaining sophistication while delivering the advanced functionality requirements.