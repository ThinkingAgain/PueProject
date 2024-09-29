from domain.process import HourlyProcess, DailyProcess, MonthlyProcess
from services.models import Todo
from services.constants import *
from datetime import datetime, timedelta


# 生成小时数据: 2024-06-24 -> 30, 07-1 -> 08, 07-09 00H -> 05H
hp = HourlyProcess()
#2024-06-24 -> 30,
# for d in range(24, 31):
#     dt = datetime(2024, 6, d, 0)
#     for i in range(24):
#         timestr = (dt + timedelta(hours=i)).strftime("%Y-%m-%d-%H")
#         todo = Todo(timestr=timestr, dtype=HOUR, status=UNCOMPLETED)
#         hp.process(todo)
#     print(f'{d} Completed')

# 08-26 -> 31
# for d in range(26, 32):
#     dt = datetime(2024, 8, d, 0)
#
#     for i in range(24):
#         timestr = (dt + timedelta(hours=i)).strftime("%Y-%m-%d-%H")
#         todo = Todo(timestr=timestr, dtype=HOUR, status=UNCOMPLETED)
#         hp.process(todo)
#     print(f'{d} Completed')

# 09-13 -> 24
for d in range(13, 25):
    dt = datetime(2024, 9, d, 0)

    for i in range(24):
        timestr = (dt + timedelta(hours=i)).strftime("%Y-%m-%d-%H")
        todo = Todo(timestr=timestr, dtype=HOUR, status=UNCOMPLETED)
        hp.process(todo)
    print(f'{d} Completed')

# 07-09 00H -> 05H
# dt = datetime(2024, 7, 9, 0)
# for i in range(6):
#     timestr = (dt + timedelta(hours=i)).strftime("%Y-%m-%d-%H")
#     todo = Todo(timestr=timestr, dtype=HOUR, status=UNCOMPLETED)
#     hp.process(todo)
