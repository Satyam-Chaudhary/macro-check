# Macro-check

**Phase 1: Core System (Baseline Functionality)** ✅
*Goal: Build a working local backend with basic nutritional tracking*

- [x]  `[x]` Food entry logging (date, meal type, macros)
- [x]  `[x]` SQLite database with SQLAlchemy models
- [x]  `[x]` Basic CLI for testing log creation
- [x]  `[x]` Goal setting per day (calories, protein, carbs, fat)
- [x]  `[x]` CLI/terminal commands for log management
- [x]  `[x]` JSON replaced with real database (migrated)

🔁 **Phase 2: Analytics, Caching, and UX Improvements***Goal: Smart insights + fast and clean terminal user experience*

- [x]  `[ ]` Weekly summary analytics (total macros, best/worst days)
- [x]  `[ ]` Target comparison logic (under/over targets daily/weekly)
- [x]  `[ ]` Redis-based:
    - [x]  `[ ]` Caching recent logs and weekly summary
    - [x]  `[ ]` Caching user goals
    - [ ]  `[ ]` Optional: Session/token caching → not needed in stateless architecture using jwt
- [x]  `[ ]` Terminal UX improvements:
    - [x]  `[ ]` Pretty table output for logs and summaries
    - [x]  `[ ]` `summary`, `compare`, `goals` command
    - [x]  `[ ]` Graphs (if possible via terminal or CLI plots)

🌐 **Phase 3: API and Authentication (FastAPI)***Goal: Make backend usable for frontend/mobile*

- [x]  `[ ]` Build FastAPI endpoints for:
    - [x]  `[ ]` Log creation, fetching, deletion
    - [x]  `[ ]` Goal management
    - [x]  `[ ]` Weekly summary
- [x]  `[ ]` JWT-based Auth:
    - [x]  `[ ]` Signup / login with hashed password
    - [x]  `[ ]` Token generation and refresh

🧠 **Phase 4: LLM Intelligence + Event Streaming***Goal: Enrich the core tracking UX with AI and real-time insights*

- [x]  `[ ]` Use OpenAI or Ollama to enhance logging:
    - [x]  `[ ]` Clean user-entered food descriptions (e.g. “2 eggs n toast” → structured log)
    - [ ]  `[ ]` Suggest healthier options or replacements based on a single log(later)
    - [x]  `[ ]` Summarize weekly nutrition in natural language
- [ ]  `[ ]` Kafka Integration:
    - [ ]  `[ ]` Produce `FoodLogged` event when a user logs food
    - [ ]  `[ ]` Background consumer to:
        - [ ]  `[ ]` Enrich data (e.g., with AI)
        - [ ]  `[ ]` Generate and store insights (for the weekly summary)
    - [ ]  `[ ]` Optional: Stream recent logs to user frontend (WebSocket-ready)

🛡 **Phase 5: Testing, Reliability, and Validation***Goal: Ensure system correctness and robustness*

- [ ]  `[ ]` Unit + integration tests
- [ ]  `[ ]` Redis for:
    - [ ]  `[ ]` Rate limiting (per user log actions)
- [ ]  `[ ]` Data validation with Pydantic
- [ ]  `[ ]` Error handling with custom exceptions
- [ ]  `[ ]` CLI-based test runner

🐳 **Phase 6: Deployment and DevOps***Goal: Run this app in the cloud without spending money*

- [ ]  `[ ]` Dockerize backend (FastAPI, Redis, Kafka)
- [ ]  `[ ]` Docker Compose with:
    - [ ]  `[ ]` FastAPI
    - [ ]  `[ ]` SQLite volume
    - [ ]  `[ ]` Redis
    - [ ]  `[ ]` Kafka + Zookeeper
- [ ]  `[ ]` Deploy using free tier:
    - [ ]  `[ ]` Railway / Fly.io / Render / Deta
- [ ]  `[ ]` Set up environment variables
- [ ]  `[ ]` Create health check route + logs
- [ ]  `[ ]` Optional: Add Prometheus + Grafana for metrics

---

🚀 **Future Features & Enhancements (Post-MVP)***To be developed after the core macro-tracker is complete and deployed*

- [ ]  `[ ]` **AI Meal Planner Module:** A dedicated feature for generating full meal plans based on user goals and preferences.
- [ ]  `[ ]` **Advanced Analytics Engine:** A system for deep historical trend analysis, forecasting, and long-term insights.
- [ ]  `[ ]` **React Native App:** A full mobile client that consumes the backend API.

### Core Backend

- **Python**: The programming language for our entire backend.
- **FastAPI**: The high-performance web framework for building our API.
- **Uvicorn**: The server that will run our FastAPI application.
- **Pydantic**: Used by FastAPI for data validation and settings management. It ensures data consistency throughout the app.

---

### ## Database

- **SQLAlchemy**: The primary library for interacting with our database. It allows us to write Python code instead of raw SQL.
- **SQLite**: The simple, file-based database we'll use for Phase 1 to get started quickly.
- **Alembic**: The tool we'll use for database migrations, allowing us to update our database schema as we add features.
- **PostgreSQL**: The robust, production-ready database you're familiar with that we'll migrate to in later phases.

---

### ## AI / LLM

- **OpenRouter**: The API gateway we will use to access Google's Gemini model.
- **HTTPX**: A modern Python library for making asynchronous HTTP requests to the OpenRouter API.

---

### ## Caching & Messaging (Future Phases)

- **Redis**: The in-memory data store we'll introduce in Phase 2 for caching. I'll guide you through every step since you're new to it.
- **Kafka**: The event streaming platform planned for Phase 4 to handle real-time data processing.

---

### ## Development & Testing

- **Typer**: A library for creating the Command-Line Interface (CLI) needed for Phase 1 testing and management.
- **Pytest**: The standard framework for writing and running our unit and integration tests.
- **Docker & Docker Compose**: The containerization tools we will use in Phase 6 to package and deploy the entire application.