from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from .. import database, models, schemas

router = APIRouter(prefix="/courses", tags=["Courses"])

get_db = database.get_db

@router.get("/", response_model=List[schemas.CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    courses = db.query(models.Courses).all()
    return courses

@router.get("/{id}")
def get_course(id: int, db: Session = Depends(get_db)):
    course = db.query(models.Courses).filter(models.Courses.id == id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.CourseResponse)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    new_course = models.Courses(**course.model_dump())
    db.add(new_course)
    db.commit()
    db.refresh(new_course)
    return new_course

@router.get("/{id}/students", response_model=schemas.CourseRosterResponse)
def get_course_roster(id: int, db: Session = Depends(get_db)):
    course = db.query(models.Courses).filter(models.Courses.id == id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    students = db.query(models.Students).filter(models.Students.courses.any(id=id)).all()
    return {"course": course, "students": students}

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(id: int, db: Session = Depends(get_db)):
    course = db.query(models.Courses).filter(models.Courses.id == id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    db.delete(course)
    db.commit()

@router.put("/{id}", response_model=schemas.CourseResponse)
def update_course(id: int, course: schemas.CourseUpdate, db: Session = Depends(get_db)):
    db_course = db.query(models.Courses).filter(models.Courses.id == id).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")

    for key, value in course.model_dump().items():
        setattr(db_course, key, value)

    db.commit()
    db.refresh(db_course)
    return db_course