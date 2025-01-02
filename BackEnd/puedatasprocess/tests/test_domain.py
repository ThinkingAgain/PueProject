from unittest import TestCase

from domain.process import HourlyProcess, DailyProcess, MonthlyProcess, get_month_se_timestr
from services.models import Todo
from services.constants import *
from datetime import datetime, timedelta


class TestDomain(TestCase):
    def test_hourlyProcess(self):
        hp = HourlyProcess()
        todo = Todo(timestr="2025-01-01-00", dtype=HOUR, status=UNCOMPLETED)
        self.assertEqual(hp.process(todo), COMPLETED)

    def test_hourlyProcess_tag_lacked(self):
        hp = HourlyProcess()
        todo = Todo(timestr="2024-06-19-12", dtype=HOUR, status=UNCOMPLETED)
        self.assertEqual(hp.process(todo), COMPLETED)

    def test_hourlyProcess_no_data(self):
        hp = HourlyProcess()
        todo = Todo(timestr="2024-10-10-07", dtype=HOUR, status=UNCOMPLETED)
        self.assertEqual(hp.process(todo), NODATA)

    def test_gen_hour_current_datas(self):
        """生成小时数据"""
        hp = HourlyProcess()
        for d in [31, 32]:
            dt = datetime(2024, 12, d, 0)
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
        for timestr in ['2024-12-31']:
            todo = Todo(timestr=timestr, dtype=DAY, status=UNCOMPLETED)
            self.assertEqual(dp.process(todo), COMPLETED)

    def test_monthlyProcess(self):
        """生成月数据"""
        mp = MonthlyProcess()
        for timestr in ['2024-12', ]:
            todo = Todo(timestr=timestr, dtype=MONTH, status=UNCOMPLETED)
            self.assertEqual(mp.process(todo), COMPLETED)

    def test_get_month_se_timestr(self):
        """测试月起止日字串生成"""
        se = get_month_se_timestr("2024-12")
        month_first_day, month_last_day = se
        self.assertEqual(month_first_day, "2024-12-01" )
        self.assertEqual(month_last_day, "2024-12-31")
