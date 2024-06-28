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
   /*指定站点的最晚时刻的RealTimeData数据*/
   /api/datas/collectdatas/realtimedata/{siteId}
   ```

3. 指定站点某日的电流序列数据
   
   ```csharp
   /*指定站点某日的电流序列数据*/
   /api/datas/collectdatas/currentseriesdata/{siteId}
   /*指定站点当日电流序列数据*/
   /api/datas/collectdatas/currentseriesdata/{siteId}/{dayTimeStr}
   ```

4. 指定站点某日的Pue序列数据
   
   ```csharp
   /*指定站点某日的Pue序列数据*/
   /api/datas/collectdatas/pueseriesdata/{siteId}
   /*指定站点当日Pue序列数据*/
   /api/datas/collectdatas/pueseriesdata/{siteId}/{dayTimeStr}
   ```
