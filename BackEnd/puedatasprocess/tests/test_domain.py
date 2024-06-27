from unittest import TestCase

from domain.process import HourlyProcess, DailyProcess
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
        todo = Todo(timestr="2024-01-01-12", dtype=HOUR, status=UNCOMPLETED)
        self.assertEqual(hp.process(todo), NODATA)

    def test_gen_current_datas(self):
        hp = HourlyProcess()
        dt = datetime(2024, 6, 25, 0)
        for i in range(24):
            timestr = (dt + timedelta(hours=i)).strftime("%Y-%m-%d-%H")
            todo = Todo(timestr=timestr, dtype=HOUR, status=UNCOMPLETED)
            hp.process(todo)

    def test_process(self):
        dp = DailyProcess()
        todo = Todo(timestr="2024-06-25", dtype=DAY, status=UNCOMPLETED)
        dp.process(todo)
        self.fail()
