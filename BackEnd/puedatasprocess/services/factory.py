from services.local_store import MysqlService
from services.romote_store import InfluxService


class ServicesFactory:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def get_mysqlService(self):
        host = "localhost"
        user = 'root'
        pwd = 'asdfwj'
        db = 'pue'
        return MysqlService(host, user, pwd, db)

    def get_influxService(self):
        return InfluxService()