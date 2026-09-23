# 🌾 Farmer Marketplace

A full-stack web application connecting farmers and customers through a **combined product marketplace**. Built as an MCA Mini-Project using React + Vite (Frontend) and Node.js + Express + MongoDB (Backend).

---

## 📋 Project Overview

Farmer Marketplace is a platform with **3 roles**:

| Role | Description |
|------|-------------|
| **Admin** | Manages the product catalog, categories, users, and views orders |
| **Farmer** | Selects products from the catalog and manages their stock quantity |
| **Customer** | Browses the combined marketplace, adds to cart, and places orders |

### Key Concept: Combined Marketplace
Customers see **ONE combined product listing** — not individual farmer shops.

Example:
- Farmer A: 20 kg Tomato
- Farmer B: 30 kg Tomato
- Customer sees: **Tomato — 50 kg available @ ₹40/kg**

---

## ✨ Features

### Customer
- Register / Login / Logout
- Browse combined marketplace
- Search & filter by category
- Add to cart (0.5 kg increments)
- Checkout with delivery address
- Payment methods: COD / UPI / Card (simulated)
- View order history & order details
- Manage profile & default address

### Farmer
- Register / Login / Logout
- Dashboard with stock statistics
- Add stock from admin product catalog
- View / Edit / Remove stock
- Stock auto-increments (no duplicates per product)

### Admin
- Pre-seeded account (no public registration)
- Dashboard with key statistics
- Manage product catalog (Add / Edit / Delete / Set Price)
- Manage categories
- View all customers and farmers
- Delete customers and farmers
- View all orders and order details

### Order System
- FCFS (First-Come-First-Serve) farmer stock allocation
- Stock deducted immediately when order is placed
- Order status: **COMPLETED immediately** (no tracking flow)
- Price snapshot stored at order time

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, JavaScript |
| Routing | React Router v6 |
| HTTP | Axios |
| State | Context API |
| Styling | Vanilla CSS (custom design system) |
| Backend | Node.js, Express.js |
| Database | MongoDB (local), Mongoose |
| Auth | JWT + bcryptjs |
| Notifications | react-hot-toast |

---

## 📁 Project Structure

```
Farmer-Marketplace/
├── Client/                     # React + Vite Frontend
│   └── src/
│       ├── components/         # Navbar, ProtectedRoute, Spinner
│       ├── context/            # AuthContext, CartContext
│       ├── layouts/            # FarmerLayout, AdminLayout
│       ├── pages/
│       │   ├── auth/           # LoginPage, RegisterPage
│       │   ├── customer/       # Marketplace, Cart, Checkout, Orders, Profile
│       │   ├── farmer/         # Dashboard, StockPage, AddStock
│       │   └── admin/          # Dashboard, Products, Categories, Users, Orders
│       └── utils/              # api.js (Axios instance)
│
└── Server/                     # Node.js + Express Backend
    ├── config/                 # db.js (MongoDB connection)
    ├── models/                 # User, Category, Product, FarmerStock, Order
    ├── controllers/            # authController, productController, etc.
    ├── routes/                 # authRoutes, productRoutes, etc.
    ├── middleware/             # auth.js, errorHandler.js
    ├── utils/                  # seed.js
    └── public/images/          # Product images (.jpg and .svg)
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB Community Server** v6 or v7 (local)

### 1. Clone / Download the project

### 2. Start MongoDB

**Windows (if installed as a service):**
```bash
net start MongoDB
```

**Windows (manual):**
```bash
mongod --dbpath C:\data\db
```

**Create the data directory if it doesn't exist:**
```bash
mkdir C:\data\db
```

### 3. Setup the Backend (Server)

```bash
cd Server
npm install
```

**Seed the database with initial data:**
```bash
npm run seed
```

**Start the server:**
```bash
npm start
```

Server runs at: `http://localhost:5000`

### 4. Setup the Frontend (Client)

```bash
cd Client
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔐 Default Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@farmermarket.com | admin123 |
| **Farmer 1** | ramesh@farmer.com | farmer123 |
| **Farmer 2** | suresh@farmer.com | farmer123 |
| **Farmer 3** | anita@farmer.com | farmer123 |
| **Customer** | priya@customer.com | customer123 |

> These are created by the seed script (`npm run seed` in Server/).

---

## 🌿 API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register customer/farmer |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Auth | Get current user |
| PUT | /api/auth/profile | Auth | Update profile |
| GET | /api/categories | Public | Get all categories |
| POST | /api/categories | Admin | Create category |
| GET | /api/products | Public | Get products + combined stock |
| POST | /api/products | Admin | Create product |
| PUT | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Delete product |
| GET | /api/farmer/stock | Farmer | Get my stock |
| POST | /api/farmer/stock | Farmer | Add/update stock |
| PUT | /api/farmer/stock/:id | Farmer | Set exact stock |
| DELETE | /api/farmer/stock/:id | Farmer | Remove stock |
| POST | /api/orders | Customer | Place order |
| GET | /api/orders/my | Customer | Get my orders |
| GET | /api/orders/:id | Customer/Admin | Order details |
| GET | /api/admin/stats | Admin | Dashboard stats |
| GET | /api/admin/customers | Admin | All customers |
| GET | /api/admin/farmers | Admin | All farmers |
| GET | /api/admin/orders | Admin | All orders |

---

## 🖼️ Product Images

Product images are stored in `Server/public/images/`. 

- Real photos: tomato.jpg, carrot.jpg, onion.jpg
- SVG placeholders: all other products

To add real images, place them in `Server/public/images/` with the correct filename and update the product's `image` field via the Admin dashboard.

---

## 📝 Notes for Exam

### FCFS Stock Allocation
When a customer orders 25 kg of Tomato:
1. System finds all farmers with Tomato stock, sorted by stock creation time
2. Farmer A (20 kg) → allocated 20 kg
3. Farmer B (5 kg of remaining 5 kg needed) → allocated 5 kg
4. Stock is deducted from each farmer immediately
5. Allocation breakdown is stored in the order

### Quantity Rules
- Minimum: 0.5 kg
- Increment: 0.5 kg (0.5, 1.0, 1.5, 2.0...)
- Validated both frontend and backend

### Order Status
- All orders are **COMPLETED immediately** upon placement
- No pending/shipping/delivery flow

---

## 🔧 Common Exam Modifications

| Task | Where to change |
|------|----------------|
| Add a product field | `Server/models/Product.js` + `AdminProductsPage.jsx` |
| Add a category | Admin dashboard UI or seed file |
| Change pricing logic | `Server/controllers/orderController.js` |
| Add a new filter | `MarketplacePage.jsx` |
| Add a User field | `Server/models/User.js` + `ProfilePage.jsx` |
| Change quantity rules | `orderController.js` (backend) + `CartPage.jsx` (frontend) |
