"""
SQLAlchemy Database Models

This file contains all the database models for the ticket booking system:
- Venue: Event locations with capacity management
- Event: Scheduled events with date/time and venue relationships
- TicketType: Different ticket categories (VIP, Standard, Economy) with pricing
- Booking: Customer bookings linking events, venues, and ticket types
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum
from .database import Base


class BookingStatus(enum.Enum):
    """Enumeration for booking status"""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"


class Venue(Base):
    """
    Venue Model - Represents event locations
    
    Attributes:
        id: Primary key
        name: Venue name (e.g., "Madison Square Garden")
        address: Full address of the venue
        city: City where venue is located
        state: State/Province
        country: Country
        capacity: Maximum number of people venue can hold
        facilities: JSON string of available facilities
        contact_email: Venue contact email
        contact_phone: Venue contact phone
        created_at: Timestamp when venue was created
        updated_at: Timestamp when venue was last updated
        
    Relationships:
        events: One-to-many relationship with Event model
    """
    __tablename__ = "venues"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    address = Column(Text, nullable=False)
    city = Column(String(50), nullable=False, index=True)
    state = Column(String(50), nullable=True)
    country = Column(String(50), nullable=False, default="USA")
    capacity = Column(Integer, nullable=False)
    facilities = Column(Text, nullable=True)  # JSON string of facilities
    contact_email = Column(String(100), nullable=True)
    contact_phone = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    events = relationship("Event", back_populates="venue", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Venue(id={self.id}, name='{self.name}', capacity={self.capacity})>"


class Event(Base):
    """
    Event Model - Represents scheduled events
    
    Attributes:
        id: Primary key
        name: Event name (e.g., "Rock Concert 2024")
        description: Event description
        event_date: Date and time of the event
        duration_minutes: Duration of event in minutes
        venue_id: Foreign key to Venue
        max_capacity: Maximum tickets available (may be less than venue capacity)
        status: Event status (active, cancelled, completed)
        created_at: Timestamp when event was created
        updated_at: Timestamp when event was last updated
        
    Relationships:
        venue: Many-to-one relationship with Venue model
        bookings: One-to-many relationship with Booking model
    """
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    event_date = Column(DateTime, nullable=False, index=True)
    duration_minutes = Column(Integer, nullable=False, default=120)
    venue_id = Column(Integer, ForeignKey("venues.id"), nullable=False)
    max_capacity = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    venue = relationship("Venue", back_populates="events")
    bookings = relationship("Booking", back_populates="event", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Event(id={self.id}, name='{self.name}', date='{self.event_date}')>"


class TicketType(Base):
    """
    TicketType Model - Represents different ticket categories
    
    Attributes:
        id: Primary key
        name: Ticket type name (VIP, Standard, Economy)
        description: Description of what's included
        price: Base price for this ticket type
        benefits: JSON string of benefits/perks
        availability_count: Number of tickets available of this type
        created_at: Timestamp when ticket type was created
        updated_at: Timestamp when ticket type was last updated
        
    Relationships:
        bookings: One-to-many relationship with Booking model
    """
    __tablename__ = "ticket_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    benefits = Column(Text, nullable=True)  # JSON string of benefits
    availability_count = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    bookings = relationship("Booking", back_populates="ticket_type")
    
    def __repr__(self):
        return f"<TicketType(id={self.id}, name='{self.name}', price=${self.price})>"


class Booking(Base):
    """
    Booking Model - Represents customer bookings
    
    This is the central model that links events, venues, and ticket types together.
    
    Attributes:
        id: Primary key
        event_id: Foreign key to Event
        venue_id: Foreign key to Venue (denormalized for easier queries)
        ticket_type_id: Foreign key to TicketType
        customer_name: Customer's full name
        customer_email: Customer's email address
        customer_phone: Customer's phone number
        quantity: Number of tickets booked
        total_amount: Total cost (price * quantity)
        status: Booking status (pending, confirmed, cancelled)
        confirmation_code: Unique booking confirmation code
        booking_date: When the booking was made
        created_at: Timestamp when booking was created
        updated_at: Timestamp when booking was last updated
        
    Relationships:
        event: Many-to-one relationship with Event model
        venue: Many-to-one relationship with Venue model
        ticket_type: Many-to-one relationship with TicketType model
    """
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    venue_id = Column(Integer, ForeignKey("venues.id"), nullable=False)  # Denormalized
    ticket_type_id = Column(Integer, ForeignKey("ticket_types.id"), nullable=False)
    customer_name = Column(String(100), nullable=False)
    customer_email = Column(String(100), nullable=False, index=True)
    customer_phone = Column(String(20), nullable=True)
    quantity = Column(Integer, nullable=False, default=1)
    total_amount = Column(Float, nullable=False)
    status = Column(Enum(BookingStatus), nullable=False, default=BookingStatus.PENDING)
    confirmation_code = Column(String(20), nullable=False, unique=True, index=True)
    booking_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    event = relationship("Event", back_populates="bookings")
    venue = relationship("Venue")  # No back_populates since it's denormalized
    ticket_type = relationship("TicketType", back_populates="bookings")
    
    def __repr__(self):
        return f"<Booking(id={self.id}, code='{self.confirmation_code}', status='{self.status.value}')>" 