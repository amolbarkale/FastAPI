from typing import List
from fastapi import Depends, FastAPI, HTTPException, status, Response
from sqlalchemy.orm import Session

from . import schemas, models
from .databse import engine, SessionLocal

app = FastAPI(title="FastAPI tutorial")

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/blog", status_code=status.HTTP_201_CREATED, tags=["blogs"])
def create_blog(blog: schemas.Blog, db: Session = Depends(get_db)):
    new_blog = models.Blog(title=blog.title, body=blog.body, user_id=1)
    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)

    return new_blog


@app.get("/blog", status_code=status.HTTP_200_OK, response_model=List[schemas.ShowBlog], tags=["blogs"])
def get_blogs(db: Session = Depends(get_db)):
    blogs = db.query(models.Blog).all()
    
    if not blogs:
        raise HTTPException(status_code=404, detail="Not Found")
    return blogs


@app.get("/blog/{id}", status_code=status.HTTP_200_OK, response_model=schemas.ShowBlog, tags=["blogs"])
def get_blog(id: int, response: Response, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.id == id).first()
    print('bloggg:', blog)
    
    if not blog:
        raise HTTPException(status_code=404, detail="Not Found")
    return blog


@app.delete("/blog", status_code=204, tags=["blogs"])
def delete_blog(id:int, db: Session = Depends(get_db)):
    deleted_blog = db.query(models.Blog).filter(models.Blog.id == id)
    if not delete_blog.first():
        raise HTTPException(status_code=404, detail="Now found")

    deleted_blog.delete(synchronize_session="evaluate")
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.put("/blog", status_code=202, tags=["blogs"])
def update_blog(id, updated_blog: schemas.Blog, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.id == id)
    
    if not blog.first():
        raise HTTPException(status_code=404, detail="Not found")
    
    blog.update(updated_blog.model_dump())
    db.commit()
    return "updated"

@app.post("/user", response_model=schemas.ShowUser, tags=["users"])
def create_user(user: schemas.User, db: Session = Depends(get_db)):
    new_user = models.User(name=user.name, email=user.email, password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@app.get("/user/{id}", response_model=schemas.ShowUser, tags=["users"])
def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not found")
    
    return user
