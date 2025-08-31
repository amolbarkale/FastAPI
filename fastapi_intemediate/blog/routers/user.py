from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from .. import schemas, models, databse

router = APIRouter(prefix="/user", tags=["User"])

get_db = databse.get_db

@router.post("/", response_model=schemas.ShowUser)
def create_user(user: schemas.User, db: Session = Depends(get_db)):
    new_user = models.User(name=user.name, email=user.email, password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

@router.get("/{id}", response_model=schemas.ShowUser)
def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Not found")
    
    return user
