from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from .. import database, models, schemas

router = APIRouter(prefix="/professors", tags=["Professors"])

@router.get("/", response_model=List[schemas.ProfessorResponse])
def get_professors(db: Session = Depends(database.get_db)):
    professors = db.query(models.Professors).all()
    return professors

@router.post("/", response_model=schemas.ProfessorResponse, status_code=status.HTTP_201_CREATED)
def create_professor(professor: schemas.ProfessorCreate, db: Session = Depends(database.get_db)):
    new_professor = models.Professors(**professor.model_dump())
    db.add(new_professor)
    db.commit()
    db.refresh(new_professor)
    return new_professor

@router.get("/{id}", response_model=schemas.ProfessorResponse)
def get_professor(id: int, db: Session = Depends(database.get_db)):
    professor = db.query(models.Professors).filter(models.Professors.id == id).first()
    if not professor:
        raise HTTPException(status_code=404, detail="Professor not found")
    return professor

@router.put("/{id}", response_model=schemas.ProfessorResponse)
def update_professor(id: int, professor: schemas.ProfessorUpdate, db: Session = Depends(database.get_db)):
    db_professor = db.query(models.Professors).filter(models.Professors.id == id).first()
    if not db_professor:
        raise HTTPException(status_code=404, detail="Professor not found")

    for key, value in professor.model_dump().items():
        setattr(db_professor, key, value)

    db.commit()
    db.refresh(db_professor)
    return db_professor

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_professor(id: int, db: Session = Depends(database.get_db)):
    db_professor = db.query(models.Professors).filter(models.Professors.id == id).first()
    if not db_professor:
        raise HTTPException(status_code=404, detail="Professor not found")

    db.delete(db_professor)
    db.commit()