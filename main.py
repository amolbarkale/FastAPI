from fastapi import FastAPI, HTTPException
from typing import Optional
from pydentic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String

app = FastAPI()

# Database Configuration
DATABASE_URL = "sqlite:///./test.db"

# SQLite is a file based db, it soes not allow multiple threads to access the same file
# so each thread should have a separate(new) connection
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# This is kind of factory for creating a session
sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This is a parent class for all databse models
Base = declarative_base()

item_db = {
    1: "hello",
    2: "world",
}

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

@app.get("/items/{item_id}")
def read_item(item_id: int):
    if item_id in item_db:
        return {"item_id": item_id, "item": item_db.get(item_id, "Item not found")}
    
    return {"error": "Item ID is required"}

@app.post("/items/{item_id}")
def create_item(item_id: int, name: str, description: Optional[str] = None):
    if item_id in item_db:
        return {"error": "Item ID is already taken"}
    item_db[item_id] = name
    return {"item_id": item_id, "name": name, "description": description}

@app.put("/items/{item_id}")
def update_item(item_id: int, name: str, description: Optional[str] = None):
    if item_id not in item_db:
        return {"error": "Item ID does not exist"}
    item_db[item_id] = name
    return {"item_id": item_id, "name": name, "description": description}

@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    if item_id not in item_db:
        return {"error": "Item ID does not exist"}
    del item_db[item_id]
    return {"message": "Item deleted successfully"}