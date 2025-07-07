from fastapi import FastAPI, HTTPException
from typing import Optional
from pydentic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String

# sqlalchemy -> It is kind of ORM (Object Relational Mapping) library
# It allows us to interact with the database using Python objects instead of writing raw SQL queries

# _______________________________________________________________________________________
# Database Configuration
DATABASE_URL = "sqlite:///./test.db"

# SQLite is a file based db, it soes not allow multiple threads to access the same file
# so each thread should have a separate(new) connection
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# This is kind of factory for creating a session
sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This is a parent class for all databse models
Base = declarative_base()

# Model (table) definition
class ItemModel(Base):
    __tablename__ = "items"

    id =Column(Integer, primary_key=True, index=True)
    name=Column(String, index=True)
    description = Column(String)

class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    owner_id = Column(String, unique=True, index=True)

Base.metadata.create_all(bind=engine)


app = FastAPI()
# In-memory (hard-disk) database for demonstration purposes
# In a real application, you would use a persistent database like SQLite, PostgreSQL, etc

def get_db():
    """
    Dependency to get a database session.
    This function is used to create a new database session for each request.
    """
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()
# _______________________________________________________________________________________

@app.get("/items/{item_id}")
def read_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(ItemModel).filter(ItemModel.id == item_id).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return {"item_id": item.id, "name": item.name, "description": item.description}

@app.post("/items/")
def create_item(name: str, description: Optional[str] = None, db: Session = Depends(get_db)):
    db_item = ItemModel(name=name, description=description) # no need to pass id, it will be auto generated as it is primary key
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return {"item_id": item.id, "name": item.name, "description": item.description}

@app.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):  
    item = db.query(ItemModel).filter(ItemModel.id == item_id).first()

    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(item)
    db.commit()
    return {"message": "Item deleted successfully"}
# _______________________________________________________________________________________


# item_db = {
#     1: "hello",
#     2: "world",
# }

# class Item(BaseModel):
#     name: str
#     description: Optional[str] = None
#     price: float
#     tax: Optional[float] = None

# @app.get("/items/{item_id}")
# def read_item(item_id: int):
#     if item_id in item_db:
#         return {"item_id": item_id, "item": item_db.get(item_id, "Item not found")}
    
#     return {"error": "Item ID is required"}

# @app.post("/items/{item_id}")
# def create_item(item_id: int, name: str, description: Optional[str] = None):
#     if item_id in item_db:
#         return {"error": "Item ID is already taken"}
#     item_db[item_id] = name
#     return {"item_id": item_id, "name": name, "description": description}

# @app.put("/items/{item_id}")
# def update_item(item_id: int, name: str, description: Optional[str] = None):
#     if item_id not in item_db:
#         return {"error": "Item ID does not exist"}
#     item_db[item_id] = name
#     return {"item_id": item_id, "name": name, "description": description}

# @app.delete("/items/{item_id}")
# def delete_item(item_id: int):
#     if item_id not in item_db:
#         return {"error": "Item ID does not exist"}
#     del item_db[item_id]
#     return {"message": "Item deleted successfully"}