<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:0EA5E9,100:1D4ED8&height=190&section=header&text=FinTrack&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Personal%20Finance%20Tracker%20for%20Web%20and%20Mobile&descAlignY=58&descSize=17" />

<div align="center">
  <p><a href="./README.md">🇧🇷 Leia em Português</a></p>
  
  <img src="https://readme-typing-svg.herokuapp.com?font=JetBrains+Mono&weight=700&size=24&duration=3000&pause=900&color=0EA5E9&center=true&vCenter=true&width=900&lines=Track+Income+and+Expenses;Build+Financial+Goals;Analyze+Monthly+Reports;Modern+Finance+Dashboard" alt="Typing SVG" />

  <br>

  <img src="https://img.shields.io/badge/Status-Finance_Dashboard-0EA5E9?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Category-FinTech-1D4ED8?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Version-1.0.0-1E3A8A?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-181717?style=for-the-badge" />
</div>

---

## 💸 About

**FinTrack** is a personal finance platform designed to help users manage income, expenses, categories, and financial goals with a clean and modern dashboard experience.

The project includes mobile and web interfaces powered by a REST API and a relational database.

<div align="center">
  <img src="screenshots/login.png" width="48%" alt="Login Screen" />
  <img src="screenshots/dashboard.png" width="48%" alt="Main Dashboard" />
  <br>
  <em>Authentication and main Dashboard interfaces</em>
</div>

---

## ✨ Features

- User authentication (JWT)
- Income and Expense tracking
- Transaction categories
- Monthly balance and summary
- Financial goals tracking
- Dashboard metrics and charts
- Recent transactions feed
- Filters by type, category, and date
- Protected routes
- API data validation

---

## 🧱 Tech Stack

<div align="center">

<img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
<img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
<img src="https://img.shields.io/badge/NativeWind-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-181717?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white" />
<img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />

</div>

---

## 📱 Screens

```txt
Mobile
├── Login
├── Register
├── Dashboard
├── Transactions
├── New Transaction
├── Categories
├── Goals
└── Profile

Web
├── Dashboard
├── Transactions
├── Categories
├── Goals
└── Settings
```

---

## 🗂️ Project Structure

```txt
fintrack/
├── apps/
│   ├── mobile/
│   ├── web/
│   └── api/
├── packages/
│   └── shared/
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

Follow the steps below to run the project locally.

### 1. Clone the repository and install dependencies
```bash
git clone https://github.com/odevfigueiredo/fintrack.git
cd fintrack
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` files to create the active environment files:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
```
*(Note: Be sure to change the credentials in `apps/api/.env` if you run into Prisma permission errors during the next steps).*

### 3. Start the Database
Start the MySQL container using Docker Compose:
```bash
docker compose up -d
```

### 4. Setup Database Schema
Generate the Prisma Client, run migrations, and seed default categories and the test user:
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 5. Run the Applications
Open separate terminals for each service and start them:
```bash
# Terminal 1 - Start the API Backend
npm run dev:api

# Terminal 2 - Start the Web Dashboard
npm run dev:web

# Terminal 3 - Start the Mobile App
npm run dev:mobile
```

---

## 🔐 Test User

A test user is automatically created when you run the database seed script:
```txt
email: user@fintrack.dev
password: 123456
```

---

## 📌 API Overview

```txt
POST   /auth/register
POST   /auth/login
GET    /auth/me

GET    /transactions
POST   /transactions
GET    /transactions/:id
PUT    /transactions/:id
DELETE /transactions/:id

GET    /categories
POST   /categories
PUT    /categories/:id
DELETE /categories/:id

GET    /goals
POST   /goals
PUT    /goals/:id
DELETE /goals/:id

GET    /dashboard/summary
```

---

## 🧭 Roadmap

- Bank account grouping
- Recurring transactions
- CSV/PDF export
- Budget limits
- Advanced charts
- Offline sync
- Push reminders

---

## 📸 Preview

<div align="center">
  <h3>Transactions</h3>
  <img src="screenshots/transacoes.png" width="100%" alt="Transactions" />

  <br><br>

  <h3>Categories & Goals</h3>
  <img src="screenshots/categorias.png" width="48%" alt="Categories" />
  <img src="screenshots/metas.png" width="48%" alt="Goals" />

  <br><br>

  <h3>Settings</h3>
  <img src="screenshots/configuracoes.png" width="100%" alt="Settings" />
</div>

---

<div align="center">

Developed by [Jonatha Figueiredo](https://github.com/odevfigueiredo)

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:1D4ED8,100:0EA5E9&height=120&section=footer" />

</div>
