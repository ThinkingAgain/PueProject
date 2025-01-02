from domain.process import MonthlyProcess
from services.models import Todo
from services.constants import *

mp = MonthlyProcess()
for timestr in ['2024-10']:
    todo = Todo(timestr=timestr, dtype=MONTH, status=UNCOMPLETED)
    mp.process(todo)


