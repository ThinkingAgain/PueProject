from datetime import datetime

from services.constants import HOUR, DAY, MONTH
from services.models import Todo
from services.factory import ServicesFactory
from domain.process import Process


def run() -> bool:
    """用于定时执行的数据处理任务"""
    dt = datetime.now()
    todos = ServicesFactory().get_mysqlService().get_todos(dt)

    '''先对todos排序'''
    # 定义排序权重
    dtype_order = {HOUR: 0, DAY: 1, MONTH: 2}
    # 按 dtype 的自定义顺序排序
    ordered_todos = sorted(todos, key=lambda todo: dtype_order[todo.dtype])

    p = Process()
    for todo in ordered_todos:
        todo.status = p.process(todo)

    return set_todos_into_store(todos)


def set_todos_into_store(todos: [Todo]) -> bool:
    return ServicesFactory().get_mysqlService().set_todos(todos)
