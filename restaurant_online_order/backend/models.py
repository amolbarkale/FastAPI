from typing import List
from sqlalchemy import ForeignKey, Integer, String, CheckConstraint, Time, Float, Boolean, DateTime, Text, func
from sqlalchemy.orm import mapped_column, Mapped, relationship
from datetime import datetime, time
from passlib.context import CryptContext

from database import Base

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Users(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)

    orders: Mapped[List["Orders"]] = relationship(back_populates="customer", cascade="all, delete-orphan")
    reviews: Mapped[List["Reviews"]] = relationship(back_populates="customer", cascade="all, delete-orphan")

class Orders(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    customer_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    restaurant_id: Mapped[int] = mapped_column(Integer, ForeignKey("restaurants.id"), nullable=False)
    order_status: Mapped[str] = mapped_column(String(50), nullable=False)
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)
    delivery_address: Mapped[str] = mapped_column(String(200), nullable=False)
    special_instructions: Mapped[str] = mapped_column(String(500))
    order_date: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    delivery_time: Mapped[datetime] = mapped_column(DateTime)

    customer: Mapped["Users"] = relationship(back_populates="orders")
    order_items: Mapped[List["OrderItems"]] = relationship(back_populates="order", cascade="all, delete-orphan")
    restaurant: Mapped["Restaurants"] = relationship(back_populates="orders")

class Restaurants(Base):
    __tablename__ = "restaurants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column((String(100)), nullable=False)
    description: Mapped[str] = mapped_column(String(500))
    cuisine_type: Mapped[str] = mapped_column(String(50), index=True, nullable=False) # "Italian", "Chinese", "Indian"
    address: Mapped[str] = mapped_column(Text, nullable=False)
    phone_number: Mapped[str] = mapped_column(String(15), nullable=False)
    email: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)
    rating: Mapped[float] = mapped_column(Float, default=0.0)  # 0.0-5.0
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    opening_time: Mapped[time] = mapped_column(Time)  # "09:00"
    closing_time: Mapped[time] = mapped_column(Time)  # "21:00"
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())  # Timestamp
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())  # Timestamp

    __table_args__ = (
        CheckConstraint('LENGTH(name) BETWEEN 3 AND 100', name='name_length_check'),
        CheckConstraint('rating >= 0.0 AND rating <= 5.0', name='rating_range_check'),
        CheckConstraint('LENGTH(phone_number) >= 10', name='phone_number_validation'),
    )

    menu_items: Mapped[List["MenuItems"]] = relationship(back_populates="restaurant", cascade="all, delete-orphan")
    orders: Mapped[List["Orders"]] = relationship(back_populates="restaurant")
    reviews: Mapped[List["Reviews"]] = relationship(back_populates="restaurant", cascade="all, delete-orphan")

class MenuItems(Base):
    __tablename__ = "menu_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column((String(100)), nullable=False)
    description: Mapped[str] = mapped_column(String(500))
    price: Mapped[float] = mapped_column(Float, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False) # "Appetizer", "Main Course", "Dessert", "Beverage"
    is_vegetarian: Mapped[bool] = mapped_column(Boolean, default=False)
    is_vegan: Mapped[bool] = mapped_column(Boolean, default=False)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)
    preparation_time: Mapped[int] = mapped_column(Integer, nullable=False)
    restaurant_id: Mapped[int] = mapped_column(Integer, ForeignKey("restaurants.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())  # Timestamp

    restaurant: Mapped["Restaurants"] = relationship(back_populates="menu_items")
    order_items: Mapped[List["OrderItems"]] = relationship(back_populates="menu_item", cascade="all, delete-orphan")

class OrderItems(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey("orders.id"), nullable=False)
    menu_item_id: Mapped[int] = mapped_column(Integer, ForeignKey("menu_items.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    item_price: Mapped[float] = mapped_column(Float, nullable=False)
    special_requests: Mapped[str] = mapped_column(String(500))

    order: Mapped["Orders"] = relationship(back_populates="order_items")
    menu_item: Mapped["MenuItems"] = relationship(back_populates="order_items")
    
class Reviews(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    customer_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    restaurant_id: Mapped[int] = mapped_column(Integer, ForeignKey("restaurants.id"), nullable=False)
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey("orders.id"), nullable=False)
    rating: Mapped[float] = mapped_column(Float, nullable=False)
    comment: Mapped[str] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, server_default=func.now())

    customer: Mapped["Users"] = relationship(back_populates="reviews")
    restaurant: Mapped["Restaurants"] = relationship(back_populates="reviews")