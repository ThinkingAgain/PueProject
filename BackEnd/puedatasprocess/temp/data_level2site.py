from services.factory import ServicesFactory
from services.models import CurrentData
from services.constants import *
import pandas as pd

REGULAR_TAG = [TOTAL, PRODUCT, DEVICE, BUSINESS, OFFICE, LEASE, PUE]

mss = ServicesFactory().get_mysqlService()

# 读取site_rooms, 便于查找区县信息
site_rooms = mss.get_site_rooms()
site_dic = {sr.roomid: sr.county for sr in site_rooms}

# 读取数据库(只取二级用电点标签), 形成{(roomid, timestr): {tag: current......}}字典
current_dic = {}
currents = mss.get_current_datas(HOUR, VECTOR, '2024-09-01-00', '2024-11-25-23')
for c in currents:
    if c.tag not in REGULAR_TAG:
        k = (c.roomid, c.timestr)
        if k not in current_dic.keys():
            current_dic[k] = {}
        current_dic[k][c.tag] = c.current

# 由以上字典转化为df
datas = {
    '区县': [],
    '站点': [],
    '时间': [],
    '一级类别': [],
    '二级用电点': [],
    '电流': [],
}

for k, d in current_dic.items():
    roomid, timestr = k
    for t, c in d.items():
        datas['区县'].append(site_dic[roomid])
        datas['站点'].append(roomid)
        datas['时间'].append(timestr)

        tags = t.split('-')
        datas['一级类别'].append(tags[0])
        datas['二级用电点'].append(tags[-1])
        datas['电流'].append(c)

df = pd.DataFrame(datas)
df.to_csv('e:/temp/二级用电点.csv', index=False, encoding='gbk')


print("hell")