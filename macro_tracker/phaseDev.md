



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

