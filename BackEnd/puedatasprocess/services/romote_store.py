import influxdb_client
from datetime import datetime, timedelta
from typing import List, Dict
import pytz
from services.models import CollectData


def convert_hourstr(timestr: str) -> tuple:
    """
    将北京时间某时字串转换为起,止utc时间.
    如 2024-05-22-12 转换为
    ('2024-05-22T04:00:00Z', '2024-05-22T04:59:00Z')
    :param timestr:
    :return:
    """
    start = datetime.fromisoformat(timestr).astimezone(pytz.utc)
    stop = start + timedelta(minutes=59)
    return (start.strftime("%Y-%m-%dT%H:%M:%SZ"),
            stop.strftime("%Y-%m-%dT%H:%M:%SZ"))


class InfluxService:
    def __init__(self, url="http://176.16.1.160:18086",
                 token="8P6YgrJnmXRDfySrlq9snm-XRNEjOZDCqXtLXELXJexj0FdQyT3ANQ2_Iw2I0K0h6AlBwxzRlUBlN05TwBIliw==",
                 org="iot"):
        self.client = influxdb_client.InfluxDBClient(
            url=url,
            token=token,
            org=org
        )

    def query_onehour_currentdatas_of_someroom(self, roomid: str, timestr: str) -> [CollectData]:
        """
        请求指定机房和时间点(北京时间某时)的采集数据集
        :param roomid: 机房
        :param timestr: 北京时间某时的字串, 如 2024-05-22-12
        :return: 采集数据集
        """
        # 转换某时字串 -> 开始 utc 时间 和结束 utc时间
        start, end = convert_hourstr(timestr)

        query = (f'from(bucket: "iot-data") '
                 f'|> range(start: {start}, stop: {end}) '
                 f'|> filter(fn: (r) => r["_measurement"] == "sensor_data_new") '
                 f'|> filter(fn: (r) => r["roomId"] == "{roomid}") ')

        result = self.client.query_api().query(org=self.client.org, query=query)
        datas = []
        for table in result:
            for record in table.records:
                datas.append(CollectData(timestr=record.get_time(), roomid=record.values['roomId'],
                                         group=record.values['group'], field=record.get_field(),
                                         value=record.get_value()))
        return datas

    def query_onehour_currentdatas_of_rooms(self, rooms: List[str], timestr: str) -> Dict[str, List[CollectData]]:
        """
        请求多个机房指定时间点(北京时间某时)的采集数据集
        :param rooms: 机房列表
        :param timestr: 时间点
        :return:
        """
        return {x: self.query_onehour_currentdatas_of_someroom(x, timestr) for x in rooms}


if __name__ == "__main__":
    influx = InfluxService()
    timestr = "2024-05-22-12"
    roomid = "聊白洼机房"
    influx.query_onehour_currentdatas_of_someroom(roomid, timestr)