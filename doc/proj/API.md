# API

##### 能源数据

1. 指定站点的能源数据
   
   ```csharp
   /*指定站点和电表的最后月份的能源数据*/
   /api/datas/energydata/{siteId}/{meterId}
   
   /*指定站点,电表和报账月份的能源数据*/
   /api/datas/energydata/{siteId}/{meterId}/{checkmonth}
   ```

2. 指定站点的实时数据
   
   ```csharp
   /*指定站点的最晚时刻的CollectData数据*/
   /api/datas/collectdatas/realtimedata/{siteId}
   ```

3. 指定站点和时间类型的采集数据
   
   ```csharp
   /*指定站点前一日的日统计CollectData采集数据*/
   /api/datas/collectdatas/sometime/{siteId}
   /*指定站点和时间类型及时刻的CollectData采集数据*/
   /api/datas/collectdatas/sometime/{siteId}/{dtype}/{timestr}
   ```

4. 指定站点某时间类型和时间点的电流序列数据
   
   ```csharp
   /*指定站点当日的电流序列数据*/
   /api/datas/collectdatas/currentseriesdata/{siteId}
   /*指定站点某时间类型和时间点的电流序列数据*/
   /api/datas/collectdatas/currentseriesdata/{siteId}/{timeType}/{timeStr}
   ```

5. 指定站点某日的Pue序列数据
   
   ```csharp
   /*指定站点当日的Pue序列数据*/
   /api/datas/collectdatas/pueseriesdata/{siteId}
   /*指定站点某时间类型和时间点的Pue序列数据*/
   /api/datas/collectdatas/pueseriesdata/{siteId}/{timeType}/{timeStr}
   ```

6. 站点列表 - 取自site_rooms
   
   ```csharp
   /*site_rooms中数据*/
   /api/datas/collectdatas/sitedatas
   ```

7. 站点有效采集数据日期的字典
   
   ```csharp
   /*指定站点的有效采集数据<SiteValidDate> 默认为全部站点的List<SiteValidDate> */
   /api/datas/collectdatas/sitevaliddates/{siteId}
   ```

8. 报表系统的站点用电情况
   
   ```csharp
   /*各站点的用电数据, 周期由timestr来确定 */
   /api/datas/statistics/sitestatement/{timestr}
   ```

9. 报表系统的办公营业用电预警日报的数据
   
   ```csharp
   /* 办公营业夜间用电的预警数据, timestr指定具体日期 */
   /api/datas/statistics/nonproductive-alarm/{timestr}
   ```

10. 报表系统的实时报表数据
    
    ```csharp
    /*实时时刻的各站点CollectData采集数据*/
    /api/datas/statistics/sometime
    /*指定时间类型及时刻的各站点CollectData采集数据*/
    /api/datas/statistics/sometime/{dtype}/{timestr}
    ```
