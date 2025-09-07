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

class MenuItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price: float = Field(..., gt=0)
    category: str = Field(..., max_length=50)  # "Appetizer", "Main Course", "Dessert", "Beverage"
    is_vegetarian: Optional[bool] = False
    is_vegan: Optional[bool] = False
    is_available: Optional[bool] = True
    preparation_time: int = Field(..., gt=0)  # in minutes
    restaurant_id: int

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
# ____________________________________________________________________

class MenuItemResponse(MenuItemBase):
    class Config:
        from_attributes = True

class MenuItemWithRestaurantResponse(MenuItemResponse):
    restaurant: RestaurantResponse
    
    class Config:
        from_attributes = True

class RestaurantWithMenuResponse(RestaurantResponse):
    menu_items: list[MenuItemResponse] = []
    
    class Config:
        from_attributes = True

class MenuItemsForRestaurantResponse(BaseModel):
    menu_items: list[MenuItemResponse] = []
    
    class Config:
        from_attributes = True

class MenuItemCreate(MenuItemBase):
    pass

class MenuItemUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    price: Optional[float] = Field(default=None, gt=0)
    category: Optional[str] = Field(default=None, max_length=50)
    is_vegetarian: Optional[bool] = Field(default=None)
    is_vegan: Optional[bool] = Field(default=None)
    is_available: Optional[bool] = Field(default=None)
    preparation_time: Optional[int] = Field(default=None, gt=0)
    restaurant_id: Optional[int] = Field(default=None)
    
    class Config:
        from_attributes = True