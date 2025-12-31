🚀 ContentAutomation
AI-Powered Article Enhancement System
📌 Overview

ContentAutomation is a full-stack, AI-driven content processing pipeline designed to automatically fetch, analyze, and enhance articles at scale.

The project simulates a real-world SaaS content automation system where raw articles are ingested, enriched using external sources and AI models, and then served via APIs to a frontend dashboard.

This system demonstrates:

Backend API design

Asynchronous background processing

AI/LLM integration

Clean data flow between services

Production-style architecture

🧱 System Components
ContentAutomation
├── Backend (Laravel API)
├── Automation Worker (Node.js)
├── Frontend (Vite + React)
└── PostgreSQL Database

🛠️ Tech Stack
🔹 Backend

Laravel (PHP 8.4)

PostgreSQL (Local / Neon)

RESTful APIs

Eloquent ORM

🔹 Automation Worker

Node.js

Google / Serper Search APIs

Web Scraping

AI Content Generation (Groq / Gemini)

🔹 Frontend

Vite + React

Axios for API communication

⚙️ Local Setup Instructions
1️⃣ Prerequisites

Make sure the following are installed:

PHP ≥ 8.2

Composer

Node.js ≥ 18

PostgreSQL (or Neon DB)

Git

2️⃣ Clone Repository
git clone https://github.com/<your-username>/ContentAutomation.git
cd ContentAutomation

🔧 Backend (Laravel) Setup
cd backend-laravel
cp .env.example .env
composer install
php artisan key:generate

Configure .env
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=content_automation
DB_USERNAME=postgres
DB_PASSWORD=your_password

Run Migrations
php artisan migrate

Start Backend
php artisan serve


📍 Backend URL:

http://127.0.0.1:8000

🤖 Node Worker Setup (Automation Engine)

The Node Worker automatically processes the oldest unprocessed articles.

cd ../node-worker
cp .env.example .env
npm install

Configure .env
API_BASE_URL=http://127.0.0.1:8000/api
GROQ_API_KEY=your_api_key
SERPER_API_KEY=your_api_key

Run Worker
npm start


✅ The worker will:

Fetch oldest unprocessed articles

Search competitor content

Scrape reference articles

Rewrite content using AI

Update backend via API

🎨 Frontend Setup
cd ../frontend
npm install

Configure API URL

Create .env file:

VITE_API_URL=http://127.0.0.1:8000/api

Run Frontend
npm run dev


📍 Frontend URL:

http://localhost:5173

🔄 Data Flow / Architecture Diagram

🔹 High-Level Architecture









┌──────────────┐
│   Frontend   │
│  (React)     │
└──────┬───────┘
       │  HTTP (Axios)
       ▼




       
┌──────────────┐
│ Laravel API  │
│  (Backend)   │
└──────┬───────┘
       │ ORM / Queries
       ▼








       
┌──────────────┐
│ PostgreSQL   │
│  Database    │
└──────┬───────┘
       ▲
       │ REST API









       
┌──────┴───────┐
│ Node Worker  │
│ (Automation) │
└──────┬───────┘
       │
       ▼










       
┌──────────────┐
│ Search / AI  │
│ (Groq, etc.) │
└──────────────┘



🔍 Detailed Data Flow

Articles are stored in PostgreSQL

Node Worker fetches oldest unprocessed articles

Worker performs:

Google/Serper search

Scraping competitor content

AI rewriting using LLMs

Updated content is sent back to Laravel via API

Laravel updates article status and references

Frontend fetches and displays updated articles

🧠 Key Engineering Highlights

Decoupled architecture (API + Worker)

Async background processing

Clean API boundaries

AI failure handling & retries

Production-style data flow

📎 Notes for Reviewers

Worker is intentionally kept separate to simulate real SaaS background jobs

No direct DB access from worker (API-only communication)

Architecture scales horizontally with multiple workers

Designed for clarity, extensibility, and real-world relevance

✅ Status

✔ Backend API working
✔ Database connected
✔ Worker processing articles
✔ Frontend integrated

High-Level Execution Flow

Article (DB)
   ↓
Node Worker (Scheduler + Orchestrator)
   ↓
Search Engine (Serper / Google)
   ↓
Web Scraper
   ↓
LLM (Groq / Gemini)
   ↓
Laravel API
   ↓
Database
   ↓
Frontend


How Articles Are Picked (Automatic Processing)
Backend Role

Stores articles with status

Exposes API:

GET /api/articles

Each article has:

{
  "id": 5,
  "title": "...",
  "original_content": "...",
  "updated_content": null,
  "status": "ORIGINAL"
}

What Serper Does

Acts as a Google Search API

Returns structured search results

Faster and more reliable than scraping Google directly

Scraping Phase – Controlled, Defensive Scraping

Each competitor URL is scraped:

const content = await scrapeContent(url);

Important Design Points

Scraper failures are non-fatal

403 / blocked pages are skipped

Partial data is acceptable

This ensures:

Worker never crashes

LLM Phase – How Groq Models + Fallback Work

LLM Fallback Strategy (Production-Grade)

Our system uses a model fallback chain.

Smaller model first → cheaper & faster

Bigger model only when needed

Zero manual intervention

Updating Backend – Why via API, Not DB

Backend Responsibilities (Laravel)

Laravel does only these things:

Validate input

Update database

Maintain relations (articles ↔ references)

Expose APIs to frontend

Backend Responsibilities (Laravel)

Laravel does only these things:

Validate input

Update database

Maintain relations (articles ↔ references)

Expose APIs to frontend

If traffic grows:

Add more Node Workers

Use job queues (BullMQ / RabbitMQ)

Add cron triggers

Swap LLM providers

Add caching layers

Failure Scenarios & Handling
Failure	       Handling
Search API fails	Skip article
Scraper blocked	Skip URL
LLM rate-limited	Fallback model
LLM fails	       Article reverted to ORIGINAL
Worker crash	       Restart worker
Backend down	       Worker retries
