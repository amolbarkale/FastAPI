"""
Script to create database tables and test our models
"""
import os
from datetime import datetime, timedelta
from app.database import engine, SessionLocal, create_tables
from app.models import Venue, Event, TicketType, Booking, BookingStatus

# Set environment variables
os.environ["DATABASE_URL"] = "sqlite:///./ticket_booking.db"

def test_models():
    """Test our database models with sample data"""
    print("🏗️ Creating database tables...")
    
    # Create all tables
    create_tables()
    
    print("✅ Tables created successfully!")
    print("\n📊 Testing models with sample data...")
    
    # Create a database session
    db = SessionLocal()
    
    try:
        # Test 1: Create a Venue
        print("\n1️⃣ Creating a sample venue...")
        venue = Venue(
            name="Madison Square Garden",
            address="4 Pennsylvania Plaza",
            city="New York",
            state="NY",
            country="USA",
            capacity=20000,
            facilities="Parking, Concessions, Premium Seating",
            contact_email="info@msg.com",
            contact_phone="(212) 465-6741"
        )
        db.add(venue)
        db.commit()
        print(f"✅ Created venue: {venue}")
        
        # Test 2: Create Ticket Types
        print("\n2️⃣ Creating ticket types...")
        ticket_types = [
            TicketType(
                name="VIP",
                description="Premium seating with meet & greet",
                price=299.99,
                benefits="Meet & greet, premium seats, backstage access",
                availability_count=100
            ),
            TicketType(
                name="Standard",
                description="Regular seating",
                price=99.99,
                benefits="Standard seating, access to event",
                availability_count=1000
            ),
            TicketType(
                name="Economy",
                description="Budget-friendly seating",
                price=49.99,
                benefits="Economy seating, access to event",
                availability_count=500
            )
        ]
        
        for ticket_type in ticket_types:
            db.add(ticket_type)
        db.commit()
        print(f"✅ Created {len(ticket_types)} ticket types")
        
        # Test 3: Create an Event
        print("\n3️⃣ Creating a sample event...")
        event = Event(
            name="Rock Concert 2024",
            description="Amazing rock concert with live band",
            event_date=datetime.now() + timedelta(days=30),
            duration_minutes=180,
            venue_id=venue.id,
            max_capacity=15000,
            status="active"
        )
        db.add(event)
        db.commit()
        print(f"✅ Created event: {event}")
        
        # Test 4: Create a Booking
        print("\n4️⃣ Creating a sample booking...")
        booking = Booking(
            event_id=event.id,
            venue_id=venue.id,
            ticket_type_id=ticket_types[0].id,  # VIP ticket
            customer_name="John Doe",
            customer_email="john.doe@email.com",
            customer_phone="555-1234",
            quantity=2,
            total_amount=599.98,  # 2 * 299.99
            status=BookingStatus.CONFIRMED,
            confirmation_code="BOOK123456",
            booking_date=datetime.now()
        )
        db.add(booking)
        db.commit()
        print(f"✅ Created booking: {booking}")
        
        # Test 5: Test Relationships
        print("\n5️⃣ Testing relationships...")
        
        # Get venue with events
        venue_with_events = db.query(Venue).filter(Venue.id == venue.id).first()
        print(f"📍 Venue '{venue_with_events.name}' has {len(venue_with_events.events)} events")
        
        # Get event with bookings
        event_with_bookings = db.query(Event).filter(Event.id == event.id).first()
        print(f"🎫 Event '{event_with_bookings.name}' has {len(event_with_bookings.bookings)} bookings")
        
        # Get booking with related data
        booking_with_relations = db.query(Booking).filter(Booking.id == booking.id).first()
        print(f"📝 Booking '{booking_with_relations.confirmation_code}' is for:")
        print(f"   - Event: {booking_with_relations.event.name}")
        print(f"   - Venue: {booking_with_relations.venue.name}")
        print(f"   - Ticket Type: {booking_with_relations.ticket_type.name}")
        
        # Test 6: Query Examples
        print("\n6️⃣ Testing complex queries...")
        
        # Get all bookings for a specific event
        event_bookings = db.query(Booking).filter(Booking.event_id == event.id).all()
        print(f"📊 Event has {len(event_bookings)} bookings")
        
        # Get total revenue for an event
        from sqlalchemy import func
        total_revenue = db.query(Booking).filter(Booking.event_id == event.id).with_entities(
            func.sum(Booking.total_amount)
        ).scalar()
        print(f"💰 Total revenue for event: ${total_revenue or 0}")
        
        # Get bookings by ticket type
        vip_bookings = db.query(Booking).filter(Booking.ticket_type_id == ticket_types[0].id).all()
        print(f"👑 VIP bookings: {len(vip_bookings)}")
        
        print("\n🎉 All tests passed! Database models are working correctly!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    test_models() 