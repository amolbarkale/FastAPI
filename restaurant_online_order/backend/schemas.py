from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, time

class RestaurantBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    cuisine_type: str = Field(..., max_length=50)  # "Italian", "Chinese", "Indian"
    address: str
    phone_number: str = Field(..., max_length=15)
    email: EmailStr
    rating: Optional[float] = Field(0.0, ge=0.0, le=5.0)  # 0.0-5.0
    is_active: Optional[bool] = True
    opening_time: time  # "09:00"
    closing_time: time  # "21:00"

class RestaurantResponse(RestaurantBase):
    class Config:
        from_attributes = True

class RestaurantCreate(RestaurantBase):
    pass

class RestaurantUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=3, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    cuisine_type: Optional[str] = Field(default=None, max_length=50)
    address: Optional[str] = Field(default=None)
    phone_number: Optional[str] = Field(default=None, max_length=15)
    email: Optional[EmailStr] = Field(default=None)
    rating: Optional[float] = Field(default=None, ge=0.0, le=5.0)
    is_active: Optional[bool] = Field(default=None)
    opening_time: Optional[time] = Field(default=None)
    closing_time: Optional[time] = Field(default=None)

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class UserBase(BaseModel):
    username: str
    email: str | None = None
    disabled: bool | None = None
    password: str

