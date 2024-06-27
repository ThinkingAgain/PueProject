from unittest import TestCase

from services.factory import ServicesFactory
from services.models import CurrentData
from services.constants import *


class TestMysqlService(TestCase):
    def test_get_rooms(self):
        mss = ServicesFactory().get_mysqlService()
        datas = mss.get_rooms()
        self.assertIsInstance(datas, list)
        self.assertEqual(datas[0], "聊白洼机房")

    def test_set_current_datas(self):
        """1. 重复插入 2. 部分重复 3. 数据更新"""
        mss = ServicesFactory().get_mysqlService()
        currents = [
            CurrentData(roomid='聊白洼机房', timestr='2024-06-16-12', dtype='HOUR', category='VECTOR',
                        tag='BUSINESS', current=33),
            CurrentData(roomid='聊白洼机房', timestr='2024-06-16-12', dtype='HOUR', category='VECTOR', tag='DEVICE',
                        current=84.28711864406779),
            CurrentData(roomid='聊白洼机房', timestr='2024-06-16-12', dtype='HOUR', category='VECTOR', tag='LEASE',
                        current=26.581355932203394),
            CurrentData(roomid='聊白洼机房', timestr='2024-06-16-12', dtype='HOUR', category='VECTOR', tag='OFFICE',
                        current=42.26237288135597)
        ]
        self.assertTrue(mss.set_current_datas(currents))

    def test_get_current_datas(self):
        mss = ServicesFactory().get_mysqlService()
        datas = mss.get_current_datas(HOUR, POINT, '2024-06-23-05', '2024-06-23-11')
        self.assertIsInstance(datas, list)
