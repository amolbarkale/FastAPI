from typing import List
from fastapi import APIRouter, HTTPException, Depends, Response, status
from sqlalchemy.orm import Session
from .. import schemas, models, databse

router = APIRouter(prefix="/blog", tags=["Blogs"])

get_db = databse.get_db

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_blog(blog: schemas.Blog, db: Session = Depends(get_db)):
    new_blog = models.Blog(title=blog.title, body=blog.body, user_id=1)
    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)

    return new_blog

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[schemas.ShowBlog])
def get_blogs(db: Session = Depends(get_db)):
    blogs = db.query(models.Blog).all()
    
    if not blogs:
        raise HTTPException(status_code=404, detail="Not Found")
    return blogs


@router.get("/{id}", status_code=status.HTTP_200_OK, response_model=schemas.ShowBlog)
def get_blog(id: int, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.id == id).first()
    
    if not blog:
        raise HTTPException(status_code=404, detail="Not Found")
    return blog


@router.delete("/", status_code=204)
def delete_blog(id:int, db: Session = Depends(get_db)):
    deleted_blog = db.query(models.Blog).filter(models.Blog.id == id)
    if not delete_blog.first():
        raise HTTPException(status_code=404, detail="Now found")

    deleted_blog.delete(synchronize_session="evaluate")
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put("/", status_code=202)
def update_blog(id, updated_blog: schemas.Blog, db: Session = Depends(get_db)):
    blog = db.query(models.Blog).filter(models.Blog.id == id)
    
    if not blog.first():
        raise HTTPException(status_code=404, detail="Not found")
    
    blog.update(updated_blog.model_dump())
    db.commit()
    return "updated"
