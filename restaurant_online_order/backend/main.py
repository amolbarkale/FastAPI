from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import Base
from database import engine
from routes import restaurant, user, menu_items

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Restaurant Online Order API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(restaurant.router)
app.include_router(user.router)
app.include_router(menu_items.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Restaurant Online Order API"}