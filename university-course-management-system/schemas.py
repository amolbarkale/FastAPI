from datetime import date
from pydantic import BaseModel, Field, PositiveInt, confloat, conint, EmailStr
from typing import Optional, List

class CourseBase(BaseModel):
    name: str
    code: str
    credits: int = conint(ge=1)
    professor_id: PositiveInt
    max_capacity: int = conint(ge=1)

    class Config:
        from_attributes = True

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    credits: Optional[int] = None
    professor_id: Optional[PositiveInt] = None
    max_capacity: Optional[int] = None

    class Config:
        from_attributes = True

class CourseResponse(BaseModel):
    id: int
    name: str
    code: str
    credits: int = conint(ge=1)
    professor_id: PositiveInt
    max_capacity: int = conint(ge=1)

    class Config:
        from_attributes = True

# _______________________________________________________________

class StudentBase(BaseModel):
    name: str
    email: EmailStr
    major: Optional[str] = None
    year: int = conint(ge=1, le=4)
    gpa: float = confloat(ge=3.0, le=9.0)

    class Config:
        from_attributes = True

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    major: Optional[str] = None
    year: Optional[int] = None
    gpa: Optional[float] = None

    class Config:
        from_attributes = True

class StudentResponse(StudentBase):
    id: int

    class Config:
        from_attributes = True

class StudentWithCoursesResponse(StudentResponse):
    courses: List[CourseResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True

class CourseRosterResponse(BaseModel):
    course: CourseResponse
    students: List[StudentResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True

# _______________________________________________________________

class ProfessorBase(BaseModel):
    name: str
    email: EmailStr
    department: str
    hire_date: date

class ProfessorCreate(ProfessorBase):
    pass

class ProfessorUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    hire_date: Optional[date] = None

    class Config():
        from_attributes = True

class ProfessorResponse(ProfessorBase):
    courses: List["CourseResponse"] = Field(default_factory=list)

    class Config():
        from_attributes = True

ProfessorListResponse = List[ProfessorResponse]