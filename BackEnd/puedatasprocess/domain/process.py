from typing import Protocol, runtime_checkable

from services.factory import ServicesFactory
from services.models import Todo, CurrentData
from services.contants import *


@runtime_checkable
class IProcess(Protocol):
    def process(self, todo: Todo) -> str:
        return ""


class HourlyProcess(IProcess):
    def process(self, todo: Todo) -> str:
        # 获取在用的roomid列表
        rooms = ServicesFactory().get_mysqlService().get_rooms()
        # query one hour collection datas
        influx = ServicesFactory().get_influxService()
        datas = influx.query_onehour_currentdatas_of_rooms(rooms, todo.timestr)

        # todo 生成原始tag的currentDatas(需要先定义好 ORM Model)

        # todo 获取计算汇总tag方法的数据 (需要先规划出如何表达计算方法, 并将各站点计算方法持久化)

        # todo 生成汇总tag的currentDatas

        # todo 存入localstore

        # todo 返回状态
        return UNCOMPLETED



