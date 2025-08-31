from enum import IntEnum
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

api = FastAPI()

class Priority(IntEnum):
    LOW = 3
    MEDIUM = 2
    HIGH = 1

class TodoBase(BaseModel):
    todo_name: str = Field(..., min_length=3, max_length=100, description="Name of the todo")
    todo_description: str = Field(..., description="Description of the todo")
    priority: Priority = Field(default=Priority.LOW, description="Priority of the todo")

class TodoCreate(TodoBase):
    pass

class Todo(TodoBase):
    todo_id: int = Field(..., description="Unique identifier of the todo")

class TodoUpdate(BaseModel):
    todo_name: Optional[str] = Field(None, min_length=3, max_length=100, description="Name of the todo")
    todo_description: Optional[str] = Field(None, description="Description of the todo")
    priority: Optional[Priority] = Field(None, description="Priority of the todo")

DB = [
    Todo(todo_id= 1, todo_name= "Sports 1", todo_description= "Go to the gym 1", priority=Priority.HIGH),
    Todo(todo_id= 2, todo_name= "Sports 2", todo_description= "Go to the gym 2", priority=Priority.LOW),
    Todo(todo_id= 3, todo_name= "Sports 3", todo_description= "Go to the gym 3", priority=Priority.MEDIUM),
    Todo(todo_id= 4, todo_name= "Sports 4", todo_description= "Go to the gym 4", priority=Priority.MEDIUM),
]

@api.get("/todos/{todo_id}", response_model=Todo)
def get_todo(todo_id: int):
    for todo in DB:
        if todo.todo_id == todo_id:
            return todo

@api.get("/todos", response_model=List[Todo])
def get_n_todos(first_n: int = None):
    if first_n:
        return DB[:int(first_n)]
    else:
        return DB

@api.post("/todos", response_model=Todo)
def create_todo(todo: TodoCreate):
    new_todo_id = max(todo.todo_id for todo in DB) + 1

    new_todo = Todo(todo_id= new_todo_id, todo_name= todo.todo_name, todo_description= todo.todo_description, priority=todo.priority)

    DB.append(new_todo)

    return new_todo

@api.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, updated_todo: TodoUpdate):
    for todo in DB:
        if todo.todo_id == todo_id:
            if updated_todo.todo_name is not None:
                todo.todo_name = updated_todo.todo_name
            if updated_todo.todo_description is not None:
                todo.todo_description = updated_todo.todo_description
            if updated_todo.priority is not None:
                todo.priority = updated_todo.priority
                
            return todo
    raise HTTPException(status_code=404, detail="Todo not found")

@api.delete("/todos/{todo_id}", response_model=Todo)
def delete_todo(todo_id: int):
    for index, todo in enumerate(DB):
        if todo.todo_id == todo_id:
            deleted_todo = DB.pop(index)
            return deleted_todo
    raise HTTPException(status_code=404, detail="Todo not found")