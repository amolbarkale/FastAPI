from pydantic import EmailStr
from sqlalchemy import Integer, String, CheckConstraint, Date, Time, Float, Boolean, DateTime, Text, func
from .database import Base
from sqlalchemy.orm import mapped_column, Mapped
from datetime import datetime, time

class Restaurants(Base):
    __table__ = "restaurants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column((String(100)), nullable=False)
    description: Mapped[str] = mapped_column(String(500))
    cuisine_type: Mapped[str] = mapped_column(String(50), index=True, nullable=False) # "Italian", "Chinese", "Indian"
    address: Mapped[str] = mapped_column(Text, nullable=False)
    phone_number: Mapped[str] = mapped_column(String(15), nullable=False)
    email: Mapped[EmailStr] = mapped_column(EmailStr, nullable=False, unique=True)
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