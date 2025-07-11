"""
Database Connection Configuration

This file contains the SQLAlchemy database setup including:
- Database URL configuration
- Session management
- Base class for models
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database URL - will use SQLite for development, PostgreSQL for production
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "sqlite:///./ticket_booking.db"  # Default to SQLite file
)

# Create database engine
# For SQLite, we add check_same_thread=False to allow multiple threads
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Create SessionLocal class - each instance will be a database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for our models
Base = declarative_base()

# Dependency to get database session
def get_db():
    """
    Database session dependency for FastAPI
    
    This function creates a new database session for each request
    and closes it when the request is complete.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Function to create all tables
def create_tables():
    """
    Create all database tables based on the models
    """
    Base.metadata.create_all(bind=engine) 