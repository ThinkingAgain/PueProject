# API

##### 能源数据

1. 指定站点的能源数据
   
   ```csharp
   /*指定站点和电表的最后月份的能源数据*/
   /api/datas/energydata/{siteId}/{meterId}
   
   /*指定站点,电表和报账月份的能源数据*/
   /api/datas/energydata/{siteId}/{meterId}/{checkmonth}
   ```
