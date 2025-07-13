# auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import models, schemas, utils
from database import get_db

import re

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        return None
    if not utils.verify_password(password, user.hashed_password):
        return None
    return user


@router.post(
    "/register",
    response_model=schemas.UserRead,
    status_code=status.HTTP_201_CREATED
)
def register(
    user_in: schemas.UserCreate,
    db: Session = Depends(get_db),
):
    """
    Register a new user:
      1. Check for existing username/email
      2. Validate password strength
      3. Hash the password
      4. Save user
      5. Return the created user
    """
    # 1️⃣ Prevent duplicates
    exists = (
        db.query(models.User)
        .filter(
            (models.User.username == user_in.username) |
            (models.User.email == user_in.email)
        )
        .first()
    )
    if exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )

    # 2️⃣ Password strength
    pwd = user_in.password
    if len(pwd) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters"
        )
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", pwd):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must include at least one special character"
        )

    # 3️⃣ Hash the password
    hashed = utils.get_password_hash(pwd)

    # 4️⃣ Create & save user
    user = models.User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed,
        role="user"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 5️⃣ Return the new user (password omitted by schema)
    return user

@router.post("/login", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    1. Validate username & password.
    2. If valid, create a JWT containing `sub` (username) and `role`.
    3. Return it as {"access_token": <token>, "token_type": "bearer"}.
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = utils.create_access_token({
        "sub": user.username,
        "role": user.role
    })
    return {"access_token": token, "token_type": "bearer"}