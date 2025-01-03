from domain.process import HourlyProcess, DailyProcess, MonthlyProcess
from services.models import Todo
from services.constants import *
from datetime import datetime, timedelta


# 生成日数据
dp = DailyProcess()
dates = []

# # 2024-06-24 -> 30
# dates = [f'2024-06-{d}' for d in range(24, 31)]

# # 2024-07-01 -> 09
# for d in range(1, 10):
#     dates.append(f'2024-07-0{d}')
# 2024-10-31 -> 31
for d in range(31, 32):
    dates.append(f'2024-10-{d}')

# # 2024-11-1 -> 25
for d in range(1, 26):
    dstr = f'2024-11-0{d}' if d < 10 else f'2024-11-{d}'
    dates.append(dstr)


print(dates)

for timestr in dates:
    todo = Todo(timestr=timestr, dtype=DAY, status=UNCOMPLETED)
    dp.process(todo)
