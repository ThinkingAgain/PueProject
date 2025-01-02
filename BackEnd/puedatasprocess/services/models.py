from sqlalchemy import String, Float
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


"""以下是普通数据模型的定义"""


class CollectData:
    """InfluxDb中的采集数据模型"""
    def __init__(self, timestr, roomid, group, field, value):
        self.timestr = timestr
        self.roomid = roomid
        self.group = group
        self.field = field
        self.value = value

    def __repr__(self):
        return (f'CollectData(timestr={self.timestr}, roomid={self.roomid}, group={self.group}, '
                f'field={self.field}, value={self.value}')


"""以下是SQLAlchemy ORM模型的定义"""


class Base(DeclarativeBase):
    pass


class Todo(Base):
    __tablename__ = "todos"

    timestr: Mapped[str] = mapped_column(String(30), primary_key=True)
    dtype: Mapped[str] = mapped_column(String(30), primary_key=True)
    status: Mapped[str] = mapped_column(String(30))

    def __repr__(self):
        return f"Todo({self.timestr} - {self.dtype} : {self.status} )"


class SiteRoom(Base):
    __tablename__ = "site_rooms"

    site_id: Mapped[str] = mapped_column(String(60), primary_key=True)
    roomid: Mapped[str] = mapped_column(String(60), primary_key=True)
    site: Mapped[str] = mapped_column(String(200))
    meter_id: Mapped[str] = mapped_column(String(60))
    county: Mapped[str] = mapped_column(String(200))

    def __repr__(self):
        return (f"SiteRoom(site_id={self.site_id}, roomid={self.roomid}, site={self.site}, "
                f"meter_id={self.meter_id}, county={self.county})")


class CurrentData(Base):
    __tablename__ = "current_datas"

    roomid: Mapped[str] = mapped_column(String(60), primary_key=True)
    timestr: Mapped[str] = mapped_column(String(30), primary_key=True)
    dtype: Mapped[str] = mapped_column(String(30), primary_key=True)
    category: Mapped[str] = mapped_column(String(30), primary_key=True)
    tag: Mapped[str] = mapped_column(String(200), primary_key=True)
    current: Mapped[float] = mapped_column(Float)

    def __repr__(self):
        return (f"CurrentData(roomid={self.roomid}, timestr={self.timestr}, "
                f"dtype={self.dtype}, category={self.category}, tag={self.tag}, "
                f"current={self.current})")


class Collector(Base):
    __tablename__ = "collector"

    roomid: Mapped[str] = mapped_column(String(60), primary_key=True)
    groupid: Mapped[str] = mapped_column(String(200), primary_key=True)
    tag: Mapped[str] = mapped_column(String(200), primary_key=True)
    collectpoint: Mapped[str] = mapped_column(String(60))

    def __repr__(self):
        return (f"Collector(roomid={self.roomid}, groupid={self.groupid}, "
                f"tag={self.tag}, collectpoint={self.collectpoint}")


class VectorFormula(Base):
    __tablename__ = "vector_formula"

    roomid: Mapped[str] = mapped_column(String(60), primary_key=True)
    vector: Mapped[str] = mapped_column(String(60), primary_key=True)
    formula: Mapped[str] = mapped_column(String(300))

    def __repr__(self):
        return f"VectorFormula(roomid={self.roomid}, vector={self.vector}, formula={self.formula})"
    