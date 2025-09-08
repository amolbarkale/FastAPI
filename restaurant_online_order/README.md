# Restaurant Online Ordering Backend

This is the **backend API service** for the Restaurant Online Ordering application.  
It is built with **FastAPI**, **SQLAlchemy ORM 2.0**, **Celery** and uses **Redis** for caching.

---

## Features
- FastAPI backend with modular endpoints (restaurants, orders, menu items, etc.).
- SQLAlchemy 2.0 ORM for database models.
- Redis caching layer for optimized responses.
- Ready-to-use Docker setup for development and deployment.
- Backend worker using Celery

---

## Requirements
Before starting, make sure you have installed:
- [Python 3.11+](https://www.python.org/downloads/)
- [Redis](https://redis.io/) (running locally or via Docker)
- [Docker](https://docs.docker.com/get-docker/) (optional but recommended)

---

## Local Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/amolbarkale/FastAPI.git
    cd FastAPI/restaurant_online_order/backend
    ```

2.  **Create and activate virtual environment**
    ```bash
    python -m venv venv
    source venv/bin/activate   # for Linux/Mac
    venv\Scripts\activate      # for Windows
    ```

3.  **Install dependencies**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Setup environment variables**  
    Create a `.env` file in `backend/` with the following:
    ```env
    DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/restaurant_db
    REDIS_URL=redis://localhost:6379/0
    SECRET_KEY="09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM="HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES=3
    CACHE_TTL=3600
    ```
    **Note:** For production, `SECRET_KEY` should be managed more securely (e.g., via Docker secrets or runtime environment variables) and not hardcoded.

5.  **Run database migrations (if using Alembic)**
    ```bash
    alembic upgrade head
    ```

6.  **Start the app**
    ```bash
    fastapi dev main.py
    ```

    The app will run at:  
    `http://127.0.0.1:8000`

---

## Run with Docker

This project includes a `Dockerfile` (located in the `backend/` directory) and a `docker-compose.yml` (expected in the parent `restaurant_online_order/` directory) to containerize the application and its dependencies (Redis).

**Important:** Due to the `Dockerfile`'s location (`backend/`), Python imports in your code should be relative or direct (e.g., `from schemas import ...` instead of `from backend.schemas import ...`).

### 1. Build and Run Services

Navigate to the directory containing your `docker-compose.yml` (e.g., `cd ../` from `backend/` if you are in `backend/`).

To build the Docker images and start all services (backend API and Redis):

```bash
docker compose up --build
```

This command will:
- Build the backend Docker image using the Dockerfile in backend/.
- Start the backend container, running FastAPI on port 8000.
- Start the redis container on port 6379.

For initial debugging, it's often better to run in the foreground to see live logs:

```bash
docker compose up
```

(Press Ctrl+C to stop all services when running in the foreground).

### 2. Access the Application

Once the backend container is running, you can access your FastAPI application:

- API Documentation (Swagger UI): http://localhost:8000/docs
- API Documentation (ReDoc): http://localhost:8000/redoc
- Base URL: http://localhost:8000

### 3. Stop Services

To stop and remove all containers, networks, and volumes created by docker compose:

```bash
docker compose down
```

## Debugging Docker Issues

If your Docker containers aren't running as expected or you're encountering errors, use these commands to diagnose the problem:

**Check Running Containers:**
See which containers are currently active.

```bash
docker ps
```

**Check All Containers (Including Exited Ones):**
This is crucial if a container starts and then immediately crashes. Look for containers with STATUS "Exited".

```bash
docker ps -a
```

**View Container Logs:**
Get the full output from a specific container. This is the primary way to find error messages and tracebacks.

```bash
docker logs <container_name_or_id>
# Example: docker logs backend
```

If a container exits immediately, run `docker compose up` (without -d) to stream logs directly to your terminal and catch the error.

**Execute a Command Inside a Running Container:**
Test connectivity or inspect files directly within a container. For example, to check if your FastAPI app is responding internally:

```bash
docker exec <container_name_or_id> curl http://localhost:8000/docs
# Example: docker exec backend curl http://localhost:8000/docs
```

If this works but http://localhost:8000/docs doesn't work from your host, the issue is with host-to-container communication (e.g., firewall, port conflict).

**Test Host-to-Container Connectivity (from your host terminal):**
Verify that your host machine can reach the exposed port.

```bash
curl http://localhost:8000/docs
```

If this fails, check your host's firewall settings or if another process is using port 8000.

**Rebuild Images (if code changes or dependencies updated):**
Sometimes, a fresh build is needed. Use `--no-cache` if you suspect caching issues in the build process.

```bash
docker compose build
# Or for a clean rebuild: docker compose build --no-cache
```

**Clean Up Docker Resources:**
If you have many stopped containers, unused images, or networks, cleaning them up can resolve obscure issues.

```bash
docker system prune -a
```

(Use with caution, this removes all unused Docker data).

---

## Caching Setup

Caching is powered by Redis.

The `cache.py` module handles:
- `get_cache(key)`
- `set_cache(key, value, ttl)`
- `make_key(prefix, **kwargs)`
- `get_version(name)` and `bump_version(name)` for versioned cache invalidation.

By default, cache TTL is controlled by:

```env
CACHE_TTL=3600
```

---

## License

MIT License

---

Celery setup - https://medium.com/@hitorunajp/celery-and-background-tasks-aebb234cae5d