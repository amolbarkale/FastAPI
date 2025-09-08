from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import os

import auth
from schemas import restaurants, user
from models import MenuItems, Users, Restaurants
from database import get_db

router = APIRouter(prefix="/menu-items", tags=["Menu Items"])

ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)

MenuItemBase = restaurants.MenuItemBase
UserBase = user.UserBase

@router.post("/restaurants/{restaurant_id}/menu-items/", response_model=MenuItemBase)
def add_menu_item(restaurant_id: int, item: MenuItemBase, db: Session = Depends(get_db), current_user: UserBase = Depends(auth.get_current_user)):
    restaurant = db.query(Restaurants).filter(Restaurants.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    new_item = MenuItems(
        name=item.name,
        description=item.description,
        price=item.price,
        category=item.category,
        is_vegetarian=item.is_vegetarian,
        is_vegan=item.is_vegan,
        is_available=item.is_available,
        preparation_time=item.preparation_time,
        restaurant_id=restaurant_id
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/{item_id}", response_model=MenuItemBase)
def update_menu_item(item_id: int, item: MenuItemBase, db: Session = Depends(get_db), current_user: UserBase = Depends(auth.get_current_user)):
    menu_item = db.query(MenuItems).filter(MenuItems.id == item_id).first()
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    for key, value in item.model_dump().items():
        setattr(menu_item, key, value)

    menu_item.restaurant_id = item.restaurant_id
    
    db.commit()
    db.refresh(menu_item)
    return menu_item

@router.delete("/{item_id}")
def delete_menu_item(item_id: int, db: Session = Depends(get_db), current_user: UserBase = Depends(auth.get_current_user)):
    menu_item = db.query(MenuItems).filter(MenuItems.id == item_id).first()
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    db.delete(menu_item)
    db.commit()
    
    return {"detail": "Menu item deleted"}

@router.get("/restaurants/{restaurant_id}/menu-items/", response_model=List[MenuItemBase])
def get_menu_items_for_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = db.query(Restaurants).filter(Restaurants.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    menu_items = db.query(MenuItems).filter(MenuItems.restaurant_id == restaurant_id).all()
    return menu_items

@router.get("/{item_id}", response_model=MenuItemBase)
def get_menu_item(item_id: int, db: Session = Depends(get_db)):
    menu_item = db.query(MenuItems).filter(MenuItems.id == item_id).first()
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return menu_item

@router.get("/", response_model=List[MenuItemBase])
def get_all_menu_items(db: Session = Depends(get_db)):
    menu_items = db.query(MenuItems).all()
    return menu_items

# Note: Authentication is required for adding, updating, and deleting menu items.