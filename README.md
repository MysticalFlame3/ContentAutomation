ContentAutomation – AI-Powered Article Enhancement System
📌 Overview

ContentAutomation is a full-stack system designed to automatically fetch, analyze, and enhance articles using AI.
It consists of:

A Laravel backend for APIs and database management

A Node.js worker for scraping, searching, and AI rewriting

A Frontend (Vite/React) for displaying and managing articles

The system is built to simulate a real-world content automation pipeline used in SaaS products.

🧱 Tech Stack
Backend

Laravel (PHP 8.4)

PostgreSQL (Neon / Local)

REST APIs

Worker

Node.js

Google / Serper search

Web scraping

LLM integration (Groq / Gemini)

Frontend

Vite + React

Axios for API calls

⚙️ Local Setup Instructions
1️⃣ Prerequisites

Make sure you have the following installed:

PHP ≥ 8.2

Composer

Node.js ≥ 18

PostgreSQL (or Neon DB)

Git

2️⃣ Clone the Repository
git clone https://github.com/<your-username>/ContentAutomation.git
cd ContentAutomation

3️⃣ Backend (Laravel) Setup
cd backend-laravel
cp .env.example .env
composer install
php artisan key:generate

Configure .env

Set your database credentials:

DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=content_automation
DB_USERNAME=postgres
DB_PASSWORD=your_password


Run migrations:

php artisan migrate


Start backend:

php artisan serve


Backend will run at:

http://127.0.0.1:8000

4️⃣ Node Worker Setup
cd ../node-worker
cp .env.example .env
npm install


Configure .env:

API_BASE_URL=http://127.0.0.1:8000/api
GROQ_API_KEY=your_key
SERPER_API_KEY=your_key


Run worker:

npm start


👉 The worker automatically:

Fetches oldest articles

Searches competitor content

Scrapes data

Rewrites using AI

Updates backend

5️⃣ Frontend Setup
cd ../frontend
npm install


Set API URL:

VITE_API_URL=http://127.0.0.1:8000/api


Run frontend:

npm run dev


Frontend runs at:

http://localhost:5173

🔄 Data Flow / Architecture Diagram
🔹 High-Level Architecture
┌─────────────┐
│   Frontend  │
│  (React)    │
└──────┬──────┘
       │ HTTP (Axios)
       ▼
┌─────────────┐
│ Laravel API │
│ (Backend)   │
└──────┬──────┘
       │ ORM / Queries
       ▼
┌─────────────┐
│ PostgreSQL  │
│  Database   │
└──────┬──────┘
       ▲
       │ REST API
┌──────┴──────┐
│ Node Worker │
│ (Automation)│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Google / AI │
│  (Groq etc) │
└─────────────┘

🔹 Detailed Data Flow

Articles stored in PostgreSQL

Node Worker fetches oldest unprocessed articles

Worker:

Searches competitor articles

Scrapes reference content

Sends content to AI (LLM)

AI generates improved content

Worker updates article via Laravel API

Frontend fetches updated articles and displays them
