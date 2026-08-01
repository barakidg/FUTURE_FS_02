# GymLeadHub

A multi-tenant lead management platform built for gyms and fitness studios to track, qualify, and convert incoming leads from a single dashboard.

## Overview

Gyms receive interest through many different channels — website forms, walk-ins, referrals, ads — and following up consistently is hard without a shared system. GymLeadHub gives gym staff one place to view every lead, see where it came from, classify how promising it is, and keep a running history of notes and outreach for each one. A platform-level admin layer sits above individual gyms to manage accounts across the whole system.

## Key Features

- Two account types — platform Super Admin and individual Gym Admin — each with their own dashboard and permissions
- Lead capture directly from a gym's own website via a secure API key, alongside manual entry by staff
- Lead lifecycle tracking (new → contacted → converted / lost) with hot / warm / cold qualification
- Notes and scheduled follow-up tasks per lead, with a daily task view
- Email outreach directly from a lead's profile
- Analytics on lead volume, conversion rate, and gym-level performance
- Platform-wide gym management and analytics for the super admin
- Fully responsive interface with light and dark theme support

## Tech Stack

**Backend:** Node.js, Express, TypeScript, PostgreSQL, Prisma, better-auth
**Frontend:** React, TypeScript, Vite, Tailwind CSS, TanStack Query, React Hook Form, shadcn/ui

## Live Demo

https://gymlead-manager.onrender.com

## Setup & Installation

Follow the steps below to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/gymlead-manager.git
cd gymlead-manager
```

---

### 2. Install Dependencies

Install dependencies for both the backend and frontend.

#### Backend

```bash
cd service
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file inside the **service** and **client** directories based on the `env.example` files.

### 4. Generate Prisma Client

```bash
cd service
npx prisma generate
```

---

### 5. Run Database Migrations

```bash
npx prisma migrate dev
```

---

### 6. Seed the Database

```bash
npm run seed
```

This creates the initial Super Admin account.

---

### 7. Start the Backend

```bash
npm run dev
```

The backend will be available at:

```
http://localhost:3000
```

---

### 8. Start the Frontend

Open another terminal and run:

```bash
cd client
npm run dev
```

The frontend will be available at:

```
http://localhost:5173
```

---

### 9. Login

Use the seeded Super Admin credentials from your `.env` file:

- Email: `SUPER_ADMIN_EMAIL`
- Password: `SUPER_ADMIN_PASSWORD`

---

## 📁 Project Structure

```text
gymlead-manager/
│
├── client/             # React + Vite dashboard
│
├── service/            # Express API
│   ├── prisma/
│   ├── src/
│   └── .env
│
└── README.md
```

---

## Useful Commands

### Backend

Start development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Start production build:

```bash
npm run start
```

Seed the database:

```bash
npm run seed
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

### Frontend

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## About

Built as Task 2 of the Full Stack Web Development internship at Future Interns.
