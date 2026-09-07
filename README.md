<div align="center">

🦋 Flowey

Premium Blue Tea E-Commerce Platform

A modern full-stack storefront combining elegant e-commerce UX, Firebase-powered user workflows, loyalty gamification, and AI-assisted product intelligence.

<br/>









<br/>

Built with React + TypeScript + Express + Firebase + OpenAI

</div>

✨ Overview

Flowey is a premium blue-tea e-commerce application designed around a polished luxury storefront experience.

The project goes beyond a basic product catalog by combining:

🛍️ Product discovery and detailed product pages

🛒 Persistent cart and wishlist workflows

🔐 Email/password and Google authentication

📦 Order placement and order-status tracking

🎁 Loyalty points, tiers, rewards, and a daily Spin & Win experience

🤖 AI-powered product recommendations

✍️ AI-assisted product description generation

📊 Admin-side order, inventory, and revenue visibility

📱 Responsive UI built for modern web experiences

The application follows a reference-based luxury e-commerce design direction, using generous whitespace, serif-led product typography, soft blue accents, and focused visual hierarchy.

🎯 Product Vision

Make premium tea shopping feel personal, intelligent, and rewarding.

Flowey is designed around three experiences:

Experience

Goal

🛍️ Customer Storefront

Discover, compare, wishlist, and purchase products

🤖 AI Layer

Personalize product discovery and assist product content creation

📊 Admin Workspace

Manage products, orders, stock, and business visibility

🚀 Core Features

🛍️ Customer Experience

Responsive premium storefront

Featured product discovery

Product categories and product detail pages

Multiple pack-size variations

Product pricing and stock visibility

Wishlist management

Persistent shopping cart

Cart quantity controls

Free-shipping threshold messaging

Checkout flow

UPI and Cash on Delivery payment-method selection

Order history

Order status progression

Tracking ID display

Responsive mobile navigation

🔐 Authentication & User Data

Firebase Authentication

Google sign-in

Email/password sign-in

User profile documents

Persistent cart data

Persistent wishlist data

Saved shipping addresses

Customer/admin roles

🎁 Loyalty & Gamification

Flowey includes a loyalty system designed to increase customer engagement.

Loyalty tiers:

Bronze → Silver → Gold → Royal

Features include:

Loyalty point balance

Tier progression

Reward redemption

Active reward management

Daily Spin & Win

Discount rewards

Point rewards

Free-shipping rewards

Reward expiration tracking

🤖 AI Features

Flowey integrates OpenAI-powered functionality through backend API endpoints.

AI Product Recommendations

The recommendation endpoint considers:

Customer preferences

Optional purchase history

Available product catalog

It returns ranked recommendations with:

Product ID

Relevance score

Recommendation reasoning

The system also includes a fallback recommendation flow when OpenAI is not configured or an AI request fails.

AI Product Description Generation

Admin/product workflows can generate:

Detailed product descriptions

Short product taglines

The generated content is structured as JSON and uses product name, category, and optional ingredients.

🧑‍💼 Admin Capabilities

The project includes dedicated admin routes for:

📊 Dashboard overview

💰 Revenue visibility

📦 Order management

🛍️ Product management

⚠️ Low-stock alerts

📈 Recent order visibility

👥 Customer/order data workflows

🔧 Inventory-oriented management

The dashboard derives business metrics such as:

Total revenue

Total orders

Pending orders

Inventory alerts

Recent orders

🧱 Tech Stack

Frontend

React 18

TypeScript

Vite

Wouter

TanStack React Query

Tailwind CSS

Radix UI

Lucide React

Framer Motion

Recharts

Backend

Node.js

Express.js

TypeScript

Zod

OpenAI API

REST API endpoints

Data & Authentication

Firebase Authentication

Firebase Firestore

Drizzle ORM

PostgreSQL support

Development & Tooling

Git

GitHub

VS Code

Docker

Google Colab

GitHub Actions / CI/CD configuration

🏗️ Architecture

┌────────────────────────────────────────────────────────────┐
│                      FLOWEY PLATFORM                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  React + TypeScript + Tailwind CSS                         │
│              │                                             │
│              ├──────────────► Customer UI                  │
│              │                  ├─ Home                    │
│              │                  ├─ Products                │
│              │                  ├─ Cart / Wishlist         │
│              │                  ├─ Checkout                │
│              │                  ├─ Orders                  │
│              │                  └─ Rewards                 │
│              │                                             │
│              └──────────────► Admin UI                     │
│                                 ├─ Dashboard               │
│                                 ├─ Products                │
│                                 └─ Orders                  │
│                                                            │
│                         REST API                            │
│                            │                               │
│              ┌─────────────┴─────────────┐                 │
│              ▼                           ▼                 │
│       Express / Node.js             OpenAI API             │
│              │                           │                 │
│              ▼                           ▼                 │
│        Product / Order              AI Recommendations     │
│        API operations               AI Descriptions        │
│                                                            │
│                         Firebase                           │
│                  ├─ Authentication                         │
│                  └─ Firestore                              │
│                                                            │
└────────────────────────────────────────────────────────────┘

📁 Project Structure

flowey/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── ui/
│       │   ├── header.tsx
│       │   ├── footer.tsx
│       │   ├── hero-section.tsx
│       │   ├── product-card.tsx
│       │   ├── cart-drawer.tsx
│       │   ├── featured-products.tsx
│       │   └── spin-wheel.tsx
│       │
│       ├── hooks/
│       ├── lib/
│       │   ├── firebase.ts
│       │   ├── queryClient.ts
│       │   └── store.ts
│       │
│       ├── pages/
│       │   ├── admin/
│       │   ├── home.tsx
│       │   ├── products.tsx
│       │   ├── product-detail.tsx
│       │   ├── checkout.tsx
│       │   ├── orders.tsx
│       │   ├── wishlist.tsx
│       │   ├── rewards.tsx
│       │   ├── login.tsx
│       │   └── about.tsx
│       │
│       └── App.tsx
│
├── server/
│   ├── env.ts
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   ├── static.ts
│   └── vite.ts
│
├── shared/
│   └── schema.ts
│
├── script/
│   └── build.ts
│
├── design_guidelines.md
├── package.json
├── tsconfig.json
└── vite.config.ts

🔌 API Highlights

Products

GET /api/products
GET /api/products/:id
POST /api/products/seed

AI Recommendations

POST /api/ai/recommendations

Example request:

{
  "preferences": "Refreshing citrus and caffeine-free tea",
  "purchaseHistory": ["Flowey Classic Blue"]
}

AI Product Description

POST /api/ai/description

Example request:

{
  "name": "Flowey Citrus Burst",
  "category": "Refreshing Collection",
  "ingredients": "Butterfly Pea Flowers, Lemon, Orange Peel"
}

⚙️ Getting Started

1. Clone the repository

git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY

2. Install dependencies

npm install

3. Configure environment variables

Create a .env file in the project root:

OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_database_url

Configure your Firebase project separately with the required Authentication and Firestore settings.

4. Start the application

For the server:

npm run dev

For the client:

npm run dev --prefix client

Or run both development processes together:

npm run dev:all

5. Build for production

npm run build

6. Type-check the project

npm run check

🔐 Environment & Security

Never commit secrets to GitHub.

Before pushing this project, make sure .env is ignored:

.env
.env.*
!.env.example

Create an example configuration instead:

OPENAI_API_KEY=
DATABASE_URL=

⚠️ The supplied project archive contains a .env file. Do not upload that file to a public repository. If it has ever contained real credentials, rotate/revoke those credentials before publishing the repository.

Also review Firebase Firestore Security Rules and ensure admin/customer access is properly restricted.

🎨 Design System

Flowey follows a premium luxury e-commerce visual direction.

Typography

Playfair Display — luxury headings and product presentation

Inter — functional UI and body content

Cormorant Garamond — accent messaging and special callouts

Visual Language

Soft light-blue palette

Clean white surfaces

Spacious layouts

Rounded modern components

Subtle shadows

Product-focused imagery

Responsive grids

Minimal visual clutter

🧪 Project Highlights

Area

Implementation

UI

Responsive React components

State

Zustand store

Data fetching

TanStack React Query

Routing

Wouter

Auth

Firebase Authentication

Database

Firebase Firestore

AI

OpenAI API

Validation

Zod

Styling

Tailwind CSS

UI primitives

Radix UI

Charts

Recharts

Icons

Lucide React

Build

Vite + TypeScript

📌 What Makes This Project Stand Out

01 — Commerce + AI

Instead of treating AI as a separate demo, Flowey integrates AI directly into product discovery and catalog management.

02 — Complete Customer Journey

The application covers the journey from:

Discover
   ↓
Product Details
   ↓
Wishlist / Cart
   ↓
Checkout
   ↓
Order Tracking
   ↓
Rewards
   ↓
Repeat Engagement

03 — Gamified Retention

The loyalty system and Spin & Win experience create an additional engagement layer beyond traditional e-commerce.

04 — Admin Visibility

The admin workspace provides operational visibility into revenue, orders, and inventory conditions.

🖼️ Project Preview

Homepage

<img src="client/src/assets/generated_images/blue_tea_lifestyle_scene.png" alt="Flowey tea lifestyle preview" width="850"/>

Premium Product Experience

<img src="client/src/assets/generated_images/flowey_premium_tea_box.png" alt="Flowey premium tea product" width="700"/>

Gift Collection

<img src="client/src/assets/generated_images/tea_gift_collection_display.png" alt="Flowey gift collection" width="850"/>

🔮 Future Improvements

Potential next-stage improvements for the platform:

Production payment gateway integration

Advanced recommendation analytics

Customer behavior analytics

Automated email/order notifications

Product review and rating system

Advanced search and filtering

Subscription management

Improved AI business insights

Automated deployment pipeline

Expanded automated testing

👨‍💻 Developer

Ashwin Kumar

AI/ML Engineer | Full-Stack Developer

I build intelligent applications that combine AI/ML, modern web development, and practical product engineering.

<p>
<a href="https://www.linkedin.com/in/ashwin1726">
<img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"/>
</a>
<a href="mailto:ashwinkumaras59@gmail.com">
<img src="https://img.shields.io/badge/Email-Contact-EA4335?style=for-the-badge&logo=gmail&logoColor=white"/>
</a>
</p>

<div align="center">

⭐ If you found this project interesting, consider starring the repository.

Built with curiosity, code, and a passion for intelligent products.

</div>
