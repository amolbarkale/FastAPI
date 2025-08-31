from fastapi import FastAPI

from . import models
from .databse import engine
from .routers import blog, user

app = FastAPI(title="FastAPI tutorial")

models.Base.metadata.create_all(bind=engine)

app.include_router(blog.router)
app.include_router(user.router)
