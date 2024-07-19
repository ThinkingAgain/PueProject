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
