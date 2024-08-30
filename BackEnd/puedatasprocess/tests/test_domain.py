from unittest import TestCase

from domain.process import HourlyProcess, DailyProcess, MonthlyProcess
from services.models import Todo
from services.constants import *
from datetime import datetime, timedelta


class TestDomain(TestCase):
    def test_hourlyProcess(self):
        hp = HourlyProcess()
        todo = Todo(timestr="2024-06-16-12", dtype=HOUR, status=UNCOMPLETED)
        self.assertEqual(hp.process(todo), COMPLETED)

    def test_hourlyProcess_tag_lacked(self):
        hp = HourlyProcess()
        todo = Todo(timestr="2024-06-19-12", dtype=HOUR, status=UNCOMPLETED)
        self.assertEqual(hp.process(todo), COMPLETED)

    def test_hourlyProcess_no_data(self):
        hp = HourlyProcess()
        todo = Todo(timestr="2024-07-22-07", dtype=HOUR, status=UNCOMPLETED)
        self.assertEqual(hp.process(todo), NODATA)

    def test_gen_hour_current_datas(self):
        """生成小时数据"""
        hp = HourlyProcess()
        for d in [11, 12]:
            dt = datetime(2024, 8, d, 0)
            for i in range(24):
                timestr = (dt + timedelta(hours=i)).strftime("%Y-%m-%d-%H")
                todo = Todo(timestr=timestr, dtype=HOUR, status=UNCOMPLETED)
                hp.process(todo)
        # dt = datetime(2024, 7, 1, 0)
        # for i in range(24):
        #     timestr = (dt + timedelta(hours=i)).strftime("%Y-%m-%d-%H")
        #     todo = Todo(timestr=timestr, dtype=HOUR, status=UNCOMPLETED)
        #     hp.process(todo)

    def test_dailyProcess(self):
        """生成日数据"""
        dp = DailyProcess()
        for timestr in ['2024-08-11']:
            todo = Todo(timestr=timestr, dtype=DAY, status=UNCOMPLETED)
            self.assertEqual(dp.process(todo), COMPLETED)

    def test_monthlyProcess(self):
        """生成月数据"""
        mp = MonthlyProcess()
        for timestr in ['2024-06', '2024-07']:
            todo = Todo(timestr=timestr, dtype=MONTH, status=UNCOMPLETED)
            self.assertEqual(mp.process(todo), COMPLETED)

