from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models

from auth import router as auth_router

app = FastAPI()

origins = [
    "http://127.0.0.1:8080",
    "http://localhost:8080",
    # add more if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # <— important
    allow_credentials=True,
    allow_methods=["*"],          # allow GET, POST, PUT, DELETE, OPTIONS, etc.
    allow_headers=["*"],          # allow all headers (Content-Type, Authorization…)
)

Base.metadata.create_all(bind=engine)
app.include_router(auth_router)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}