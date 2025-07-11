"""
Test script to run our FastAPI application
"""
import os
import uvicorn

# Set environment variables for testing
os.environ["DATABASE_URL"] = "sqlite:///./ticket_booking.db"
os.environ["SECRET_KEY"] = "development-secret-key"

# Import and run the app
from app.main import app

if __name__ == "__main__":
    print("🚀 Starting FastAPI Ticket Booking System...")
    print("📝 Documentation available at: http://127.0.0.1:8000/docs")
    print("🔄 ReDoc available at: http://127.0.0.1:8000/redoc")
    print("❌ Press Ctrl+C to stop")
    
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,  # Auto-reload on code changes
        log_level="info"
    ) 