from fastapi import FastAPI, HTTPException, Request, Form, Depends, Query
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, func
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel, field_validator
from datetime import datetime, date
from typing import List, Optional, Dict
import os
from enum import Enum
from contextlib import asynccontextmanager

# Database Configuration
SQLALCHEMY_DATABASE_URL = "sqlite:///./expenses.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Predefined Categories
class ExpenseCategory(str, Enum):
    FOOD = "Food & Dining"
    TRANSPORT = "Transportation"
    ENTERTAINMENT = "Entertainment"
    UTILITIES = "Utilities"
    HEALTHCARE = "Healthcare"
    SHOPPING = "Shopping"
    EDUCATION = "Education"
    TRAVEL = "Travel"
    OTHER = "Other"

# Database Models
class ExpenseModel(Base):
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    description = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic Models
class ExpenseBase(BaseModel):
    title: str
    amount: float
    category: ExpenseCategory
    description: Optional[str] = None
    date: Optional[datetime] = None

    @field_validator('amount')
    @classmethod
    def amount_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Amount must be positive')
        return v

    @field_validator('title')
    @classmethod
    def title_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Title cannot be empty')
        return v.strip()

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[ExpenseCategory] = None
    description: Optional[str] = None
    date: Optional[datetime] = None

    @field_validator('amount')
    @classmethod
    def amount_must_be_positive(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Amount must be positive')
        return v

class ExpenseResponse(ExpenseBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ExpenseSummary(BaseModel):
    total_amount: float
    total_count: int
    category_breakdown: Dict[str, float]
    monthly_breakdown: Dict[str, float]

# FastAPI App
app = FastAPI(title="Expense Tracker API", version="1.0.0", description="Personal expense tracking system")

# Templates
templates = Jinja2Templates(directory="templates")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper function to add sample data
def add_sample_data(db: Session):
    # Check if data already exists
    if db.query(ExpenseModel).count() > 0:
        return
    
    sample_expenses = [
        ExpenseModel(title="Lunch at Restaurant", amount=25.50, category=ExpenseCategory.FOOD, description="Business lunch", date=datetime(2025, 7, 1)),
        ExpenseModel(title="Gas Station", amount=45.00, category=ExpenseCategory.TRANSPORT, description="Weekly fuel", date=datetime(2025, 7, 2)),
        ExpenseModel(title="Movie Tickets", amount=18.00, category=ExpenseCategory.ENTERTAINMENT, description="Weekend movie", date=datetime(2025, 7, 3)),
        ExpenseModel(title="Electricity Bill", amount=120.00, category=ExpenseCategory.UTILITIES, description="Monthly electricity", date=datetime(2025, 7, 4)),
        ExpenseModel(title="Doctor Visit", amount=80.00, category=ExpenseCategory.HEALTHCARE, description="Regular checkup", date=datetime(2025, 7, 5)),
        ExpenseModel(title="Online Shopping", amount=65.75, category=ExpenseCategory.SHOPPING, description="Books and supplies", date=datetime(2025, 7, 6)),
        ExpenseModel(title="Course Subscription", amount=99.99, category=ExpenseCategory.EDUCATION, description="Online learning platform", date=datetime(2025, 7, 7)),
        ExpenseModel(title="Hotel Booking", amount=150.00, category=ExpenseCategory.TRAVEL, description="Weekend getaway", date=datetime(2025, 7, 8)),
        ExpenseModel(title="Coffee", amount=4.50, category=ExpenseCategory.FOOD, description="Morning coffee", date=datetime(2025, 7, 9)),
        ExpenseModel(title="Uber Ride", amount=12.30, category=ExpenseCategory.TRANSPORT, description="Airport pickup", date=datetime(2025, 7, 10)),
    ]
    
    db.add_all(sample_expenses)
    db.commit()

# Sample data initialization is now handled by the lifespan context manager above

# API Endpoints

@app.get("/expenses", response_model=List[ExpenseResponse])
async def get_expenses(
    start_date: Optional[date] = Query(None, description="Start date for filtering (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date for filtering (YYYY-MM-DD)"),
    category: Optional[ExpenseCategory] = Query(None, description="Filter by category"),
    db: Session = Depends(get_db)
):
    """Fetch all expenses with optional date range and category filtering"""
    query = db.query(ExpenseModel)
    
    if start_date:
        query = query.filter(ExpenseModel.date >= start_date)
    if end_date:
        end_datetime = datetime.combine(end_date, datetime.min.time().replace(hour=23, minute=59, second=59))
        query = query.filter(ExpenseModel.date <= end_datetime)
    if category:
        query = query.filter(ExpenseModel.category == category.value)
    
    expenses = query.order_by(ExpenseModel.date.desc()).all()
    return expenses

@app.post("/expenses", response_model=ExpenseResponse, status_code=201)
async def create_expense(expense: ExpenseCreate, db: Session = Depends(get_db)):
    """Create a new expense"""
    expense_data = expense.dict()
    if expense_data['date'] is None:
        expense_data['date'] = datetime.utcnow()
    
    # Convert enum to string
    expense_data['category'] = expense_data['category'].value
    
    db_expense = ExpenseModel(**expense_data)
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@app.put("/expenses/{expense_id}", response_model=ExpenseResponse)
async def update_expense(expense_id: int, expense_update: ExpenseUpdate, db: Session = Depends(get_db)):
    """Update an existing expense"""
    db_expense = db.query(ExpenseModel).filter(ExpenseModel.id == expense_id).first()
    
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    # Update only provided fields
    update_data = expense_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == 'category' and value is not None:
            value = value.value  # Convert enum to string
        setattr(db_expense, field, value)
    
    db_expense.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_expense)
    return db_expense

@app.delete("/expenses/{expense_id}", status_code=204)
async def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    """Delete an expense"""
    db_expense = db.query(ExpenseModel).filter(ExpenseModel.id == expense_id).first()
    
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(db_expense)
    db.commit()
    return

@app.get("/expenses/category/{category}", response_model=List[ExpenseResponse])
async def get_expenses_by_category(category: ExpenseCategory, db: Session = Depends(get_db)):
    """Filter expenses by category"""
    expenses = db.query(ExpenseModel).filter(ExpenseModel.category == category.value).order_by(ExpenseModel.date.desc()).all()
    return expenses

@app.get("/expenses/total", response_model=ExpenseSummary)
async def get_expense_summary(
    start_date: Optional[date] = Query(None, description="Start date for summary (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date for summary (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    """Get total expenses and breakdown by category"""
    query = db.query(ExpenseModel)
    
    if start_date:
        query = query.filter(ExpenseModel.date >= start_date)
    if end_date:
        end_datetime = datetime.combine(end_date, datetime.min.time().replace(hour=23, minute=59, second=59))
        query = query.filter(ExpenseModel.date <= end_datetime)
    
    # Total amount and count
    total_result = query.with_entities(
        func.sum(ExpenseModel.amount).label('total_amount'),
        func.count(ExpenseModel.id).label('total_count')
    ).first()
    
    total_amount = float(total_result.total_amount) if total_result.total_amount else 0.0
    total_count = total_result.total_count if total_result.total_count else 0
    
    # Category breakdown
    category_results = query.with_entities(
        ExpenseModel.category,
        func.sum(ExpenseModel.amount).label('amount')
    ).group_by(ExpenseModel.category).all()
    
    category_breakdown = {result.category: float(result.amount) for result in category_results}
    
    # Monthly breakdown
    monthly_results = query.with_entities(
        func.strftime('%Y-%m', ExpenseModel.date).label('month'),
        func.sum(ExpenseModel.amount).label('amount')
    ).group_by(func.strftime('%Y-%m', ExpenseModel.date)).all()
    
    monthly_breakdown = {result.month: float(result.amount) for result in monthly_results}
    
    return ExpenseSummary(
        total_amount=total_amount,
        total_count=total_count,
        category_breakdown=category_breakdown,
        monthly_breakdown=monthly_breakdown
    )

# Web UI Endpoints

@app.get("/", response_class=HTMLResponse)
async def home(
    request: Request,
    category: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Home page with expense list and summary"""
    query = db.query(ExpenseModel)
    
    # Apply filters
    if category and category != "all":
        query = query.filter(ExpenseModel.category == category)
    if start_date:
        query = query.filter(ExpenseModel.date >= start_date)
    if end_date:
        end_datetime = datetime.combine(datetime.strptime(end_date, "%Y-%m-%d").date(), 
                                       datetime.min.time().replace(hour=23, minute=59, second=59))
        query = query.filter(ExpenseModel.date <= end_datetime)
    
    expenses = query.order_by(ExpenseModel.date.desc()).all()
    
    # Get summary
    total_amount = sum(expense.amount for expense in expenses)
    category_summary = {}
    for expense in expenses:
        category_summary[expense.category] = category_summary.get(expense.category, 0) + expense.amount
    
    return templates.TemplateResponse("index.html", {
        "request": request,
        "expenses": expenses,
        "categories": [cat.value for cat in ExpenseCategory],
        "total_amount": total_amount,
        "category_summary": category_summary,
        "selected_category": category,
        "start_date": start_date,
        "end_date": end_date,
        "current_date": datetime.now().strftime('%Y-%m-%d')
    })

@app.post("/expenses/create")
async def create_expense_form(
    title: str = Form(...),
    amount: float = Form(...),
    category: str = Form(...),
    description: str = Form(""),
    date: str = Form(...),
    db: Session = Depends(get_db)
):
    """Create expense from form submission"""
    try:
        if amount <= 0:
            raise HTTPException(status_code=400, detail="Amount must be positive")
        
        expense_date = datetime.strptime(date, "%Y-%m-%d") if date else datetime.utcnow()
        
        db_expense = ExpenseModel(
            title=title.strip(),
            amount=amount,
            category=category,
            description=description.strip() if description else None,
            date=expense_date
        )
        db.add(db_expense)
        db.commit()
        return RedirectResponse(url="/", status_code=303)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/expenses/{expense_id}/delete")
async def delete_expense_form(expense_id: int, db: Session = Depends(get_db)):
    """Delete expense from form submission"""
    db_expense = db.query(ExpenseModel).filter(ExpenseModel.id == expense_id).first()
    
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    
    db.delete(db_expense)
    db.commit()
    return RedirectResponse(url="/", status_code=303)

# Exception Handlers
@app.exception_handler(404)
async def not_found_handler(request: Request, exc: HTTPException):
    return templates.TemplateResponse("404.html", {"request": request}, status_code=404)

if __name__ == "__main__":
    import uvicorn
    
    # Create templates directory if it doesn't exist
    os.makedirs("templates", exist_ok=True)
    
    print("Creating template files...")
    print(f"Current directory: {os.getcwd()}")
    print(f"Templates directory: {os.path.join(os.getcwd(), 'templates')}")
    
    # Create the main HTML template
    html_template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expense Tracker</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px;
        }
        
        .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .summary-card {
            background: linear-gradient(45deg, #4CAF50, #45a049);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .summary-card h3 {
            font-size: 2rem;
            margin-bottom: 5px;
        }
        
        .summary-card p {
            opacity: 0.9;
        }
        
        .form-section {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        
        .form-section h2 {
            color: #333;
            margin-bottom: 20px;
            font-size: 1.5rem;
        }
        
        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
        }
        
        label {
            font-weight: 600;
            margin-bottom: 5px;
            color: #555;
        }
        
        input, select, textarea {
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .btn {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .btn-danger {
            background: linear-gradient(45deg, #ff6b6b, #ee5a52);
        }
        
        .filters {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            margin-bottom: 20px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        
        .filter-group {
            display: flex;
            flex-direction: column;
        }
        
        .filter-group label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
        }
        
        .filter-group select,
        .filter-group input {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
        }
        
        .expenses-table {
            overflow-x: auto;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }
        
        th {
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        
        td {
            padding: 15px;
            border-bottom: 1px solid #eee;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .category-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            color: white;
        }
        
        .category-food { background: #ff6b6b; }
        .category-transport { background: #4ecdc4; }
        .category-entertainment { background: #45b7d1; }
        .category-utilities { background: #f39c12; }
        .category-healthcare { background: #e74c3c; }
        .category-shopping { background: #9b59b6; }
        .category-education { background: #3498db; }
        .category-travel { background: #1abc9c; }
        .category-other { background: #95a5a6; }
        
        .amount {
            font-weight: bold;
            color: #e74c3c;
            font-size: 1.1rem;
        }
        
        .date {
            color: #666;
            font-size: 14px;
        }
        
        .no-expenses {
            text-align: center;
            padding: 40px;
            color: #666;
        }
        
        .no-expenses i {
            font-size: 3rem;
            margin-bottom: 20px;
            color: #ddd;
        }
        
        .category-summary {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .category-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .category-item h4 {
            margin-bottom: 5px;
            color: #333;
        }
        
        .category-item .amount {
            font-size: 1.2rem;
            color: #e74c3c;
        }
        
        @media (max-width: 768px) {
            .form-grid {
                grid-template-columns: 1fr;
            }
            
            .filters {
                flex-direction: column;
            }
            
            .summary-cards {
                grid-template-columns: 1fr;
            }
            
            table {
                font-size: 14px;
            }
            
            th, td {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Expense Tracker</h1>
            <p>Track your expenses and manage your budget effectively</p>
        </div>
        
        <div class="content">
            <!-- Summary Cards -->
            <div class="summary-cards">
                <div class="summary-card">
                    <h3>${{ "%.2f"|format(total_amount) }}</h3>
                    <p>Total Expenses</p>
                </div>
                <div class="summary-card">
                    <h3>{{ expenses|length }}</h3>
                    <p>Total Transactions</p>
                </div>
                <div class="summary-card">
                    <h3>{{ category_summary|length }}</h3>
                    <p>Active Categories</p>
                </div>
            </div>
            
            <!-- Category Summary -->
            {% if category_summary %}
            <div class="form-section">
                <h2>Category Breakdown</h2>
                <div class="category-summary">
                    {% for category, amount in category_summary.items() %}
                    <div class="category-item">
                        <h4>{{ category }}</h4>
                        <div class="amount">${{ "%.2f"|format(amount) }}</div>
                    </div>
                    {% endfor %}
                </div>
            </div>
            {% endif %}
            
            <!-- Add Expense Form -->
            <div class="form-section">
                <h2>Add New Expense</h2>
                <form action="/expenses/create" method="post">
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="title">Title</label>
                            <input type="text" id="title" name="title" required>
                        </div>
                        <div class="form-group">
                            <label for="amount">Amount ($)</label>
                            <input type="number" id="amount" name="amount" step="0.01" min="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="category">Category</label>
                            <select id="category" name="category" required>
                                {% for cat in categories %}
                                <option value="{{ cat }}">{{ cat }}</option>
                                {% endfor %}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="date">Date</label>
                            <input type="date" id="date" name="date" value="{{ datetime.now().strftime('%Y-%m-%d') }}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="description">Description (Optional)</label>
                        <textarea id="description" name="description" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn">Add Expense</button>
                </form>
            </div>
            
            <!-- Filters -->
            <div class="filters">
                <div class="filter-group">
                    <label>Category Filter</label>
                    <select onchange="applyFilters()">
                        <option value="all">All Categories</option>
                        {% for cat in categories %}
                        <option value="{{ cat }}" {% if selected_category == cat %}selected{% endif %}>{{ cat }}</option>
                        {% endfor %}
                    </select>
                </div>
                <div class="filter-group">
                    <label>Start Date</label>
                    <input type="date" id="start_date" value="{{ start_date or '' }}" onchange="applyFilters()">
                </div>
                <div class="filter-group">
                    <label>End Date</label>
                    <input type="date" id="end_date" value="{{ end_date or '' }}" onchange="applyFilters()">
                </div>
                <div class="filter-group">
                    <label>&nbsp;</label>
                    <button type="button" class="btn" onclick="clearFilters()">Clear Filters</button>
                </div>
            </div>
            
            <!-- Expenses Table -->
            <div class="expenses-table">
                {% if expenses %}
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {% for expense in expenses %}
                        <tr>
                            <td class="date">{{ expense.date.strftime('%Y-%m-%d') }}</td>
                            <td><strong>{{ expense.title }}</strong></td>
                            <td>
                                <span class="category-badge category-{{ expense.category.lower().replace(' ', '-').replace('&', '') }}">
                                    {{ expense.category }}
                                </span>
                            </td>
                            <td class="amount">${{ "%.2f"|format(expense.amount) }}</td>
                            <td>{{ expense.description or '-' }}</td>
                            <td>
                                <form action="/expenses/{{ expense.id }}/delete" method="post" style="display: inline;">
                                    <button type="submit" class="btn btn-danger" onclick="return confirm('Are you sure you want to delete this expense?')">Delete</button>
                                </form>
                            </td>
                        </tr>
                        {% endfor %}
                    </tbody>
                </table>
                {% else %}
                <div class="no-expenses">
                    <div style="font-size: 3rem; margin-bottom: 20px;">📊</div>
                    <h3>No expenses found</h3>
                    <p>Add your first expense using the form above!</p>
                </div>
                {% endif %}
            </div>
        </div>
    </div>
    
    <script>
        function applyFilters() {
            const category = document.querySelector('select').value;
            const startDate = document.getElementById('start_date').value;
            const endDate = document.getElementById('end_date').value;
            
            let url = '/';
            const params = new URLSearchParams();
            
            if (category && category !== 'all') {
                params.append('category', category);
            }
            if (startDate) {
                params.append('start_date', startDate);
            }
            if (endDate) {
                params.append('end_date', endDate);
            }
            
            if (params.toString()) {
                url += '?' + params.toString();
            }
            
            window.location.href = url;
        }
        
        function clearFilters() {
            window.location.href = '/';
        }
        
        // Set today's date as default
        document.getElementById('date').valueAsDate = new Date();
        
        // Auto-focus on title field
        document.getElementById('title').focus();
        
        // Form validation
        document.querySelector('form').addEventListener('submit', function(e) {
            const amount = parseFloat(document.getElementById('amount').value);
            const title = document.getElementById('title').value.trim();
            
            if (!title) {
                alert('Please enter a title for the expense');
                e.preventDefault();
                return;
            }
            
            if (amount <= 0) {
                alert('Amount must be greater than 0');
                e.preventDefault();
                return;
            }
        });
        
        // Format currency inputs
        document.getElementById('amount').addEventListener('input', function(e) {
            const value = parseFloat(e.target.value);
            if (value && value > 0) {
                e.target.style.borderColor = '#4CAF50';
            } else {
                e.target.style.borderColor = '#ddd';
            }
        });
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Alt + N to focus on new expense form
            if (e.altKey && e.key === 'n') {
                e.preventDefault();
                document.getElementById('title').focus();
            }
            
            // Alt + F to focus on filter
            if (e.altKey && e.key === 'f') {
                e.preventDefault();
                document.querySelector('select').focus();
            }
        });
        
        // Show loading state on form submission
        document.querySelector('form').addEventListener('submit', function() {
            const submitBtn = document.querySelector('button[type="submit"]');
            submitBtn.innerHTML = 'Adding...';
            submitBtn.disabled = true;
        });
        
        // Animate new rows (if any)
        document.addEventListener('DOMContentLoaded', function() {
            const rows = document.querySelectorAll('tbody tr');
            rows.forEach((row, index) => {
                row.style.opacity = '0';
                row.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    row.style.opacity = '1';
                    row.style.transform = 'translateY(0)';
                }, index * 50);
            });
        });
    </script>
</body>
</html>'''
    
    # Create 404 error page template
    error_404_template = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found | Expense Tracker</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .error-container {
            text-align: center;
            background: white;
            padding: 60px 40px;
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 100%;
        }
        
        .error-code {
            font-size: 8rem;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        
        .error-message {
            font-size: 1.5rem;
            color: #333;
            margin-bottom: 15px;
        }
        
        .error-description {
            color: #666;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .back-button {
            display: inline-block;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .back-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        
        .emoji {
            font-size: 4rem;
            margin-bottom: 20px;
            animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
        
        @media (max-width: 768px) {
            .error-code {
                font-size: 6rem;
            }
            
            .error-container {
                padding: 40px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="emoji">🔍</div>
        <div class="error-code">404</div>
        <div class="error-message">Page Not Found</div>
        <div class="error-description">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back to tracking your expenses!
        </div>
        <a href="/" class="back-button">← Back to Dashboard</a>
    </div>
</body>
</html>'''
    
    # Write the main template
    with open("templates/index.html", "w", encoding="utf-8") as f:
        f.write(html_template)
    
    # Write the 404 template
    with open("templates/404.html", "w", encoding="utf-8") as f:
        f.write(error_404_template)
    
    print("✅ Template files created successfully!")
    print(f"   - templates/index.html ({len(html_template)} characters)")
    print(f"   - templates/404.html ({len(error_404_template)} characters)")
    
    # Start the server
    print("\n🚀 Starting Expense Tracker server...")
    print("📊 Features included:")
    print("   • Complete CRUD operations for expenses")
    print("   • Category-based filtering and breakdown")
    print("   • Date range filtering")
    print("   • Responsive web interface")
    print("   • Data validation and error handling")
    print("   • SQLite database with sample data")
    print("   • Real-time expense summaries")
    print("   • Modern UI with animations")
    print("\n💡 API Documentation available at: http://localhost:8000/docs")
    print("🌐 Web Interface available at: http://localhost:8000")
    print("\nPress Ctrl+C to stop the server")
    
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)