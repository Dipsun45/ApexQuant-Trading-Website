# APEXQUANT — Advanced MERN Trading & Portfolio Platform

**Trade Smarter. Analyze Deeper. Perform Better.**

ApexQuant is an institutional-grade trading, portfolio management, and quantitative analytics web application built on the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with real-time Socket.IO synchronization, Tailwind CSS glassmorphism UI, Framer Motion, and Recharts visualization.

---

## 🚀 Key Features

### Client / User Panel
- **Public Trading Hub**: Live simulated market ticker tape, top gainers, and 30 seeded major equities (Apple, Microsoft, NVIDIA, Amazon, Tesla, Meta, Google, etc.).
- **User Authentication**: Secure signup with bcrypt password hashing and 30-day JWT tokens. Every new user receives **$100,000** in virtual demo cash balance.
- **Interactive Trading System**: Full BUY and SELL order execution with server-side balance verification, cost basis calculation, and automated holding updates.
- **Portfolio Management**: Real-time asset breakdown, sector allocation pie charts, and risk metrics (concentration weight, cash ratio).
- **Transaction Ledger**: Complete history of order executions and deposit/withdrawal adjustments with search and filters.
- **Personalized Watchlist**: Add/remove target stocks with one-click access to trade modals.
- **Profile & Security**: Self-service profile updates and password changes.

### Admin Terminal Panel (`/admin`)
- **Executive Dashboard**: Real live MongoDB database aggregations (Total Users, Total Stocks, Total Trades, Total Volume, Total Deposits, Total Withdrawals, Profit vs Loss count).
- **User Account Management**: Search, filter, enable/disable trader accounts, and credit/deduct cash balances with full audit trail.
- **Stock Directory Management**: Add new stocks, edit prices, delete stocks, and toggle market status (`OPEN` / `HALTED`).
- **Trade Order Controls**: Review all user trades, update trade statuses (`PENDING`, `OPEN`, `PROFIT`, `LOSS`, `CLOSED`, `CANCELLED`), and adjust exit prices.
- **Audit Logs**: Immutable system audit trail capturing all administrative actions with admin emails and timestamps.
- **Global Broadcast Announcements**: Publish real-time header notifications to all active trader dashboards.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS v4, Lucide React Icons, Recharts, React Hot Toast, Socket.IO Client, Three.js 3D Background Canvas.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose 8+), JWT, bcryptjs, Socket.IO, Helmet, CORS, Cookie Parser.
- **Database**: MongoDB (`mongodb://localhost:27017/ApexQuant`)

---

## 📁 Project Structure

```text
ApexQuant/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── admin/
│   │   ├── user/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── scripts/
│   │   └── seed.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

## ⚡ Installation & Execution Guide

### Prerequisites
1. **Node.js** (v18+)
2. **MongoDB Community Server** running locally on `localhost:27017`

### Step 1: Database Setup & Seeding
Open a terminal in `backend/` and run:

```bash
cd backend
npm install
npm run seed
```

Terminal output will confirm:
- Database Connection established
- Default Admin Account verified (`admin@gmail.com` / `admin`)
- 30 Initial Equities seeded into MongoDB

---

### Step 2: Running the Application (Two Development Terminals)

#### TERMINAL 1 — BACKEND SERVER
```bash
cd backend
npm run dev
```
Backend runs on: **`http://localhost:5000`**

#### TERMINAL 2 — FRONTEND VITE CLIENT
```bash
cd frontend
npm run dev
```
Frontend runs on: **`http://localhost:5173`**

---

## 🔑 Default Credentials

### Admin Account
- **URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@gmail.com`
- **Password**: `admin`

*Note: For production deployments, change the default admin password in MongoDB.*

---

## ⚖️ Financial Disclaimer
ApexQuant is a demonstration web application engineered with simulated market data. Prices and portfolio statistics are displayed for software testing, quantitative modeling, and analytics demonstration purposes. ApexQuant does not operate as a licensed financial brokerage.
