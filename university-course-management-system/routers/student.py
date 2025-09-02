from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from .. import database, models, schemas

router = APIRouter(prefix="/students", tags=["Students"])

get_db = database.get_db

@router.get("/", response_model=List[schemas.StudentResponse])
def get_students(db: Session = Depends(get_db)):
    students = db.query(models.Students).all()

    return students

@router.get("/{id}", response_model=schemas.StudentResponse)
def get_student(id: int, db: Session = Depends(get_db)):
    student = db.query(models.Students).filter(models.Students.id == id).first()

    if not student:
        HTTPException(status_code=404, detail="Student not found")
    
    return student

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.StudentCreate)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    new_student = models.Students(name=student.name, email=student.email, major=student.major, year=student.year, gpa=student.gpa)
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return new_student

@router.put("/{id}", status_code=202, response_model = schemas.StudentUpdate)
def update_student(id:int, updated_student: schemas.StudentUpdate, db: Session = Depends(get_db)):
    student = db.query(models.Students).filter(models.Students.id == id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    if updated_student.gpa is not None and (updated_student.gpa < 0.0 or updated_student.gpa > 4.0):
        raise HTTPException(status_code=400, detail="GPA must be between 0.0 and 4.0")
    
    update_data = updated_student.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(student, key, value)

    db.commit()
    db.refresh(student)
    return student

@router.delete("/{id}")
def delete_student(id: int, db: Session = Depends(get_db)):
    deleted_Student = db.query(models.Students).filter(models.Students.id == id)
    if not deleted_Student.delete():
        raise HTTPException(status_code=404, detail="student not found")
    deleted_Student.delete(synchronize_session="evaluate")
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/{student_id}/courses", response_model=List[schemas.StudentWithCoursesResponse])
def get_student_courses(student_id: int, db: Session = Depends(get_db)):
    courses = (
        db.query(models.Courses)
        .join(models.Enrollments, models.Courses.id == models.Enrollments.course_id)
        .filter(models.Enrollments.student_id == student_id)
        .all()
    )

    if not courses:
        raise HTTPException(status_code=404, detail="No courses found")

    return courses