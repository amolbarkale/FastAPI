from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base  # correct spelling!

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """
    FastAPI dependency that provides a DB session, 
    then closes it after the request finishes.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()