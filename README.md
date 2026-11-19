# 📦 Stockly – Inventory Management System

A modern inventory management system for small/medium businesses. Stockly solves stockouts and overstocking with smart reorder suggestions, real-time stock tracking, and automated alerts.

**Live Demo:** [https://stockly-inventory-management.vercel.app](https://stockly-inventory-management.vercel.app)


---

## 🎯 Problem Solved

- Businesses lose sales due to **stockouts**
- Money gets stuck in **overstocked slow-moving items**
- No **real-time visibility** into stock levels
- Manual tracking leads to errors
- No intelligent alerts for reordering

---

## ✨ Features

| Feature | Description |
|---|---|
| **Smart Reorder Suggestions** | Calculates suggested order quantity based on sales velocity + lead time |
| **Stock Health Score (0–100)** | Rates each product's health at a glance |
| **Movement Timeline** | Visual history of every stock change (IN/OUT/Adjustments) |
| **Auto Low-Stock Alerts** | Triggered when stock falls below reorder level |
| **Multi-User** | Private dashboards per user |
| **Indian Rupee (₹)** | All monetary values in INR |
| **Reports** | Stock summaries, movement history, category breakdowns |
| **Responsive** | Mobile-friendly sidebar and layouts |

---

## 🧩 Modules

| Module | Description |
|---|---|
| **Dashboard** | Real-time stats, low-stock alerts, quick actions |
| **Products** | Full CRUD — name, SKU, category, supplier, prices, stock, reorder level |
| **Categories** | Organize products into logical groups |
| **Suppliers** | Vendor management with contact details |
| **Customers** | Customer records for tracking stock outflows |
| **Stock Movements** | IN / OUT / Adjustments with reason tracking |
| **Reorder Suggestions** | Smart suggestions based on velocity + lead time |
| **Reports** | Stock, movement, and category summaries |
| **Settings** | User profile and notification preferences |
| **Help** | In-app documentation and guidance |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) + Turbopack |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Lucide React icons |
| **Database** | Neon Postgres (serverless) |
| **ORM** | Prisma 7 |
| **Auth** | NextAuth.js v5 (Google OAuth + Email/Password) |
| **Forms** | React Hook Form + Zod |

---

## 🚀 Getting Started (Local)

```bash
# 1. Clone the repo
git clone https://github.com/krishnapriyakr/stockly-inventory-management.git
cd stockly-inventory-management

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your own Neon and Google OAuth credentials

# 4. Run the development server
npm run dev