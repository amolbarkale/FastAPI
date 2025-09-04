from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class RestaurantBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    cuisine_type: str = Field(..., max_length=50)  # "Italian", "Chinese", "Indian"
    address: str
    phone_number: str = Field(..., max_length=15)
    email: EmailStr
    rating: Optional[float] = Field(0.0, ge=0.0, le=5.0)  # 0.0-5.0
    is_active: Optional[bool] = True
    opening_time: str  # "09:00"
    closing_time: str  # "21:00"

class RestaurantResponse(RestaurantBase):
    class Config:
        from_attributes = True

class RestaurantCreate(RestaurantBase):
    pass

class RestaurantUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    cuisine_type: Optional[str] = Field(None, max_length=50)
    address: Optional[str]
    phone_number: Optional[str] = Field(None, max_length=15)
    email: Optional[EmailStr]
    rating: Optional[float] = Field(None, ge=0.0, le=5.0)
    is_active: Optional[bool]
    opening_time: Optional[str]
    closing_time: Optional[str]