from datetime import timedelta
import os
from typing import Annotated, List
from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .auth import authenticate_user, create_access_token, get_current_active_user
from .database import get_db
from .schemas import RestaurantResponse, RestaurantCreate, RestaurantUpdate
from .models import Restaurants, Users
from .schemas import UserBase, Token

router = APIRouter(prefix="/restaurants", tags=["Restaurants"])

ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")


@router.get("/users/me/", response_model=UserBase)
async def read_users_me(
    current_user: Annotated[UserBase, Depends(get_current_active_user)],
):
    return current_user


@router.get("/users/me/items/")
async def read_own_items(
    current_user: Annotated[UserBase, Depends(get_current_active_user)],
):
    return [{"item_id": "Foo", "owner": current_user.username}]

@router.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(Users, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

#____________________________________________________________________________________________________________

@router.get("/", response_model=List[RestaurantResponse])
def get_restaurants(db: Session = Depends(get_db)):
    restaurants = db.query(Restaurants).all()
    return restaurants

@router.get("/{restaurant_id}")
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = db.query(Restaurants).filter(Restaurants.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return restaurant

@router.get("/active/{restaurant_id}")
def get_active_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = db.query(Restaurants).filter(Restaurants.id == restaurant_id).first()
    
    if not restaurant or restaurant.is_active == False:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    return restaurant

@router.get("/search", response_model=List[RestaurantResponse])
def search_restaurants(cuisine: str = None, db: Session = Depends(get_db)):
    query = db.query(Restaurants)
    
    if cuisine:
        query = query.filter(Restaurants.cuisine == cuisine)
    
    restaurants = query.all()
    
    return restaurants

@router.delete("/{restaurant_id}")
def delete_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = db.query(Restaurants).filter(Restaurants.id == restaurant_id).first()
    
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    db.delete(restaurant)
    db.commit()
    
    return {"detail": "Restaurant deleted"}

@router.post("/", status_code=201, response_model=RestaurantResponse)
def add_restaurant(restaurant: RestaurantCreate, db: Session = Depends(get_db)):
    new_restaurant = Restaurants(**restaurant.model_dump())
    db.add(new_restaurant)
    db.commit()
    db.refresh(new_restaurant)
    return new_restaurant

@router.put("/{restaurant_id}")
def update_restaurant(restaurant_id: int, update_restaurant: RestaurantUpdate, db: Session = Depends(get_db)):
    curr_restaurant = db.query(Restaurants).filter(Restaurants.id == restaurant_id).first()
    print('curr_restaurant:', curr_restaurant)

    if not curr_restaurant:
        raise HTTPException(status_code=404, detail="Not found to update")

    for key, value in update_restaurant.model_dump().items():
        if value is not None:
            setattr(curr_restaurant, key, value)
    
    db.commit()
    db.refresh(curr_restaurant)

    return curr_restaurant


