from datetime import date
from typing import List
from sqlalchemy import Date, Float, Integer, String, ForeignKey, func
from sqlalchemy.orm import mapped_column, Mapped, relationship

from .database import Base

class Students(Base):

    __tablename__ = "students"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    major: Mapped[str] = mapped_column(String)
    year: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    gpa: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    enrollments : Mapped[List["Enrollments"]] = relationship(back_populates="student", cascade="all, delete-orphan")

class Professors(Base):
    __tablename__ = "professors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    department: Mapped[str] = mapped_column(String)
    hire_date: Mapped[date] = mapped_column(Date)

    courses: Mapped[List["Courses"]] = relationship("Courses", back_populates="professor")

class Courses(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    code: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    credits: Mapped[int] = mapped_column(Integer, nullable=False)
    professor_id: Mapped[int] = mapped_column(Integer, ForeignKey("professors.id"), nullable=False)
    max_capacity: Mapped[int] = mapped_column(Integer, nullable=False)

    professor: Mapped["Professors"] = relationship(back_populates="courses")
    enrollments: Mapped[List["Enrollments"]] = relationship(back_populates="course", cascade="all, delete-orphan")

class Enrollments(Base):
    __tablename__ = "enrollments"

    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("students.id"), primary_key=True)
    course_id: Mapped[int] = mapped_column(Integer, ForeignKey("courses.id"), primary_key=True)
    enrollment_date: Mapped[date] = mapped_column(Date, nullable=False, server_default=func.current_date())
    grade: Mapped[float] = mapped_column(Float)

    student: Mapped["Students"] = relationship(back_populates="enrollments")
    course: Mapped["Courses"] = relationship(back_populates="enrollments")  