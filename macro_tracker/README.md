# AI Macro Check Backend

The backend for an intelligent nutritional tracking application built with **FastAPI**. It integrates **Supabase** for authentication and database management, **Redis** for caching, and a **Large Language Model (LLM)** via OpenRouter for AI-powered features.

---
[Live API Docs](https://macro-check-production.up.railway.app/docs#/)
---
## Features

- **Secure Authentication** – User signup and login via Supabase Auth, with JWT validation for secure endpoints.  
- **Manual & AI Logging** – Users can log food by providing exact macros or by typing natural language descriptions (e.g., "a bowl of oatmeal with berries").  
- **AI Data Enrichment** – The LLM automatically validates and refines food descriptions (e.g., "kjnk" is rejected, while "2 eggs n toast" becomes "2 Scrambled Eggs with 1 Slice of Whole Wheat Toast").  
- **Comprehensive Analytics** – Daily and 7-day summaries with comparisons against user-set goals.  
- **AI-Generated Insights** – Weekly summaries include natural language feedback and actionable insights.  
- **High Performance** – Caching with Redis ensures fast API responses for analytics and logs.  
- **API Protection** – Rate limiting is implemented on expensive endpoints to prevent abuse.

---

## Tech Stack

- **Framework**: FastAPI  
- **Database**: PostgreSQL (Supabase)  
- **Authentication**: Supabase Auth  
- **Caching**: Redis  
- **AI/LLM**: Kimi/Gemini via OpenRouter API  
- **Data Validation**: Pydantic  
- **Testing**: Pytest  
- **Containerization**: Docker & Docker Compose

---

## Getting Started

### Prerequisites

- Python 3.11+  
- Docker Desktop  
- Supabase account  
- OpenRouter API key  

---

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <https://github.com/Satyam-Chaudhary/macro-check.git>
   cd <macro_tracker>

2. **Create a virtual environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
3. **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
## Environment Setup

Create a `.env` file in your project root using the template below:

```env
# Supabase Settings
SUPABASE_URL="YOUR_PROJECT_URL_HERE"
SUPABASE_KEY="YOUR_ANON_PUBLIC_KEY_HERE"
SUPABASE_SERVICE_KEY="YOUR_SERVICE_ROLE_KEY_HERE"

# Supabase PostgreSQL Database URL
DATABASE_URL="postgresql://postgres:[YOUR-DB-PASSWORD]@[YOUR-DB-HOST]:6543/postgres"

# OpenRouter Settings
OPENROUTER_API_KEY="sk-or-your-key-here"
OPENROUTER_MODEL_NAME="google/gemini-2.5-flash"

# Redis Settings
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""
```

## Supabase Database Setup

In the Supabase dashboard, open the SQL Editor and run:

```sql
-- Users table
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    supabase_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE
);

-- Goals table
CREATE TABLE public.goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    calories REAL NOT NULL,
    protein REAL NOT NULL,
    carbs REAL NOT NULL,
    fat REAL NOT NULL
);

-- Food logs table
CREATE TABLE public.food_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    calories REAL NOT NULL,
    protein REAL NOT NULL,
    carbs REAL NOT NULL,
    fat REAL NOT NULL
);

-- Indexes
CREATE INDEX ix_users_email ON public.users(email);
CREATE INDEX ix_users_supabase_user_id ON public.users(supabase_user_id);
```

## Running the Application

**Locally with Uvicorn**

Make sure Redis is running locally, then start the API:

```bash
uvicorn app.main:app --reload
```
The API will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000).

**Locally with Docker Compose**

Ensure Docker Desktop is running, then:

```bash
docker-compose up --build
```
The API will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Testing

Run tests with Pytest (uses in-memory SQLite and mocks authentication):

```bash
pytest
```

## Project Structure

```
├── app/                # Main application source code
│   ├── api/            # API endpoint routers
│   ├── core/           # Configuration, dependencies, security
│   ├── crud/           # Database interaction logic
│   ├── db/             # Database models and session management
│   ├── llm/            # LLM client and prompts
│   └── schemas/        # Pydantic data schemas
├── tests/              # Automated tests
├── .env                # Local environment variables (not committed)
├── Dockerfile          # Docker container build
└── docker-compose.yml  # Services for local development
```


















# Phase Devlopment
**Phase 1: Core System (Baseline Functionality)** ✅
*Goal: Build a working local backend with basic nutritional tracking*

- [x]  Food entry logging (date, meal type, macros)
- [x]  SQLite database with SQLAlchemy models
- [x]  Basic CLI for testing log creation
- [x]  Goal setting per day (calories, protein, carbs, fat)
- [x]  CLI/terminal commands for log management
- [x]  JSON replaced with real database (migrated)

🔁 **Phase 2: Analytics, Caching, and UX Improvements***Goal: Smart insights + fast and clean terminal user experience*

- [x]  Weekly summary analytics (total macros, best/worst days)
- [x]  Target comparison logic (under/over targets daily/weekly)
- [x]  Redis-based:
    - [x]  Caching recent logs and weekly summary
    - [x]  Caching user goals
    - [ ]  Optional: Session/token caching → not needed in stateless architecture using jwt
- [x]  Terminal UX improvements:
    - [x]  Pretty table output for logs and summaries
    - [x]  `summary`, `compare`, `goals` command
    - [x]  Graphs (if possible via terminal or CLI plots)

🌐 **Phase 3: API and Authentication (FastAPI)***Goal: Make backend usable for frontend/mobile*

- [x]  Build FastAPI endpoints for:
    - [x]  Log creation, fetching, deletion
    - [x]  Goal management
    - [x]  Weekly summary
- [x]  JWT-based Auth:
    - [x]  Signup / login with hashed password
    - [x]  Token generation and refresh

🧠 **Phase 4: LLM Intelligence + Event Streaming***Goal: Enrich the core tracking UX with AI and real-time insights*

- [x]  Use OpenAI or Ollama to enhance logging:
    - [x]  Clean user-entered food descriptions (e.g. “2 eggs n toast” → structured log)
    - [ ]  Suggest healthier options or replacements based on a single log(later)
    - [x]  Summarize weekly nutrition in natural language
- [ ]  Kafka Integration:
    - [ ]  Produce `FoodLogged` event when a user logs food
    - [ ]  Background consumer to:
        - [ ]  Enrich data (e.g., with AI)
        - [ ]  Generate and store insights (for the weekly summary)
    - [ ]  Optional: Stream recent logs to user frontend (WebSocket-ready)

🛡 **Phase 5: Testing, Reliability, and Validation***Goal: Ensure system correctness and robustness*

- [x]  Unit + integration tests
- [x]  Redis for:
    - [x]  Rate limiting (per user log actions)
- [x]  Data validation with Pydantic
- [x]  Error handling with custom exceptions
- [x]  CLI-based test runner

🐳 **Phase 6: Deployment and DevOps***Goal: Run this app in the cloud without spending money*

- [x]  Dockerize backend (FastAPI, Redis, Kafka)
- [x]  Docker Compose with:
    - [x]  FastAPI
    - [x]  SQLite volume
    - [x]  Redis
    - [ ]  Kafka + Zookeeper
- [x]  Deploy using free tier:
    - [x]  Railway
- [x]  Set up environment variables
- [ ]  Create health check route + logs
- [ ]  Optional: Add Prometheus + Grafana for metrics

---

🚀 **Future Features & Enhancements (Post-MVP)***To be developed after the core macro-tracker is complete and deployed*

- [ ]  **AI Meal Planner Module:** A dedicated feature for generating full meal plans based on user goals and preferences.
- [ ]  **Advanced Analytics Engine:** A system for deep historical trend analysis, forecasting, and long-term insights.
- [ ]  **React Native App:** A full mobile client that consumes the backend API.

