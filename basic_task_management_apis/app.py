from fastapi import FastAPI, HTTPException, Request, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# Mount the "templates" directory for Jinja2
templates = Jinja2Templates(directory="templates")

# In-memory storage for tasks
tasks = []
next_id = 1  # simple counter for unique IDs

class Task(BaseModel):
    id: int
    title: str
    completed: bool = False

class TaskCreate(BaseModel):
    title: str

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None

# Serve the basic UI at root
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "tasks": tasks})

# API Endpoints
@app.get("/tasks", response_model=List[Task])
async def get_tasks():
    return tasks

@app.post("/tasks", status_code=201, response_model=Task)
async def create_task(task: TaskCreate):
    global next_id
    new_task = Task(id=next_id, title=task.title)
    tasks.append(new_task)
    next_id += 1
    return new_task

@app.put("/tasks/{task_id}", response_model=Task)
async def update_task(task_id: int, update: TaskUpdate):
    for task in tasks:
        if task.id == task_id:
            if update.title is not None:
                task.title = update.title
            if update.completed is not None:
                task.completed = update.completed
            return task
    raise HTTPException(status_code=404, detail="Task not found")

@app.delete("/tasks/{task_id}", status_code=204)
async def delete_task(task_id: int):
    for idx, task in enumerate(tasks):
        if task.id == task_id:
            tasks.pop(idx)
            return RedirectResponse(url='/', status_code=303)
    raise HTTPException(status_code=404, detail="Task not found")

# To run the server:
# uvicorn main:app --reload --host 0.0.0.0 --port 8000