from fastapi import FastAPI

from . import models
from . import database
from .routers import student, course, professor

app = FastAPI(title="University Course Management System")

models.Base.metadata.create_all(bind=database.engine)

app.include_router(student.router)
app.include_router(course.router)
app.include_router(professor.router)


@app.get("/")
def health_check():
    return {"message": "pong"}