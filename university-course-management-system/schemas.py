from pydantic import BaseModel, Field, PositiveInt, confloat, conint, EmailStr
from typing import Optional, List

# GET /courses # Get all courses
# POST /courses # Create new course
# GET /courses/{id} # Get specific course
# PUT /courses/{id} # Update course
# DELETE /courses/{id} # Delete course
# GET /courses/{id}/students # Get course roster

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

CourseListResponse = List[CourseResponse]

# _______________________________________________________________
# GET /students # Get all students
# POST /students # Create new student
# GET /students/{id} # Get specific student
# PUT /students/{id} # Update student
# DELETE /students/{id} # Delete student
# GET /students/{id}/courses # Get student's courses

class StudentBase(BaseModel):
    name: str
    email: EmailStr
    major: Optional[str] = None
    year: int = conint(ge=2020, le=2025)
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

StudentListResponse = List[StudentResponse]

class StudentWithCoursesResponse(StudentResponse):
    courses: List[CourseBase] = []
    class Config:
        from_attributes = True

class CourseRosterResponse(BaseModel):
    course: CourseResponse
    students: List[StudentResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True
# _______________________________________________________________

