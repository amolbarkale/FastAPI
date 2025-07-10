from fastapi import FastAPI, HTTPException, Request, Form, Depends
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import os

# Database Configuration
# Using SQLite in-memory database for temporary storage
SQLALCHEMY_DATABASE_URL = "sqlite:///./tasks.db"  # You can use "sqlite:///:memory:" for truly temporary
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class TaskModel(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic Models
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# FastAPI App
app = FastAPI(title="Task Management API", version="1.0.0")

# Templates
templates = Jinja2Templates(directory="templates")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API Endpoints

@app.get("/tasks", response_model=List[TaskResponse])
async def get_tasks(db: Session = Depends(get_db)):
    """Fetch all tasks from the database"""
    tasks = db.query(TaskModel).all()
    return tasks

@app.post("/tasks", response_model=TaskResponse, status_code=201)
async def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    """Create a new task"""
    db_task = TaskModel(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    """Update an existing task"""
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update only provided fields
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    db_task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}", status_code=204)
async def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Delete a task"""
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return

# Web UI Endpoints

@app.get("/", response_class=HTMLResponse)
async def home(request: Request, db: Session = Depends(get_db)):
    """Home page with task list"""
    tasks = db.query(TaskModel).all()
    return templates.TemplateResponse("index.html", {"request": request, "tasks": tasks})

@app.post("/tasks/create")
async def create_task_form(
    title: str = Form(...),
    description: str = Form(""),
    db: Session = Depends(get_db)
):
    """Create task from form submission"""
    db_task = TaskModel(title=title, description=description)
    db.add(db_task)
    db.commit()
    return RedirectResponse(url="/", status_code=303)

@app.post("/tasks/{task_id}/toggle")
async def toggle_task_completion(task_id: int, db: Session = Depends(get_db)):
    """Toggle task completion status"""
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_task.completed = not db_task.completed
    db_task.updated_at = datetime.utcnow()
    db.commit()
    return RedirectResponse(url="/", status_code=303)

@app.post("/tasks/{task_id}/delete")
async def delete_task_form(task_id: int, db: Session = Depends(get_db)):
    """Delete task from form submission"""
    db_task = db.query(TaskModel).filter(TaskModel.id == task_id).first()
    
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return RedirectResponse(url="/", status_code=303)

# Exception Handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc: HTTPException):
    return templates.TemplateResponse("404.html", {"request": request}, status_code=404)

if __name__ == "__main__":
    import uvicorn
    
    # Create templates directory if it doesn't exist
    os.makedirs("templates", exist_ok=True)
    
    # Create the HTML template
    html_template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Manager</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .task-form {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        input[type="text"], textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        textarea {
            height: 60px;
            resize: vertical;
        }
        .btn {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            text-decoration: none;
            display: inline-block;
        }
        .btn:hover {
            background-color: #0056b3;
        }
        .btn-success {
            background-color: #28a745;
        }
        .btn-success:hover {
            background-color: #218838;
        }
        .btn-danger {
            background-color: #dc3545;
        }
        .btn-danger:hover {
            background-color: #c82333;
        }
        .btn-warning {
            background-color: #ffc107;
            color: #212529;
        }
        .btn-warning:hover {
            background-color: #e0a800;
        }
        .task-list {
            margin-top: 20px;
        }
        .task-item {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .task-item.completed {
            background-color: #d4edda;
            border-color: #c3e6cb;
        }
        .task-content {
            flex-grow: 1;
        }
        .task-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .task-title.completed {
            text-decoration: line-through;
            color: #6c757d;
        }
        .task-description {
            color: #6c757d;
            font-size: 14px;
        }
        .task-actions {
            display: flex;
            gap: 10px;
        }
        .task-meta {
            font-size: 12px;
            color: #6c757d;
            margin-top: 5px;
        }
        .no-tasks {
            text-align: center;
            color: #6c757d;
            font-style: italic;
            padding: 40px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Task Manager</h1>
        
        <!-- Task Creation Form -->
        <div class="task-form">
            <h3>Create New Task</h3>
            <form action="/tasks/create" method="post">
                <div class="form-group">
                    <label for="title">Task Title:</label>
                    <input type="text" id="title" name="title" required>
                </div>
                <div class="form-group">
                    <label for="description">Description (optional):</label>
                    <textarea id="description" name="description"></textarea>
                </div>
                <button type="submit" class="btn">Add Task</button>
            </form>
        </div>
        
        <!-- Task List -->
        <div class="task-list">
            <h3>Your Tasks</h3>
            {% if tasks %}
                {% for task in tasks %}
                <div class="task-item {% if task.completed %}completed{% endif %}">
                    <div class="task-content">
                        <div class="task-title {% if task.completed %}completed{% endif %}">
                            {{ task.title }}
                        </div>
                        {% if task.description %}
                        <div class="task-description">{{ task.description }}</div>
                        {% endif %}
                        <div class="task-meta">
                            Created: {{ task.created_at.strftime('%Y-%m-%d %H:%M') }}
                            {% if task.updated_at != task.created_at %}
                            | Updated: {{ task.updated_at.strftime('%Y-%m-%d %H:%M') }}
                            {% endif %}
                        </div>
                    </div>
                    <div class="task-actions">
                        <form action="/tasks/{{ task.id }}/toggle" method="post" style="display: inline;">
                            {% if task.completed %}
                            <button type="submit" class="btn btn-warning">Mark Incomplete</button>
                            {% else %}
                            <button type="submit" class="btn btn-success">Mark Complete</button>
                            {% endif %}
                        </form>
                        <form action="/tasks/{{ task.id }}/delete" method="post" style="display: inline;">
                            <button type="submit" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this task?')">Delete</button>
                        </form>
                    </div>
                </div>
                {% endfor %}
            {% else %}
                <div class="no-tasks">
                    No tasks yet. Create your first task above!
                </div>
            {% endif %}
        </div>
    </div>
</body>
</html>'''
    
    # Write the template file
    with open("templates/index.html", "w", encoding="utf-8") as f:
        f.write(html_template)
    
    # Create 404 template
    error_template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Not Found</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        .error-container {
            background-color: #f8d7da;
            color: #721c24;
            padding: 20px;
            border-radius: 8px;
            margin-top: 50px;
        }
        .btn {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <h1>404 - Task Not Found</h1>
        <p>The task you're looking for doesn't exist.</p>
        <a href="/" class="btn">Go Back to Tasks</a>
    </div>
</body>
</html>'''
    
    with open("templates/404.html", "w", encoding="utf-8") as f:
        f.write(error_template)
    
    print("Task Management API is starting...")
    print("API Documentation: http://localhost:8000/docs")
    print("Web UI: http://localhost:8000/")
    uvicorn.run(app, host="0.0.0.0", port=8000)