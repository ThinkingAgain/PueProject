from datetime import datetime, timedelta
from typing import List
from services.models import Todo, SiteRoom, Collector, VectorFormula, CurrentData
from services.constants import *
from sqlalchemy import create_engine, select, ScalarResult
from sqlalchemy.orm import Session


class MysqlService:
    def __init__(self, host: str, user: str, pwd: str, db: str):
        self.engine = create_engine(f'mysql+pymysql://{user}:{pwd}@{host}/{db}?charset=utf8')  #, echo=True)

    def get_site_rooms(self) -> List[SiteRoom]:
        """从表site_rooms中获取所有的site_rooms列表"""
        with Session(self.engine) as session:
            query = select(SiteRoom)
            return [sr for sr in session.scalars(query)]

    def get_rooms(self) -> List[str]:
        """从表site_rooms中获取在用的roomid列表"""
        with Session(self.engine) as session:
            query = select(SiteRoom)
            return [sr.roomid for sr in session.scalars(query)]

    def get_collectors(self, roomid_list: [str]) -> [Collector]:
        """从表collector中获取指定机房的采集点数据: [Collector]"""
        with Session(self.engine) as session:
            query = select(Collector).where(Collector.roomid.in_(roomid_list))
            return [t for t in session.scalars(query)]

    def get_vector_formula(self, roomid: str) -> [VectorFormula]:
        """从表vector_formula中获取指定机房的能耗分量计算公式集合"""
        with Session(self.engine) as session:
            query = select(VectorFormula).where(VectorFormula.roomid.__eq__(roomid))
            return [t for t in session.scalars(query)]

    def get_current_datas(self, dtype: str, category: str, start_timestr: str, end_timestr: str) -> [CurrentData]:
        """
        从表current_datas中获取指定类型与时间段的数据
        :param dtype: HOUR/DAY/MONTH
        :param timestr_range:
        :return: [CurrentData]
        """
        with Session(self.engine) as session:
            query = select(CurrentData).where(CurrentData.dtype.__eq__(dtype)
                                              & CurrentData.category.__eq__(category)
                                              & CurrentData.timestr.between(start_timestr, end_timestr))
            return [t for t in session.scalars(query)]

    def set_current_datas(self, currents: [CurrentData]) -> bool:
        """upsert数据到current——datas"""
        try:
            with Session(self.engine) as session:
                new_datas = []
                for c in currents:
                    # 需判断 currentData是否在表中已存在, 再决定插入还是更新
                    query = select(CurrentData).where(CurrentData.roomid.__eq__(c.roomid)
                                                      & CurrentData.timestr.__eq__(c.timestr)
                                                      & CurrentData.dtype.__eq__(c.dtype)
                                                      & CurrentData.category.__eq__(c.category)
                                                      & CurrentData.tag.__eq__(c.tag))
                    data = session.scalars(query).first()
                    if data:
                        """更新"""
                        data.current = c.current
                        session.commit()
                    else:
                        """插入"""
                        new_datas.append(c)
                session.add_all(new_datas)
                session.commit()

        except Exception as e:
            print(e)
            return False

        return True

    def get_todos(self, dt: datetime) -> list[Todo]:
        """输入datetime参数, 判断前一时/前一日/前一月是否存在于表中, 如不存在则插入, 最后获取所有UNCOMPLETED状态的Todo列表
        params: dt datetime类型
        return: Todo列表
        """

        # 1. 判断表中是否存在 前一月/前一日/前一时 的待办项, 若不存在则插入(状态为UNCOMPLETED)
        last_month = (datetime(dt.year, dt.month, 1) - timedelta(days=1)).strftime('%Y-%m')
        self._ensure_todo_exist(last_month, MONTH)

        last_day = (dt - timedelta(days=1)).strftime('%Y-%m-%d')
        self._ensure_todo_exist(last_day, DAY)

        last_hour = (dt - timedelta(hours=1)).strftime('%Y-%m-%d-%H')
        self._ensure_todo_exist(last_hour, HOUR)

        # 2. 获取表中所有UNCOMPLETED状态的待办项
        with Session(self.engine) as session:
            query = select(Todo).where(Todo.status.__eq__(UNCOMPLETED))
            return [t for t in session.scalars(query)]

    def set_todos(self, todos: list) -> bool:
        """插入/更新 待办列表
        params: Todo列表
        return True/False
        """
        try:
            with Session(self.engine) as session:
                for todo in todos:
                    # 需判断 todo是否在表中已存在, 再决定插入还是更新
                    query = select(Todo).where(Todo.timestr.__eq__(todo.timestr) & Todo.dtype.__eq__(todo.dtype))
                    data = session.scalars(query).first()
                    if data:
                        """更新"""
                        data.status = todo.status
                        session.commit()
                    else:
                        """插入"""
                        session.add(todo)
                        session.commit()

        except:
            return False

        return True

    def _ensure_todo_exist(self, timestr: str, dtype: str):
        """确保指定todo存在, 若不存在则插入, 状态为UNCOMPLETED"""
        with Session(self.engine) as session:
            query = select(Todo).where(Todo.timestr.__eq__(timestr) & Todo.dtype.__eq__(dtype))
            if not session.scalars(query).first():
                session.add(Todo(timestr=timestr, dtype=dtype, status=UNCOMPLETED))
                session.commit()


if __name__ == "__main__":
    # host = "localhost"
    # user = 'root'
    # pwd = 'asdfwj'
    # db = 'pue'
    # mss = MysqlService(host, user, pwd, db)
    # timestr = "2024-05-20-13"
    # # mss.get_todos(timestr)
    # ts = timestr.split('-')
    #
    # xx = ('-'.join(ts[:x]) for x in range(2, len(ts) + 1))
    # yy = (MONTH, DAY, HOUR)
    # for v, z in zip(xx, yy):
    #     print(v, z)
    a = ["a", "a", "b", "c", "b", "a"]
    b = {x: 0 for x in a}
    print(b)
    print(type(b))
