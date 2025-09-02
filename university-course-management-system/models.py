from datetime import date
from typing import List
from sqlalchemy import Date, Float, Integer, String, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship

from .database import Base

class Students(Base):

    __tablename__ = "students"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    major: Mapped[str] = mapped_column(String)
    year: Mapped[int] = mapped_column(Integer)
    gpa: Mapped[float] = mapped_column(Float)

    enrollments : Mapped[List["Enrollments"]] = relationship(back_populates="student", cascade="all, delete-orphan")

class Courses(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, index=True, nullable=False)
    code: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    credits: Mapped[int] = mapped_column(Integer, nullable=False)
    professor_id: Mapped[int] = mapped_column(Integer, ForeignKey("professors.id"), nullable=False)
    max_capacity: Mapped[int] = mapped_column(Integer, nullable=False)

class Professors(Base):
    __tablename__ = "professors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    department: Mapped[str] = mapped_column(String)
    hire_date: Mapped[date] = mapped_column(Date)

    courses: Mapped[List["Courses"]] = relationship("Courses", back_populates="professor")

class Enrollments(Base):
    __tablename__ = "enrollments"

    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("students.id"), primary_key=True)
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey("courses.id"), primary_key=True)
    enrollment_date: Mapped[date] = mapped_column(Date, nullable=False)
    grade: Mapped[float] = mapped_column(Float)

    student: Mapped["Students"] = relationship(back_populates="enrollments")
