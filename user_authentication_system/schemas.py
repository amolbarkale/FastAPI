from pydantic import BaseModel, EmailStr, validator
from typing import Optional
import re

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    @validator('username')
    def username_alphanumeric(cls, v):
        v = v.strip()
        if not v.isalnum():
            raise ValueError('username must be alphanumeric')
        return v

    @validator('password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError('Password must include a special character')
        return v

class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenRefresh(BaseModel):
    refresh_token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None