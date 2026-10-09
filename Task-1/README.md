# ⚡ AURA LUXE — Full-Stack E-Commerce Store

> **CodeAlpha Web Development Internship — Task 1: Simple E-Commerce Store**  
> Complete working solution featuring a modern, vibrant UI/UX and a robust Express.js backend with SQLite/JSON data persistence.

---

## 🌟 Overview & Key Features

AURA LUXE is a responsive, feature-rich modern e-commerce web application with a glassmorphic color palette, micro-animations, and full-stack integration.

### 🎨 Frontend (HTML5, Vanilla CSS3, JavaScript)
- **Vibrant Modern UI/UX**:
  - Dark & Light mode toggle with smooth theme transitions
  - Electric gradients (Indigo, Violet, Cyber Cyan, Rose Crimson) & glassmorphism
  - Custom typography (Google Fonts *Outfit* & *Plus Jakarta Sans*)
  - Responsive layout for desktop, tablet, and mobile devices
- **Product Listings & Showcase**:
  - Dynamic product catalog across 5 categories (*Audio & Wearables, Tech & Gadgets, Gaming & Gear, Smart Home, Fashion & Apparel*)
  - Category filter pills with dynamic count badges
  - Live instant search with autocomplete and clear button
  - Price range slider ($30 – $600)
  - Sorting (Featured, Price: Low to High, Price: High to Low, Highest Rated, Name)
  - Color swatches, discount tags, star ratings, and stock status badges
- **Interactive Product Details Modal**:
  - Multi-angle image gallery with thumbnail preview switcher
  - Color variant selector with live preview
  - Quantity adjuster with real-time stock ceiling
  - Tabbed information: *Key Highlights*, *Technical Specifications*, and *Customer Reviews*
  - Fast "Add to Cart" and "Instant Buy Now" actions
- **Slide-Out Shopping Cart Drawer**:
  - Real-time cart calculations (Subtotal, Shipping, Tax, Total)
  - Free express delivery progress bar ($50 threshold)
  - Item quantity steppers and quick remove
  - Promo code voucher engine with clickable test coupons (`ALPHA10`, `WELCOME20`, `FREESHIP`)
  - Cart state persistence in browser `localStorage`
- **Multi-Step Checkout & Order Processing Wizard**:
  - **Step 1: Shipping Details** (Full name, email, phone, street address, city, postal code)
  - **Step 2: Payment Method** (Interactive live Credit Card preview, PayPal, UPI/QR, Cash on Delivery)
  - **Step 3: Confirmation Screen** with order ID, delivery tracker timeline, and full receipt breakdown
- **User Authentication (Login & Registration)**:
  - Tabbed modal for Sign In and Account Registration
  - Password encryption with cryptographic salt & hash
  - One-Click **Demo Account Auto-Fill** (`alex@example.com` / `password123`)
  - Dynamic user profile pill with initials avatar and past order access
- **Order Tracking & History Modal**:
  - View all past orders, delivery addresses, items purchased, totals, and live fulfillment statuses

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML5 (Semantic), Vanilla CSS3 (Custom Properties & Glassmorphism), JavaScript (ES6+) |
| **Backend** | Node.js, Express.js REST API |
| **Database** | Structured Persistent JSON Database (`data/products.json`, `data/users.json`, `data/orders.json`) |
| **Security** | Built-in PBKDF2 cryptographic password hashing with unique salts |
| **Typography** | Google Fonts (*Outfit*, *Plus Jakarta Sans*, *JetBrains Mono*) |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher) and npm installed.

### 2. Installation
```bash
npm install
```

### 3. Launching the Store
```bash
npm start
```
The server will boot and listen on **`http://localhost:3000`**.

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔑 Demo Credentials & Coupon Codes

### Demo User Account
- **Email:** `alex@example.com`
- **Password:** `password123`
*(Or click the **"Auto-Fill & Login"** button directly in the Sign In modal!)*

### Test Promo Codes
- `ALPHA10` — 10% Off Storewide (CodeAlpha special)
- `WELCOME20` — 20% Off Storewide
- `FREESHIP` — Free Express Shipping

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Retrieve products (supports `category`, `search`, `minPrice`, `maxPrice`, `sortBy`) |
| `GET` | `/api/products/:id` | Retrieve product details with specs, reviews, and related items |
| `GET` | `/api/categories` | Retrieve list of categories with item counts |
| `GET` | `/api/coupons/:code` | Validate discount coupon code |
| `POST` | `/api/auth/register` | Register new user account (`{ name, email, password }`) |
| `POST` | `/api/auth/login` | Authenticate user credentials (`{ email, password }`) |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `POST` | `/api/orders` | Create and place a new order |
| `GET` | `/api/orders` | Retrieve list of placed orders (supports optional `userId`) |
| `GET` | `/api/orders/:id` | Retrieve single order details and tracking status |

---

## 📁 Directory Structure
```
HAYDEN/
├── data/
│   ├── products.json      # Product catalog seed & storage
│   ├── users.json         # User credentials with hashed passwords
│   └── orders.json        # Processed customer orders & receipts
├── public/
│   ├── css/
│   │   └── style.css      # Vibrant CSS design system & responsiveness
│   ├── js/
│   │   └── app.js         # Client-side state, cart, modals, API client
│   └── index.html         # Semantic HTML5 page layout
├── db.js                  # Database controller with PBKDF2 crypto hashing
├── package.json           # Node.js dependencies and run scripts
├── server.js              # Express.js REST API and static server
└── README.md              # Project documentation
```
