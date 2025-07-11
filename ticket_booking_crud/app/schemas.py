"""
Pydantic Schemas for Request/Response Models

This file contains all the Pydantic schemas for data validation and serialization:
- Base schemas: Common fields and validation rules
- Create schemas: For validating incoming data (POST requests)
- Update schemas: For validating update data (PUT/PATCH requests)
- Response schemas: For serializing outgoing data (GET responses)
"""

from pydantic import BaseModel, EmailStr, validator, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# Enum for booking status (matches SQLAlchemy enum)
class BookingStatusEnum(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"


# =============================================================================
# VENUE SCHEMAS
# =============================================================================

class VenueBase(BaseModel):
    """Base venue schema with common fields"""
    name: str = Field(..., min_length=1, max_length=100, description="Venue name")
    address: str = Field(..., min_length=1, description="Full address")
    city: str = Field(..., min_length=1, max_length=50, description="City name")
    state: Optional[str] = Field(None, max_length=50, description="State/Province")
    country: str = Field(default="USA", max_length=50, description="Country")
    capacity: int = Field(..., ge=1, description="Maximum capacity")
    facilities: Optional[str] = Field(None, description="Available facilities")
    contact_email: Optional[EmailStr] = Field(None, description="Contact email")
    contact_phone: Optional[str] = Field(None, max_length=20, description="Contact phone")

    @validator('capacity')
    def validate_capacity(cls, v):
        if v <= 0:
            raise ValueError('Capacity must be greater than 0')
        if v > 1000000:
            raise ValueError('Capacity cannot exceed 1,000,000')
        return v

    @validator('name')
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Venue name cannot be empty')
        return v.strip()


class VenueCreate(VenueBase):
    """Schema for creating a new venue"""
    pass


class VenueUpdate(BaseModel):
    """Schema for updating a venue - all fields optional"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    address: Optional[str] = Field(None, min_length=1)
    city: Optional[str] = Field(None, min_length=1, max_length=50)
    state: Optional[str] = Field(None, max_length=50)
    country: Optional[str] = Field(None, max_length=50)
    capacity: Optional[int] = Field(None, ge=1)
    facilities: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = Field(None, max_length=20)


class VenueResponse(VenueBase):
    """Schema for venue responses"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class VenueWithEvents(VenueResponse):
    """Venue response with events included"""
    events: List['EventResponse'] = []


# =============================================================================
# EVENT SCHEMAS
# =============================================================================

class EventBase(BaseModel):
    """Base event schema with common fields"""
    name: str = Field(..., min_length=1, max_length=100, description="Event name")
    description: Optional[str] = Field(None, description="Event description")
    event_date: datetime = Field(..., description="Event date and time")
    duration_minutes: int = Field(default=120, ge=1, description="Duration in minutes")
    venue_id: int = Field(..., ge=1, description="Venue ID")
    max_capacity: int = Field(..., ge=1, description="Maximum tickets available")
    status: str = Field(default="active", description="Event status")

    @validator('event_date')
    def validate_event_date(cls, v):
        if v <= datetime.now():
            raise ValueError('Event date must be in the future')
        return v

    @validator('duration_minutes')
    def validate_duration(cls, v):
        if v < 1:
            raise ValueError('Duration must be at least 1 minute')
        if v > 1440:  # 24 hours
            raise ValueError('Duration cannot exceed 24 hours')
        return v

    @validator('status')
    def validate_status(cls, v):
        allowed_statuses = ['active', 'cancelled', 'completed']
        if v not in allowed_statuses:
            raise ValueError(f'Status must be one of: {allowed_statuses}')
        return v


class EventCreate(EventBase):
    """Schema for creating a new event"""
    pass


class EventUpdate(BaseModel):
    """Schema for updating an event - all fields optional"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    duration_minutes: Optional[int] = Field(None, ge=1)
    max_capacity: Optional[int] = Field(None, ge=1)
    status: Optional[str] = None


class EventResponse(EventBase):
    """Schema for event responses"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class EventWithVenue(EventResponse):
    """Event response with venue details"""
    venue: VenueResponse


class EventWithBookings(EventResponse):
    """Event response with bookings included"""
    bookings: List['BookingResponse'] = []


# =============================================================================
# TICKET TYPE SCHEMAS
# =============================================================================

class TicketTypeBase(BaseModel):
    """Base ticket type schema with common fields"""
    name: str = Field(..., min_length=1, max_length=50, description="Ticket type name")
    description: Optional[str] = Field(None, description="Ticket type description")
    price: float = Field(..., ge=0, description="Ticket price")
    benefits: Optional[str] = Field(None, description="Benefits/perks")
    availability_count: int = Field(default=0, ge=0, description="Available tickets")

    @validator('price')
    def validate_price(cls, v):
        if v < 0:
            raise ValueError('Price cannot be negative')
        if v > 100000:
            raise ValueError('Price cannot exceed $100,000')
        return round(v, 2)  # Round to 2 decimal places

    @validator('name')
    def validate_name(cls, v):
        allowed_names = ['VIP', 'Standard', 'Economy', 'Student', 'Senior', 'Group']
        if v not in allowed_names:
            raise ValueError(f'Ticket type must be one of: {allowed_names}')
        return v


class TicketTypeCreate(TicketTypeBase):
    """Schema for creating a new ticket type"""
    pass


class TicketTypeUpdate(BaseModel):
    """Schema for updating a ticket type - all fields optional"""
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = None
    price: Optional[float] = Field(None, ge=0)
    benefits: Optional[str] = None
    availability_count: Optional[int] = Field(None, ge=0)


class TicketTypeResponse(TicketTypeBase):
    """Schema for ticket type responses"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class TicketTypeWithBookings(TicketTypeResponse):
    """Ticket type response with bookings included"""
    bookings: List['BookingResponse'] = []


# =============================================================================
# BOOKING SCHEMAS
# =============================================================================

class BookingBase(BaseModel):
    """Base booking schema with common fields"""
    event_id: int = Field(..., ge=1, description="Event ID")
    venue_id: int = Field(..., ge=1, description="Venue ID")
    ticket_type_id: int = Field(..., ge=1, description="Ticket type ID")
    customer_name: str = Field(..., min_length=1, max_length=100, description="Customer name")
    customer_email: EmailStr = Field(..., description="Customer email")
    customer_phone: Optional[str] = Field(None, max_length=20, description="Customer phone")
    quantity: int = Field(default=1, ge=1, le=10, description="Number of tickets")

    @validator('customer_name')
    def validate_customer_name(cls, v):
        if not v.strip():
            raise ValueError('Customer name cannot be empty')
        return v.strip()

    @validator('quantity')
    def validate_quantity(cls, v):
        if v < 1:
            raise ValueError('Quantity must be at least 1')
        if v > 10:
            raise ValueError('Maximum 10 tickets per booking')
        return v


class BookingCreate(BookingBase):
    """Schema for creating a new booking"""
    pass


class BookingUpdate(BaseModel):
    """Schema for updating a booking - limited fields"""
    customer_name: Optional[str] = Field(None, min_length=1, max_length=100)
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = Field(None, max_length=20)
    quantity: Optional[int] = Field(None, ge=1, le=10)


class BookingStatusUpdate(BaseModel):
    """Schema for updating booking status"""
    status: BookingStatusEnum = Field(..., description="New booking status")


class BookingResponse(BookingBase):
    """Schema for booking responses"""
    id: int
    total_amount: float
    status: BookingStatusEnum
    confirmation_code: str
    booking_date: datetime
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class BookingWithDetails(BookingResponse):
    """Booking response with related entity details"""
    event: EventResponse
    venue: VenueResponse
    ticket_type: TicketTypeResponse


# =============================================================================
# SEARCH AND FILTER SCHEMAS
# =============================================================================

class BookingSearchFilters(BaseModel):
    """Schema for booking search filters"""
    event: Optional[str] = Field(None, description="Event name filter")
    venue: Optional[str] = Field(None, description="Venue name filter")
    ticket_type: Optional[str] = Field(None, description="Ticket type filter")
    status: Optional[BookingStatusEnum] = Field(None, description="Booking status filter")
    customer_email: Optional[str] = Field(None, description="Customer email filter")
    start_date: Optional[datetime] = Field(None, description="Start date filter")
    end_date: Optional[datetime] = Field(None, description="End date filter")


# =============================================================================
# STATISTICS AND REPORTING SCHEMAS
# =============================================================================

class BookingStats(BaseModel):
    """Schema for booking statistics"""
    total_bookings: int = Field(..., description="Total number of bookings")
    total_revenue: float = Field(..., description="Total revenue")
    pending_bookings: int = Field(..., description="Pending bookings")
    confirmed_bookings: int = Field(..., description="Confirmed bookings")
    cancelled_bookings: int = Field(..., description="Cancelled bookings")


class SystemStats(BaseModel):
    """Schema for system statistics"""
    total_venues: int = Field(..., description="Total number of venues")
    total_events: int = Field(..., description="Total number of events")
    total_ticket_types: int = Field(..., description="Total number of ticket types")
    total_bookings: int = Field(..., description="Total number of bookings")
    total_revenue: float = Field(..., description="Total revenue")
    active_events: int = Field(..., description="Active events")


class RevenueReport(BaseModel):
    """Schema for revenue reports"""
    period: str = Field(..., description="Report period")
    total_revenue: float = Field(..., description="Total revenue")
    booking_count: int = Field(..., description="Number of bookings")
    average_booking_value: float = Field(..., description="Average booking value")
    top_events: List[Dict[str, Any]] = Field(default=[], description="Top performing events")


class OccupancyReport(BaseModel):
    """Schema for occupancy reports"""
    venue_id: int = Field(..., description="Venue ID")
    venue_name: str = Field(..., description="Venue name")
    total_capacity: int = Field(..., description="Total venue capacity")
    booked_capacity: int = Field(..., description="Booked capacity")
    occupancy_rate: float = Field(..., description="Occupancy rate percentage")
    available_capacity: int = Field(..., description="Available capacity")


# =============================================================================
# ERROR RESPONSE SCHEMAS
# =============================================================================

class ErrorResponse(BaseModel):
    """Schema for error responses"""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")
    code: Optional[str] = Field(None, description="Error code")


class ValidationErrorResponse(BaseModel):
    """Schema for validation error responses"""
    error: str = Field(..., description="Error message")
    validation_errors: List[Dict[str, Any]] = Field(..., description="Validation errors")


# Forward references for circular imports
VenueWithEvents.model_rebuild()
EventWithBookings.model_rebuild()
TicketTypeWithBookings.model_rebuild()
BookingWithDetails.model_rebuild() 