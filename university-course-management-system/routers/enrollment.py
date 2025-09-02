# from typing import List
# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session

# from .. import database, models, schemas

# router = APIRouter(prefix="/enrollments", tags=["Enrollments"])

# get_db = database.get_db

# # POST /enrollments # Enroll student in course
# @router.post("/", response_model=schemas.EnrollmentResponse, status_code=status.HTTP_201_CREATED)
# def enroll_student(enrollment: schemas.EnrollmentCreate, db: Session = Depends(get_db)):
#     new_enrollment = models.Enrollments(**enrollment.model_dump())
#     db.add(new_enrollment)
#     db.commit()
#     db.refresh(new_enrollment)
#     return new_enrollment

# @router.get("/", response_model=List[schemas.EnrollmentResponse])
# def get_enrollments(db: Session = Depends(get_db)):
#     enrollments = db.query(models.Enrollments).all()
#     return enrollments

# @router.put("/{student_id}/{course_id}", response_model=schemas.EnrollmentResponse)
# def update_enrollment(student_id: int, course_id: int, enrollment: schemas.EnrollmentUpdate, db: Session = Depends(get_db)):
#     db_enrollment = db.query(models.Enrollments).filter(models.Enrollments.student_id == student_id, models.Enrollments.course_id == course_id).first()
#     if not db_enrollment:
#         raise HTTPException(status_code=404, detail="Enrollment not found")

#     for key, value in enrollment.model_dump().items():
#         setattr(db_enrollment, key, value)

#     db.commit()
#     db.refresh(db_enrollment)
#     return db_enrollment

# @router.delete("/{student_id}/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
# def drop_course(student_id: int, course_id: int, db: Session = Depends(get_db)):
#     db_enrollment = db.query(models.Enrollments).filter(models.Enrollments.student_id == student_id, models.Enrollments.course_id == course_id).first()
#     if not db_enrollment:
#         raise HTTPException(status_code=404, detail="Enrollment not found")

#     db.delete(db_enrollment)
#     db.commit()