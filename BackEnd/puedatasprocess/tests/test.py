import unittest
from datetime import datetime
from services.contants import *
from services.localstor import MysqlService
from services.models import Todo

host = "localhost"
user = 'root'
pwd = 'asdfwj'
db = 'pue'


class TestService(unittest.TestCase):
    def test_get_todos(self):
        mss = MysqlService(host, user, pwd, db)
        dt = datetime(2024, 6, 2, 13)
        datas = mss.get_todos(dt)
        self.assertIsInstance(datas, list)
        for todo in datas:
            print(todo)
            self.assertIsInstance(todo, Todo)
            self.assertEqual(todo.status, UNCOMPLETED)

    def test_set_todos(self):
        todos = [
            Todo(timestr="2024-02", dtype=MONTH, status=NODATA),  # insert
            Todo(timestr="2024-05-20", dtype=DAY, status=UNCOMPLETED), # noChange
            Todo(timestr="2024-05-20-13", dtype=HOUR, status=NODATA),  # update
        ]
        mss = MysqlService(host, user, pwd, db)
        self.assertTrue(mss.set_todos(todos))