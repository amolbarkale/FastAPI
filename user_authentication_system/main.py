from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from starlette.middleware.security import SecurityMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from database import engine, Base
import models
from auth import router as auth_router
from rate_limiter import limiter

app = FastAPI()

# CORS Configuration
origins = [
    "http://127.0.0.1:8080",
    "http://localhost:8080",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HTTPS redirect & security headers
app.add_middleware(HTTPSRedirectMiddleware)
app.add_middleware(
    SecurityMiddleware,
    hsts_seconds=31536000,
    hsts_include_subdomains=True,
    content_security_policy="default-src 'self'"
)

# Rate limiting setup
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Create tables & mount router
Base.metadata.create_all(bind=engine)
app.include_router(auth_router)

# Health check endpoint
@app.get("/health")
@limiter.limit("100/minute")
def health():
    return {"status": "ok"}
