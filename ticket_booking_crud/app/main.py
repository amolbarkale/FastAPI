"""
Main FastAPI Application

This file contains the FastAPI application instance and all route handlers.
It serves as the entry point for the ticket booking system.
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import datetime
import logging

# Import our models, schemas, and database dependencies
from .database import get_db, create_tables
from .models import Venue, Event, TicketType, Booking, BookingStatus
from .schemas import (
    VenueCreate, VenueUpdate, VenueResponse, VenueWithEvents,
    EventCreate, EventUpdate, EventResponse, EventWithVenue,
    TicketTypeCreate, TicketTypeUpdate, TicketTypeResponse,
    BookingCreate, BookingUpdate, BookingResponse, BookingWithDetails,
    BookingStatusUpdate, BookingSearchFilters, SystemStats,
    ErrorResponse
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI application instance
app = FastAPI(
    title="Ticket Booking System API",
    description="A comprehensive ticket booking system with events, venues, and bookings management",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc"  # ReDoc UI
)

# Add CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
@app.on_event("startup")
async def startup_event():
    """Create database tables on application startup"""
    create_tables()
    logger.info("Database tables created successfully")

# Root endpoint
@app.get("/")
async def root():
    """
    Root endpoint - health check and welcome message
    """
    return {
        "message": "Welcome to Ticket Booking System API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "status": "operational"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring
    """
    return {"status": "healthy", "service": "ticket-booking-api"}


# =============================================================================
# VENUES API ENDPOINTS
# =============================================================================

@app.post("/venues", response_model=VenueResponse, status_code=status.HTTP_201_CREATED)
async def create_venue(
    venue: VenueCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new venue
    
    Creates a new venue with the provided information including name, address,
    capacity, and contact details.
    """
    try:
        # Create new venue instance
        db_venue = Venue(**venue.model_dump())
        
        # Add to database
        db.add(db_venue)
        db.commit()
        db.refresh(db_venue)
        
        logger.info(f"Created new venue: {db_venue.name} (ID: {db_venue.id})")
        return db_venue
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating venue: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create venue: {str(e)}"
        )


@app.get("/venues", response_model=List[VenueResponse])
async def get_venues(
    skip: int = 0,
    limit: int = 100,
    city: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all venues
    
    Retrieves a list of all venues with optional filtering by city.
    Supports pagination with skip and limit parameters.
    """
    try:
        query = db.query(Venue)
        
        # Apply city filter if provided
        if city:
            query = query.filter(Venue.city.ilike(f"%{city}%"))
        
        # Apply pagination
        venues = query.offset(skip).limit(limit).all()
        
        logger.info(f"Retrieved {len(venues)} venues")
        return venues
        
    except Exception as e:
        logger.error(f"Error retrieving venues: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve venues: {str(e)}"
        )


@app.get("/venues/{venue_id}", response_model=VenueResponse)
async def get_venue(
    venue_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific venue by ID
    
    Retrieves detailed information about a specific venue.
    """
    try:
        venue = db.query(Venue).filter(Venue.id == venue_id).first()
        
        if not venue:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Venue with ID {venue_id} not found"
            )
        
        logger.info(f"Retrieved venue: {venue.name} (ID: {venue.id})")
        return venue
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving venue {venue_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve venue: {str(e)}"
        )


@app.get("/venues/{venue_id}/events", response_model=List[EventResponse])
async def get_venue_events(
    venue_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all events at a specific venue
    
    Retrieves all events scheduled at the specified venue.
    """
    try:
        # Check if venue exists
        venue = db.query(Venue).filter(Venue.id == venue_id).first()
        if not venue:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Venue with ID {venue_id} not found"
            )
        
        # Get events for this venue
        events = db.query(Event).filter(
            Event.venue_id == venue_id
        ).offset(skip).limit(limit).all()
        
        logger.info(f"Retrieved {len(events)} events for venue {venue_id}")
        return events
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving events for venue {venue_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve events: {str(e)}"
        )


@app.get("/venues/{venue_id}/occupancy")
async def get_venue_occupancy(
    venue_id: int,
    db: Session = Depends(get_db)
):
    """
    Get venue occupancy statistics
    
    Calculates occupancy rates and statistics for the specified venue.
    """
    try:
        # Check if venue exists
        venue = db.query(Venue).filter(Venue.id == venue_id).first()
        if not venue:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Venue with ID {venue_id} not found"
            )
        
        # Calculate occupancy statistics
        total_bookings = db.query(func.sum(Booking.quantity)).filter(
            Booking.venue_id == venue_id,
            Booking.status == BookingStatus.CONFIRMED
        ).scalar() or 0
        
        occupancy_rate = (total_bookings / venue.capacity) * 100 if venue.capacity > 0 else 0
        
        occupancy_stats = {
            "venue_id": venue_id,
            "venue_name": venue.name,
            "total_capacity": venue.capacity,
            "booked_capacity": total_bookings,
            "occupancy_rate": round(occupancy_rate, 2),
            "available_capacity": venue.capacity - total_bookings
        }
        
        logger.info(f"Retrieved occupancy stats for venue {venue_id}")
        return occupancy_stats
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving occupancy for venue {venue_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve occupancy: {str(e)}"
        )


@app.put("/venues/{venue_id}", response_model=VenueResponse)
async def update_venue(
    venue_id: int,
    venue_update: VenueUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a venue
    
    Updates venue information with the provided data.
    """
    try:
        # Get existing venue
        venue = db.query(Venue).filter(Venue.id == venue_id).first()
        if not venue:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Venue with ID {venue_id} not found"
            )
        
        # Update venue fields
        update_data = venue_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(venue, field, value)
        
        # Commit changes
        db.commit()
        db.refresh(venue)
        
        logger.info(f"Updated venue: {venue.name} (ID: {venue.id})")
        return venue
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating venue {venue_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update venue: {str(e)}"
        )


@app.delete("/venues/{venue_id}")
async def delete_venue(
    venue_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a venue
    
    Deletes a venue and all associated events and bookings.
    """
    try:
        # Get existing venue
        venue = db.query(Venue).filter(Venue.id == venue_id).first()
        if not venue:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Venue with ID {venue_id} not found"
            )
        
        # Check if venue has events
        event_count = db.query(Event).filter(Event.venue_id == venue_id).count()
        if event_count > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot delete venue with {event_count} existing events"
            )
        
        # Delete venue
        db.delete(venue)
        db.commit()
        
        logger.info(f"Deleted venue: {venue.name} (ID: {venue.id})")
        return {"message": f"Venue {venue_id} deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting venue {venue_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete venue: {str(e)}"
        )


# =============================================================================
# EVENTS API ENDPOINTS
# =============================================================================

@app.post("/events", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(
    event: EventCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new event
    
    Creates a new event with the provided information including name, venue,
    date/time, and capacity details.
    """
    try:
        # Verify venue exists
        venue = db.query(Venue).filter(Venue.id == event.venue_id).first()
        if not venue:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Venue with ID {event.venue_id} not found"
            )
        
        # Validate max_capacity against venue capacity
        if event.max_capacity > venue.capacity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Event capacity ({event.max_capacity}) cannot exceed venue capacity ({venue.capacity})"
            )
        
        # Create new event instance
        db_event = Event(**event.model_dump())
        
        # Add to database
        db.add(db_event)
        db.commit()
        db.refresh(db_event)
        
        logger.info(f"Created new event: {db_event.name} (ID: {db_event.id})")
        return db_event
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating event: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create event: {str(e)}"
        )


@app.get("/events", response_model=List[EventResponse])
async def get_events(
    skip: int = 0,
    limit: int = 100,
    venue_id: Optional[int] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all events
    
    Retrieves a list of all events with optional filtering by venue and status.
    Supports pagination with skip and limit parameters.
    """
    try:
        query = db.query(Event)
        
        # Apply venue filter if provided
        if venue_id:
            query = query.filter(Event.venue_id == venue_id)
        
        # Apply status filter if provided
        if status_filter:
            query = query.filter(Event.status == status_filter)
        
        # Order by event date
        query = query.order_by(Event.event_date)
        
        # Apply pagination
        events = query.offset(skip).limit(limit).all()
        
        logger.info(f"Retrieved {len(events)} events")
        return events
        
    except Exception as e:
        logger.error(f"Error retrieving events: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve events: {str(e)}"
        )


@app.get("/events/{event_id}", response_model=EventResponse)
async def get_event(
    event_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific event by ID
    
    Retrieves detailed information about a specific event.
    """
    try:
        event = db.query(Event).filter(Event.id == event_id).first()
        
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Event with ID {event_id} not found"
            )
        
        logger.info(f"Retrieved event: {event.name} (ID: {event.id})")
        return event
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving event {event_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve event: {str(e)}"
        )


@app.get("/events/{event_id}/bookings", response_model=List[BookingResponse])
async def get_event_bookings(
    event_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all bookings for a specific event
    
    Retrieves all bookings made for the specified event.
    """
    try:
        # Check if event exists
        event = db.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Event with ID {event_id} not found"
            )
        
        # Get bookings for this event
        bookings = db.query(Booking).filter(
            Booking.event_id == event_id
        ).offset(skip).limit(limit).all()
        
        logger.info(f"Retrieved {len(bookings)} bookings for event {event_id}")
        return bookings
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving bookings for event {event_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve bookings: {str(e)}"
        )


@app.get("/events/{event_id}/available-tickets")
async def get_event_available_tickets(
    event_id: int,
    db: Session = Depends(get_db)
):
    """
    Get available tickets for an event
    
    Calculates and returns the number of available tickets for the specified event.
    """
    try:
        # Check if event exists
        event = db.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Event with ID {event_id} not found"
            )
        
        # Calculate total booked tickets
        total_booked = db.query(func.sum(Booking.quantity)).filter(
            Booking.event_id == event_id,
            Booking.status == BookingStatus.CONFIRMED
        ).scalar() or 0
        
        # Calculate available tickets
        available_tickets = event.max_capacity - total_booked
        
        availability_info = {
            "event_id": event_id,
            "event_name": event.name,
            "max_capacity": event.max_capacity,
            "booked_tickets": total_booked,
            "available_tickets": max(0, available_tickets),
            "is_sold_out": available_tickets <= 0,
            "occupancy_rate": round((total_booked / event.max_capacity) * 100, 2) if event.max_capacity > 0 else 0
        }
        
        logger.info(f"Retrieved ticket availability for event {event_id}")
        return availability_info
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving ticket availability for event {event_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve ticket availability: {str(e)}"
        )


@app.get("/events/{event_id}/revenue")
async def get_event_revenue(
    event_id: int,
    db: Session = Depends(get_db)
):
    """
    Calculate total revenue for a specific event
    
    Calculates and returns revenue statistics for the specified event.
    """
    try:
        # Check if event exists
        event = db.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Event with ID {event_id} not found"
            )
        
        # Calculate revenue statistics
        revenue_data = db.query(
            func.sum(Booking.total_amount).label('total_revenue'),
            func.count(Booking.id).label('total_bookings'),
            func.sum(Booking.quantity).label('total_tickets')
        ).filter(
            Booking.event_id == event_id,
            Booking.status == BookingStatus.CONFIRMED
        ).first()
        
        total_revenue = revenue_data.total_revenue or 0
        total_bookings = revenue_data.total_bookings or 0
        total_tickets = revenue_data.total_tickets or 0
        
        # Calculate average booking value
        avg_booking_value = (total_revenue / total_bookings) if total_bookings > 0 else 0
        avg_ticket_price = (total_revenue / total_tickets) if total_tickets > 0 else 0
        
        revenue_report = {
            "event_id": event_id,
            "event_name": event.name,
            "total_revenue": round(total_revenue, 2),
            "total_bookings": total_bookings,
            "total_tickets_sold": total_tickets,
            "average_booking_value": round(avg_booking_value, 2),
            "average_ticket_price": round(avg_ticket_price, 2),
            "max_potential_revenue": event.max_capacity * avg_ticket_price if avg_ticket_price > 0 else 0
        }
        
        logger.info(f"Retrieved revenue report for event {event_id}")
        return revenue_report
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving revenue for event {event_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve revenue: {str(e)}"
        )


@app.put("/events/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: int,
    event_update: EventUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an event
    
    Updates event information with the provided data.
    """
    try:
        # Get existing event
        event = db.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Event with ID {event_id} not found"
            )
        
        # If max_capacity is being updated, validate against existing bookings
        update_data = event_update.model_dump(exclude_unset=True)
        
        if 'max_capacity' in update_data:
            # Calculate current bookings
            current_bookings = db.query(func.sum(Booking.quantity)).filter(
                Booking.event_id == event_id,
                Booking.status == BookingStatus.CONFIRMED
            ).scalar() or 0
            
            if update_data['max_capacity'] < current_bookings:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Cannot reduce capacity below current bookings ({current_bookings})"
                )
        
        # Update event fields
        for field, value in update_data.items():
            setattr(event, field, value)
        
        # Commit changes
        db.commit()
        db.refresh(event)
        
        logger.info(f"Updated event: {event.name} (ID: {event.id})")
        return event
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating event {event_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update event: {str(e)}"
        )


@app.delete("/events/{event_id}")
async def delete_event(
    event_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete an event
    
    Deletes an event and all associated bookings.
    """
    try:
        # Get existing event
        event = db.query(Event).filter(Event.id == event_id).first()
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Event with ID {event_id} not found"
            )
        
        # Check if event has confirmed bookings
        confirmed_bookings = db.query(Booking).filter(
            Booking.event_id == event_id,
            Booking.status == BookingStatus.CONFIRMED
        ).count()
        
        if confirmed_bookings > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot delete event with {confirmed_bookings} confirmed bookings"
            )
        
        # Delete event (this will cascade to delete associated bookings)
        db.delete(event)
        db.commit()
        
        logger.info(f"Deleted event: {event.name} (ID: {event.id})")
        return {"message": f"Event {event_id} deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting event {event_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete event: {str(e)}"
        ) 