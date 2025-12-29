# ArtisanBakery - Management System

## 🎯 Description

A full-stack web application for managing bakeries with automated scraping capabilities. This project integrates a Node.js/Express backend, Supabase (PostgreSQL) database, and n8n workflow automation to provide a comprehensive management solution.

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3 (Glassmorphism), JavaScript (SPA)
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT (JSON Web Tokens) with Bcrypt
- **Automation**: n8n
- **Deployment**: Vercel

## 📋 Features

- ✅ **Secure Authentication**: Register and Login with JWT.
- ✅ **CRUD Operations**: Manage bakeries (Create, Read, Update, Delete).
- ✅ **Favorites System**: Add/Remove bakeries to your personal favorites list.
- ✅ **Search & Filter**: Find bakeries by city, name, or status (Open/Closed).
- ✅ **Responsive Design**: Premium dark-mode aesthetic.
- ✅ **Automation**: Trigger n8n workflow to scrape Google Maps for new leads.

## 🚀 Installation & Setup

### 1. Prerequisites

- Node.js installed
- Supabase account (or local PostgreSQL)
- n8n account (for scraping features)

### 2. Setup Database (Supabase)

1. Create a new Supabase project.
2. Go to the **SQL Editor** in Supabase dashboard.
3. Copy the contents of `schema.sql` (included in this repo) and run it.

### 3. Configure Environment

1. Rename `.env.example` to `.env`.
2. Fill in your credentials:
   ```env
   SUPABASE_URL=your_project_url
   SUPABASE_KEY=your_anon_key
   JWT_SECRET=your_secret_key
   N8N_WEBHOOK_URL=your_n8n_webhook_url
   ```

### 4. Run Locally

```bash
# Install dependencies
npm install

# Start server
npm run dev
# Server runs on http://localhost:3000
```

### 5. Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel`.
3. Set the Environment Variables in Vercel Dashboard matching your `.env`.

## 📝 API Documentation

### Authentication

- `POST /api/auth/register` - body: `{ username, email, password }`
- `POST /api/auth/login` - body: `{ email, password }`
- `GET /api/auth/me` - header: `Authorization: Bearer <token>`

### Bakeries (Items)

- `GET /api/items?page=1&limit=6&search=keyword`
- `POST /api/items` - body: `{ name, city, specialties, image_url... }` (Auth required)
- `PUT /api/items/:id` - (Auth required, Creator only)
- `DELETE /api/items/:id` - (Auth required, Creator only)

### Favorites

- `GET /api/favorites/my-favorites`
- `POST /api/favorites/:itemId`
- `DELETE /api/favorites/:itemId`

### Automation

- `POST /api/scraping/trigger` - body: `{ city, keyword }` (Triggers n8n webhook)

## 👤 Author

Project created for Bakery Management Workflow.
