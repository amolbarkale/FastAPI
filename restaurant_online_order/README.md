# Restaurant Online Ordering Backend

This is the **backend API service** for the Restaurant Online Ordering application.  
It is built with **FastAPI**, **SQLAlchemy ORM 2.0**, and uses **Redis** for caching.

---

## Features
- FastAPI backend with modular endpoints (restaurants, orders, menu items, etc.).
- SQLAlchemy 2.0 ORM for database models.
- Redis caching layer for optimized responses.
- Ready-to-use Docker setup for development and deployment.

---

## Requirements
Before starting, make sure you have installed:
- [Python 3.11+](https://www.python.org/downloads/)
- [Redis](https://redis.io/) (running locally or via Docker)
- [Docker](https://docs.docker.com/get-docker/) (optional but recommended)

---

## Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/amolbarkale/FastAPI.git
   cd FastAPI/restaurant_online_order/backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate   # for Linux/Mac
   venv\Scripts\activate      # for Windows
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup environment variables**  
   Create a `.env` file in `backend/` with the following:
   ```env
   DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/restaurant_db
   REDIS_URL=redis://localhost:6379/0
   CACHE_TTL=3600
   ```

5. **Run database migrations (if using Alembic)**
   ```bash
   alembic upgrade head
   ```

6. **Start the app**
   ```bash
   fastapi dev main.py
   ```

   The app will run at:  
   `http://127.0.0.1:8000`

---

## Run with Docker

### 1. Build and run with Docker Compose
A `docker-compose.yml` is provided to start both the API and Redis.

```bash
docker-compose up --build
```

This will:
- Run FastAPI backend on port `8000`
- Run Redis on port `6379`

### 2. Stop containers
```bash
docker-compose down
```

---

## Caching Setup
Caching is powered by **Redis**.

- The `cache.py` module handles:
  - `get_cache(key)`
  - `set_cache(key, value, ttl)`
  - `make_key(prefix, **kwargs)`
  - `get_version(name)` and `bump_version(name)` for versioned cache invalidation.

- By default, cache TTL is controlled by:
  ```env
  CACHE_TTL=3600
  ```

---

## Run Tests
If you have test cases:
```bash
pytest
```

---

## License
MIT License
