from services.factory import ServicesFactory
from services.models import CurrentData
from services.constants import *
import pandas as pd

mss = ServicesFactory().get_mysqlService()

# 读取site_rooms, 便于查找区县信息

site_rooms = mss.get_site_rooms()
site_dic = {sr.roomid: sr.county for sr in site_rooms}
print('jd')


# 读取数据库, 形成{(roomid, timestr): {tag: current......}}字典
current_dic = {}
currents = mss.get_current_datas(HOUR, VECTOR, '2024-09-01-00', '2024-11-25-23')
for c in currents:
    k = (c.roomid, c.timestr)
    if k not in current_dic.keys():
        current_dic[k] = {}
    current_dic[k][c.tag] = c.current

# 由以上字典转化为df
datas = {
    '区县': [],
    '站点': [],
    '时间': [],
    '生产电流': [],
    '办公电流': [],
    '营业电流': [],
    '外租电流': [],
    '设备电流': [],
    '生产占比': [],
    '办公占比': [],
    '营业占比': [],
    '外租占比': [],
    'PUE': [],
}

for k, v in current_dic.items():
    roomid, timestr = k
    datas['区县'].append(site_dic[roomid])
    datas['站点'].append(roomid)
    datas['时间'].append(timestr)

    total = v[TOTAL] if TOTAL in v.keys() else 0
    product = v[PRODUCT] if PRODUCT in v.keys() else 0
    business = v[BUSINESS] if BUSINESS in v.keys() else 0
    office = v[OFFICE] if OFFICE in v.keys() else 0
    lease = v[LEASE] if LEASE in v.keys() else 0
    device = v[DEVICE] if DEVICE in v.keys() else 0
    pue = v[PUE] if DEVICE in v.keys() else 0

    datas['生产电流'].append(product)
    datas['办公电流'].append(office)
    datas['营业电流'].append(business)
    datas['外租电流'].append(lease)
    datas['设备电流'].append(device)

    por_p = product / total if total != 0 else 0
    por_b = business / total if total != 0 else 0
    por_o = office / total if total != 0 else 0
    por_l = lease / total if total != 0 else 0

    datas['生产占比'].append(por_p)
    datas['办公占比'].append(por_o)
    datas['营业占比'].append(por_b)
    datas['外租占比'].append(por_l)
    datas['PUE'].append(pue)

df = pd.DataFrame(datas)
df.to_csv('e:/temp/站点.csv', index=False, encoding='gbk')


print('heel')