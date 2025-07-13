from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError
from datetime import timedelta
from typing import List

import models, schemas, utils
from database import get_db
from rate_limiter import limiter

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not utils.verify_password(password, user.hashed_password):
        return None
    return user


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    # Check revocation
    if utils.is_token_revoked(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked"
        )
    try:
        payload = utils.decode_access_token(token)
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if not username or not role:
            raise JWTError()
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


def get_current_admin(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user

# Registration
@router.post("/register", response_model=schemas.UserRead, status_code=201)
@limiter.limit("3/minute")
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    # Prevent duplicates
    if db.query(models.User).filter(
        (models.User.username == user_in.username) |
        (models.User.email == user_in.email)
    ).first():
        raise HTTPException(400, "Username or email already registered")
    hashed = utils.get_password_hash(user_in.password)
    user = models.User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed,
        role="user"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# Login
@router.post("/login", response_model=schemas.Token)
@limiter.limit("5/minute")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = utils.create_access_token(
        {"sub": user.username, "role": user.role}
    )
    refresh_token = utils.create_refresh_token(
        {"sub": user.username, "role": user.role}
    )
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

# Refresh Token
@router.post("/refresh", response_model=schemas.Token)
@limiter.limit("5/minute")
def refresh_token(
    data: schemas.TokenRefresh,
    db: Session = Depends(get_db),
):
    try:
        payload = utils.decode_access_token(data.refresh_token)
    except JWTError:
        raise HTTPException(401, "Invalid refresh token")
    if utils.is_token_revoked(data.refresh_token):
        raise HTTPException(401, "Refresh token revoked")
    username = payload.get("sub")
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(404, "User not found")
    # Invalidate the old refresh token
    utils.revoke_token(data.refresh_token)
    new_access = utils.create_access_token({"sub": user.username, "role": user.role})
    new_refresh = utils.create_refresh_token({"sub": user.username, "role": user.role})
    return {"access_token": new_access, "refresh_token": new_refresh, "token_type": "bearer"}

# Logout
@router.post("/logout")
@limiter.limit("5/minute")
def logout(token: str = Depends(oauth2_scheme)):
    utils.revoke_token(token)
    return {"msg": "Successfully logged out"}

# Forgot Password
@router.post("/forgot-password", status_code=200)
@limiter.limit("1/minute")
def forgot_password(request: schemas.ForgotPasswordRequest):
    reset_token = utils.create_access_token(
        {"sub": request.email}, expires_delta=timedelta(minutes=15)
    )
    # TODO: send `reset_token` via email
    return {"msg": "Password reset email sent", "reset_token": reset_token}