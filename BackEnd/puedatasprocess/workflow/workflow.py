from datetime import datetime

from services.models import Todo
from services.factory import ServicesFactory
from domain.process import Process


def run() -> bool:
    """用于定时执行的数据处理任务"""
    dt = datetime.now()
    todos = ServicesFactory().get_mysqlService().get_todos(dt)
    p = Process()
    for todo in todos:
        todo.status = p.process(todo)

    return set_todos_into_store(todos)


def set_todos_into_store(todos: [Todo]) -> bool:
    return ServicesFactory().get_mysqlService().set_todos(todos)
