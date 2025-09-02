from sqlalchemy import Float, Integer, String, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped

from .database import Base

class Students(Base):

    __tablename__ = "students"

    id: Mapped[int] = mapped_column(Integer, unique=True, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    major: Mapped[str] = mapped_column(String)
    year: Mapped[int] = mapped_column(Integer)
    gpa: Mapped[float] = mapped_column(Float)

class Courses(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(Integer, unique=True, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    code: Mapped[str] = mapped_column(String, unique=True, index=True)
    credits: Mapped[int] = mapped_column(Integer)
    professor_id: Mapped[int] = mapped_column(Integer, ForeignKey("professors.id"))
    max_capacity: Mapped[int] = mapped_column(Integer)

class Professors(Base):
    __tablename__ = "professors"

    id: Mapped[int] = mapped_column(Integer, unique=True, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    department: Mapped[str] = mapped_column(String)
    hire_date: Mapped[str] = mapped_column(String)

class Enrollments(Base):
    __tablename__ = "enrollments"

    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("students.id"), primary_key=True)
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey("courses.id"), primary_key=True)
    enrollment_date: Mapped[str] = mapped_column(String)
    grade: Mapped[float] = mapped_column(Float)
