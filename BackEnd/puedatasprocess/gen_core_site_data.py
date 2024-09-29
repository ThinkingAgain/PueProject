from services.factory import ServicesFactory
from services.models import CurrentData
from services.constants import *

data_842 = [
    {'name': '总电流', 'formula': '{A1}+{A2}+{A3}+{A4}+{A5}+{A6}+{A7}'},
    {'name': '生产', 'formula': '{A1}+{A2}-{B1}'},
    {'name': '办公', 'formula': '{A3}+{A4}-{B7}-{C3}-{C4}'},
    {'name': '营业', 'formula': '{C3}+{C4}'},
    {'name': '外租', 'formula': '{A5}+{A6}+{A7}+{B1}+{B7}'},
    {'name': '动力源配电屏', 'formula': '{B2}'},
    {'name': '华为配电屏', 'formula': '{B3}'},
    {'name': '洲际配电屏', 'formula': '{B4}'},
    {'name': '艾默生配电屏', 'formula': '{B5}'},
    {'name': '食堂', 'formula': '{A3}'},
    {'name': '中央空调', 'formula': '{B6}'},
    {'name': '办公楼', 'formula': '{B8}-{C3}-{C4}'},
    {'name': '营业大厅', 'formula': '{C3}'},
    {'name': '营业空调', 'formula': '{C4}'},
    {'name': '工商局', 'formula': '{B7}'},
    {'name': '大数据局', 'formula': '{A5}+{B1}+{A6}+{A7}'},
    {'name': '大数据局机房', 'formula': '{A5}+{B1}'},
    {'name': '大数据局办公', 'formula': '{A6}+{A7}'}
]


# 1. 读取842 currents数据(1天的)
def get_one_day_currents():
    mss = ServicesFactory().get_mysqlService()
    datas = mss.get_current_datas(HOUR, POINT, '2024-09-23-00', '2024-09-23-23')
    tag_currents = {}
    for c in datas:
        if c.roomid == '聊842局':
            if c.tag in tag_currents:
                tag_currents[c.tag].append(c.current)
            else:
                tag_currents[c.tag] = [c.current]
    return tag_currents


# 输出各分量一天的均值
def out_one_day_average():
    currents = get_one_day_currents()
    # 2. 计算tag的平均值, 形成{A1 A2..}字典
    tag_mean = {k: sum(v) / len(v) for k, v in currents.items()}

    # 3. 遍历struct_842, 计算值并输出每一个分量的值
    for item in data_842:
        value = eval(item['formula'].format(**tag_mean))
        print(f"{item['name']}: {round(value, 1)}")


# 输出各分量24小时的序列值(echarts的data格式)
def out_24_hours_values():
    mss = ServicesFactory().get_mysqlService()
    datas = mss.get_current_datas(HOUR, POINT, '2024-09-23-00', '2024-09-23-23')
    tag_currents = {}
    for c in datas:
        if c.roomid == '聊842局':
            if c.timestr in tag_currents:
                tag_currents[c.timestr][c.tag] = c.current
            else:
                tag_currents[c.timestr] = {c.tag: c.current}

    values = [['时间', *[x['name'] for x in data_842]]]
    for k, v in tag_currents.items():
        timestr = f'{k.split("-")[-1]}时'
        vector_values = [round(eval(item['formula'].format(**v)), 1) for item in data_842]
        values.append([timestr, *vector_values])
    print(values)




if __name__ == "__main__":
    #out_one_day_average()
    out_24_hours_values()
