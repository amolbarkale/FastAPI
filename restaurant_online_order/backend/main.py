from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import routes, models, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Restaurant Online Order API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Restaurant Online Order API"}