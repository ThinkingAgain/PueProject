from unittest import TestCase

from services.factory import ServicesFactory


class TestMysqlService(TestCase):
    def test_get_rooms(self):
        mss = ServicesFactory().get_mysqlService()
        datas = mss.get_rooms()
        self.assertIsInstance(datas, list)
        self.assertEqual(datas[0], "聊白洼机房")
