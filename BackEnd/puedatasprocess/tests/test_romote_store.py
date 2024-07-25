from unittest import TestCase

from services.factory import ServicesFactory
from services.models import CollectData


class TestInfluxService(TestCase):
    def test__convert_hourstr(self):
        influx = ServicesFactory()
        timestr = "2024-05-22-12"
        s, e = influx.convert_hourstr(timestr)
        print(s, e)
        self.assertEqual(s, "2024-05-22T04:00:00Z")
        self.assertEqual(e, "2024-05-22T04:59:00Z")

    def test_query_onehour_currentdatas_of_someroom(self):
        influx = ServicesFactory().get_influxService()
        timestr = "2024-05-22-12"
        roomid = "聊白洼机房"
        datas = influx.query_onehour_currentdatas_of_someroom(roomid, timestr)
        self.assertIsInstance(datas, list)
        self.assertIsInstance(datas[0], CollectData)
        for cd in datas[:5]:
            print(cd)

    def test_query_onehour_currentdatas_of_rooms(self):
        influx = ServicesFactory().get_influxService()
        timestr = "2024-05-22-12"
        roomid = "聊白洼机房"
        d = influx.query_onehour_currentdatas_of_rooms([roomid], timestr)
        self.assertIsInstance(d, dict)
        self.assertIsInstance(d[roomid], list)
        self.assertIsInstance(d[roomid][0], CollectData)
