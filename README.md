# Re:Cinema - Next-Gen Movie Ticket Booking Platform

A full-stack cinema ticket booking web application inspired by BookMyShow and modern streaming aesthetic. Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**.

---

## 🌟 Key Features

### 🎬 Customer Experience
- **Cinematic Discovery**: Featured releases carousel, city selector, genre filters, and keyboard shortcut search (`⌘ S`).
- **Showtime & Cinema Selection**: Date selector, multiplex branches with format badges (**IMAX with Laser**, **4DX**, **3D**, **Standard 2D**).
- **Interactive Auditorium Map**: Realistic curved cinema screen with ambient light projection, tiered seat layout (**VIP Recliners**, **Gold Class**, **Silver Class**), collision prevention, and live price calculator.
- **Payment Gateway Simulation**: Multiple payment channels (**UPI / QR Code**, **Credit/Debit Card**, **NetBanking**).
- **Digital Cinema Pass**: Perforated digital pass with entrance gate QR code and instant print/download.
- **Customer Bookings**: Complete reservation history.

### 🛡️ Admin Management Portal (`/admin`)
- **Restricted Access**: Role-based access control (Admin role only).
- **Movie Catalog**: Add new titles with live poster preview, trailer URLs, duration, and ratings. Delete/archive movies.
- **Auditoriums & Screens**: Add screens to multiplexes, configure projection format, and define custom seat grids (Rows × Columns). Remove screens.
- **Showtime Scheduler**: Program movies onto screens with custom dates, start times, and tier prices.
- **Live Box Office Analytics**: Track total revenue, tickets booked, and customer audit trail.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database & Seed Demo Data
```bash
npx prisma db push
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@cinema.com` | `admin123` | Full access to add/remove movies, screens, shows & view analytics |
| **Customer** | `user@cinema.com` | `user123` | Book tickets, select seats, view passes |

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Server & Client Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Lucide Icons
- **Database & ORM**: SQLite + Prisma ORM
- **Authentication**: JWT Cookie Session Tokens
