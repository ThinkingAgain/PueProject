from typing import Protocol, runtime_checkable

from services.factory import ServicesFactory
from services.models import Todo, CurrentData, CollectData
from services.constants import *


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
        collectdata_dic = influx.query_onehour_currentdatas_of_rooms(rooms, todo.timestr)

        # 迭代每个roomid, 生成最终数据列表
        currentDatas = []
        for roomid, collectdata_list in collectdata_dic.items():
            currentDatas.extend(self._gen_currentDatas(roomid, todo, collectdata_list))

        if not currentDatas:
            return NODATA

        # 将currentDatas存入localstore
        ServicesFactory().get_mysqlService().set_current_datas(currentDatas)
        # 返回状态
        return COMPLETED

    def _gen_currentDatas(self, roomid: str, todo: Todo, collectData_list: [CollectData]) -> [CurrentData]:
        """
        根据原始采集数据 生成要入库的CurrentData列表: 内容为 point/vector 电流数据
        :param todo_instanace:
        :param collectData_list: 原始采集数据
        :return: 要入库的CurrentData列表
        """
        local_store = ServicesFactory().get_mysqlService()
        currents = []
        # 创建:
        # 1. point电流值字典(均值累加) { point: 0,....} (从本地collector表中读取字段collectpoint去重后生成)
        # 2. 字典 {(roomid, groupid, tag): {point: collectpoint, currents: [vlaue]}}
        collectors = local_store.get_collectors([roomid])
        point_current_dic = {c.collectpoint: 0 for c in collectors}
        tag_dic = {(c.roomid, c.groupid, c.tag): {"point": c.collectpoint, "currents": []}
                   for c in collectors}

        # 采集数据放入tag_dic
        for cld in collectData_list:
            if (cld.roomid, cld.group, cld.field) in tag_dic:
                tag_dic[(cld.roomid, cld.group, cld.field)]['currents'].append(cld.value)

        # 判断 tag均值是否齐全? 不齐全就直接返回
        # 判断来自tag字典中是否有tag的电流值为空集合来判断一小时内的是否采集数据有tag缺失
        for value in tag_dic.values():
            if not value['currents']:
                return currents

        # -计算出每个tag一小时的电流均值:累加到point_current字典中
        for (roomid, group, field), value in tag_dic.items():
            mean_value = sum(value["currents"]) / len(value["currents"])
            # 考虑到数据库单表数据量, TAG电流均值暂时不入库了
            # currents.append(CurrentData(roomid=roomid, timestr=todo.timestr, dtype=todo.dtype,
            #                             tag=f'{group}-{field}', current=mean_value))

            # 累加到 point->current字典
            point = tag_dic[(roomid, group, field)]['point']
            point_current_dic[point] += mean_value

        # - point字典数据放入最终数据列表
        currents.extend([CurrentData(roomid=roomid, timestr=todo.timestr, dtype=todo.dtype,
                                     category=POINT, tag=point, current=mean_value)
                         for point, mean_value in point_current_dic.items()])

        # - 获取计算vector方法的数据 (需要先规划出如何表达计算方法, 并将各站点计算方法持久化)
        # 获取vector计算公式列表?字典 (从vector_formula表中获取)
        # 使用point_current_dic字典替换公式中point变量的方式, 完成计算
        for vf in local_store.get_vector_formula(roomid):
            try:
                vector_value = eval(vf.formula.format(**point_current_dic))
            except:
                vector_value = -1
            vector = CurrentData(roomid=roomid, timestr=todo.timestr, dtype=todo.dtype,
                                 category=VECTOR, tag=vf.vector, current=vector_value)
            currents.append(vector)

        # - 返回最终数据列表
        return currents


class DailyProcess(IProcess):
    def process(self, todo: Todo) -> str:
        # todo 获取todo.timestr指定的日POINT值, 分类存储到字典{roomid: {point: 均值}}
        datas = ServicesFactory().get_mysqlService().get_current_datas(HOUR, POINT,
                                                                       f'{todo.timestr}-00', f'{todo.timestr}-23')

        # todo 迭代字典, 调用方法生成要写入库的currentDatas  使用vector_formula公式计算vector值

        # todo 存储到 localstore, 并返回状态
        return COMPLETED

    def _gen_currentDatas(self):
        # todo 计算均值

        # todo 使用vector_formula公式计算vector值

        # todo 返回currents
        pass
