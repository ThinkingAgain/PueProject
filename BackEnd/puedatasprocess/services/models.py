from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Todo(Base):
    __tablename__ = "todos"

    timestr: Mapped[str] = mapped_column(String(30), primary_key=True)
    dtype: Mapped[str] = mapped_column(String(30), primary_key=True)
    status: Mapped[str] = mapped_column(String(30))

    def __repr__(self):
        return f"Todo({self.timestr} - {self.dtype} : {self.status} )"
