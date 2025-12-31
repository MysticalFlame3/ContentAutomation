# 🚀 ContentAutomation  
## AI-Powered Article Enhancement System

---

## 📌 Overview

ContentAutomation is a **full-stack, AI-driven content processing pipeline** designed to automatically **fetch, analyze, and enhance articles at scale**.

The project simulates a **real-world SaaS content automation system** where:

- Raw articles are ingested
- External sources are analyzed
- AI models enhance content
- Results are served via APIs to a frontend dashboard

---

## 🎯 What This System Demonstrates

- Backend API design
- Asynchronous background processing
- AI / LLM integration
- Clean data flow between services
- Production-style system architecture

---

## 🧱 System Components

ContentAutomation 



├── Backend (Laravel API)



├── Automation Worker (Node.js)




├── Frontend (Vite + React)




└── PostgreSQL Database



---

## 🛠️ Tech Stack

### 🔹 Backend (API Layer)

| Technology | Purpose |
|----------|--------|
| Laravel (PHP 8.4) | REST APIs & business logic |
| PostgreSQL | Persistent data storage |
| Eloquent ORM | Database abstraction |
| REST APIs | Service communication |

---

### 🔹 Automation Worker (Processing Engine)

| Technology | Purpose |
|----------|--------|
| Node.js | Async background jobs |
| Google / Serper API | Search results |
| Web Scraping | Reference extraction |
| Groq / Gemini | AI content generation |
| Retry + Fallback | Fault tolerance |

---

### 🔹 Frontend (Dashboard)

| Technology | Purpose |
|----------|--------|
| Vite + React | UI rendering |
| Axios | API communication |
| Env config | Deployment ready |

---

## ⚙️ Local Setup Instructions

---

### 1️⃣ Prerequisites

Ensure the following are installed:

- PHP ≥ 8.2
- Composer
- Node.js ≥ 18
- PostgreSQL (Local or Neon)
- Git

---

### 2️⃣ Clone Repository

git clone https://github.com/<your-username>/ContentAutomation.git
cd ContentAutomation



---

## 🔧 Backend (Laravel) Setup

cd backend-laravel



cp .env.example .env



composer install



php artisan key:generate



### Configure `.env`

DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=content_automation
DB_USERNAME=postgres
DB_PASSWORD=your_password

php artisan migrate
php artisan serve


**Backend URL**
http://127.0.0.1:8000



---

## 🤖 Node Worker Setup (Automation Engine)

The Node Worker **automatically processes the oldest unprocessed articles**.

cd ../node-worker



cp .env.example .env



npm install



### Configure `.env`

API_BASE_URL=http://127.0.0.1:8000/api
GROQ_API_KEY=your_api_key
SERPER_API_KEY=your_api_key

npm start



### ✅ Worker Responsibilities

| Step | Action |
|----|-------|
| 1 | Fetch oldest unprocessed article |
| 2 | Search competitor content |
| 3 | Scrape reference articles |
| 4 | Rewrite content using AI |
| 5 | Update backend via API |

---

## 🎨 Frontend Setup

cd ../frontend
npm install



Create `.env`:

VITE_API_URL=http://127.0.0.1:8000/api

npm run dev



**Frontend URL**
http://localhost:5173



---

## 🔄 Architecture & Data Flow

### 🔹 High-Level Vertical Architecture

Frontend (React)
↓
Laravel API
↓
PostgreSQL Database
↑
Node Worker
↓
Search / Scraper / AI Models



---

### 🔍 Detailed Execution Flow

Article (Database)



↓



Node Worker (Scheduler + Orchestrator)



↓



Search Engine (Serper / Google)



↓



Web Scraper



↓



LLM (Groq → Gemini Fallback)



↓



Laravel API



↓



Database Update



↓



Frontend Display



---

## 🧠 How Articles Are Picked Automatically

### Backend Role

- Stores articles with processing status
- Exposes APIs:
  - `GET /api/articles`

### Example Article Structure

{
"id": 5,
"title": "...",
"original_content": "...",
"updated_content": null,
"status": "ORIGINAL"
}



### Worker Logic

- Fetch **oldest article** with status `ORIGINAL`
- Process asynchronously
- Update via API
- **No direct DB access**

---

## 🔎 What Serper Does

| Feature | Benefit |
|------|--------|
| Google Search API | Structured results |
| JSON output | No HTML parsing |
| Faster | Reliable |
| Safe | No scraping Google |

---

## 🕷️ Scraping Phase – Defensive Design

const content = await scrapeContent(url);



### Key Design Rules

- Scraper failures are **non-fatal**
- Blocked (403) pages are skipped
- Partial data is acceptable

➡️ Ensures **worker never crashes**

---

## 🧠 LLM Phase – Groq Model Fallback Strategy

### Production-Grade Fallback Chain

| Priority | Model Size | Reason |
|--------|-----------|--------|
| 1 | Small | Fast & cheap |
| 2 | Medium | Better quality |
| 3 | Large | Fallback only |

✔ No manual intervention  
✔ Cost controlled  
✔ Rate-limit safe  

---

## 🔐 Why Worker Uses API (Not Direct DB)

### Laravel Responsibilities

- Validate input
- Update database
- Maintain relations
- Serve frontend APIs

### Worker Responsibilities

- Orchestrate automation
- Call external services
- Remain stateless

---

## 📈 Scalability & Future Enhancements

| Scenario | Solution |
|-------|---------|
| Increased load | Multiple workers |
| Heavy jobs | BullMQ / RabbitMQ |
| Scheduling | Cron triggers |
| AI limits | Swap providers |
| Performance | Caching layer |

---

## ⚠️ Failure Handling Matrix

| Failure | Handling |
|-------|---------|
| Search API fails | Skip article |
| Scraper blocked | Skip URL |
| LLM rate-limited | Fallback model |
| LLM failure | Revert status |
| Worker crash | Restart |
| Backend down | Retry |

---

## 📎 Notes for Reviewers

- Worker intentionally separated (real SaaS pattern)
- No direct DB access from worker
- Horizontally scalable architecture
- Designed for clarity & extensibility

---

## ✅ Project Status

| Component | Status |
|--------|--------|
| Backend API | ✔ Working |
| Database | ✔ Connected |
| Worker | ✔ Processing |
| Frontend | ✔ Integrated |

---
