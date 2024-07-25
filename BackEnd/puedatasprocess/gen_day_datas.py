from domain.process import HourlyProcess, DailyProcess, MonthlyProcess
from services.models import Todo
from services.constants import *
from datetime import datetime, timedelta


# 生成日数据
dp = DailyProcess()
# 2024-06-24 -> 30, 07-1 -> 07
dates = [f'2024-07-{d}' for d in range(10, 18)]
# for d in range(1, 8):
#     dates.append(f'2024-07-0{d}')



for timestr in dates:
    todo = Todo(timestr=timestr, dtype=DAY, status=UNCOMPLETED)
    dp.process(todo)
