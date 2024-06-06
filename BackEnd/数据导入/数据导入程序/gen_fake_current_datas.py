"""
1. 将 UTC timestamp 转化为形如 2024-05-20-13 字串 并去除 0值行
2. 生成 roomid timestr dtype tag current 数据文件 (同一小时取均值)
3. 生成 product/device/business/office/lease 数据(根据 tag 拟定一个计算公式计算)
"""
import pandas
import pandas as pd
from datetime import tzinfo, datetime


# 1-外租电流（25） 2-油机室（120） 3-5G机房（49） 4-普通机房（44） 5-5G开关电源（40） 6-普通机房开关电源（36）
DEFAULT_CURRENT = (0, 25, 120, 49, 44, 40, 36)

TOTAL = "TOTAL"
PRODUCT = "PRODUCT"
DEVICE = 'DEVICE'
OFFICE = "OFFICE"
LEASE = "LEASE"

FLAG = ('',
        'A变压器到外租电和油机室 - 到外租电流',
        'A变压器到外租电和油机室 - 到油机室电流',
        'B油机室到5G机房和普通机房 - 到5G机房电流',
        'B油机室到5G机房和普通机房 - 到普通机房电流',
        'D5G机房开关电源 - 开关电源电流',
        'C普通机房开关电源 - 开关电源电流'
        )

def step1():
    """1. 将 UTC timestamp 转化为形如 2024-05-20-13 字串 并去除 0值行"""
    df = pd.read_csv("file/influxdatas.csv", encoding="ANSI")

    df['timestr'] = df['time'].map(lambda t: datetime.fromisoformat(t).astimezone().strftime('%Y-%m-%d-%H'))
    # 去除 value 值为 0 的行
    df = df[~(df["value"] == 0)].reset_index(drop=True)

    df.to_csv("file/step1.csv", encoding="ANSI", index=False)


def step2():
    """2. 生成 roomid timestr dtype tag current 数据文件 (同一小时取均值)"""
    df = pd.read_csv("file/step1.csv", encoding="ANSI")

    data = {
        "roomid": [],
        "timestr": [],
        "dtype": [],
        "field": [],
        "current": []
    }
    # 1. 求出同一线圈在一小时内的电流均值
    for (group, field, timestr), v in df.groupby(["group", "field","timestr"]):
        data["roomid"].append(v["roomid"].values[0])
        data["timestr"].append(timestr)
        data["dtype"].append("HOUR")
        data["field"].append(f"{group} - {field}")
        data["current"].append(v["value"].mean())

    df = pd.DataFrame(data)

    # 2. 计算同一采集点的3个线圈电流和
    df["tag"] = df['field'].map(lambda x: x[: -1])
    df2 = df.groupby(["roomid", "timestr", "dtype", "tag"]).sum()

    df2.to_csv("file/step2.csv", encoding="ANSI")


def step3():
    """3. 生成 total/product/device/business/office/lease 数据(根据 tag 拟定一个计算公式计算)"""
    df = pd.read_csv("file/step2.csv", encoding="ANSI")
    data = {
        "roomid": [],
        "timestr": [],
        "dtype": [],
        "tag": [],
        "current": []
    }
    for timestr, v in df.groupby("timestr"):
        df_dict = v.to_dict("list")
        tag_dict = {k: v for k, v in zip(df_dict['tag'], df_dict['current'])}
        # 开始生成计算数据
        data["roomid"].extend([v["roomid"].values[0]] * 5)
        data["timestr"].extend([timestr] * 5)
        data["dtype"].extend([v["dtype"].values[0]] * 5)
        data["tag"].extend([TOTAL, PRODUCT, DEVICE, OFFICE, LEASE])
        # 6个电流
        C1 = tag_dict[FLAG[1]] if FLAG[1] in tag_dict.keys() else DEFAULT_CURRENT[1]
        C2 = tag_dict[FLAG[2]] if FLAG[2] in tag_dict.keys() else DEFAULT_CURRENT[2]
        C3 = tag_dict[FLAG[3]] if FLAG[3] in tag_dict.keys() else DEFAULT_CURRENT[3]
        C4 = tag_dict[FLAG[4]] if FLAG[4] in tag_dict.keys() else DEFAULT_CURRENT[4]
        C5 = tag_dict[FLAG[5]] if FLAG[5] in tag_dict.keys() else DEFAULT_CURRENT[5]
        C6 = tag_dict[FLAG[6]] if FLAG[6] in tag_dict.keys() else DEFAULT_CURRENT[6]

        data["current"].extend([C1 + C2, C3 + C4, C5 + C6, C2 - C3 - C4, C1])


    df_tag = pd.DataFrame(data)
    # 合并两个df
    df_total = df.append(df_tag, ignore_index=True)
    df_total.to_csv("file/step3.csv", encoding="ANSI", index=False)





def utcstr_to_localtimestr(utc_str):
    """将 utc 字串转化为本地时间的字串: 形如 2024-05-20-13"""
    return datetime.fromisoformat(utc_str).astimezone().strftime('%Y-%m-%d-%H')


def utc_to_local_sample():
    """将utc时间转为本地时间"""
    utc_str = "2024-05-20 09:50:36.068000+00:00"
    # 生成 utc 时间
    utc_dt = datetime.fromisoformat(utc_str)
    # 转化为 本地时间
    local_dt = utc_dt.astimezone()
    print(f'UTC时间: {utc_dt}  时区信息: {utc_dt.tzinfo}')
    print(f'本地时间: {utc_dt}  时区信息: {utc_dt.tzinfo}')


def run():
    s = "2024-05-20 09:50:36.068000+00:00"
    dt = datetime.fromisoformat(s)
    print(dt)
    print(dt.tzinfo)
    dt2 = dt.astimezone()
    print(dt2)
    print(dt2.tzinfo)



if __name__ == "__main__":
    #run()
    #step2()
    step3()
    # data = {
    #     'Name': ['Alice', 'Bob', 'Charlie'],
    #     'Age': [25, 30, 35],
    #     'Salary': [50000, 60000, 45000]
    # }
    # df = pd.DataFrame(data)
    # dd = df.to_dict("list")
    # print(dd)



