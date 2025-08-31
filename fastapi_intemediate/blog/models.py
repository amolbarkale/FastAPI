from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from .databse import Base

class Blog(Base):
    __tablename__ = "blogs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String)
    body: Mapped[str] = mapped_column(String)