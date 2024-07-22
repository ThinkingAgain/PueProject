import {useEffect, useState} from 'react'
import {useLoaderData, useNavigate, NavLink} from "react-router-dom"
import Energy from "./Component/Energy";
import TopMiddleDiagram from './Component/TopMiddleDiagram'
import PUE from "./Component/PUE";
import StationInfo from "./Component/StationInfo";
import { data as mockData } from '../mock/mockData'
import BottomMiddleDiagram from "./Component/BottomMiddleDiagram";
import BottomRightDiagram from "./Component/BottomRightDiagram";
import {getLatestEnerydataById, getRealTimedatasById, fetchData} from "../Service/getDatas";

export async  function stationMonitorLoader({params}) {
    const {siteID, meterID} = params
    const eneryData = await getLatestEnerydataById(siteID, meterID)
    const realTimeData = await getRealTimedatasById(siteID);  // PUE DATA
    // TopMiddleDiagram Data
    const currentSeries = await fetchData(`/api/datas/collectdatas/currentseriesdata/${siteID}`);
    const temperatureSeries = new Array(currentSeries.timeSeries.length).fill(0)
    // BottomMiddleDiagram Data
    const pueSeries = await fetchData(`/api/datas/collectdatas/pueseriesdata/${siteID}`);

    return {eneryData, realTimeData, currentSeries, temperatureSeries,pueSeries}
}

function StationMonitor() {
    const navigate = useNavigate();
    // 获取数据 更新状态====================================================
    const stationData = useLoaderData();
    //console.log(stationData);
    const { site, alarmReason, checkMonth, lastMeterReadingTime, currentMeterReadingTime,
        consumptionCheck, paymentCheck, currentPrice, lastConsumption, consumptionDailyCheck,
        production, business, office, scalar, superscalar, cuccShareRatio, cmccShareRatio,
        ctcShareRatio, supplyType, siteType, vestIn, siteID, meterID, responsibleDepartment,
        responsiblePerson, responsiblePhone, cuccSiteCode, consumptionStatus, photovoltaic,
        transferStatus, payBehalfStatus, serviceCenter, gridName, responsiblePhone2} = stationData.eneryData

  // 站点管理数据
  const [station, setStation] = useState({name: site, siteID: siteID});
  // 能源系统数据
  const [energyData, setEnergyData] = useState(
      {
          alarm: alarmReason, //"能耗预警: 当前异常电量超标, 超标准电量43.29%",
          period: `${checkMonth.split('-').join("年")}月 ( ${lastMeterReadingTime.replaceAll('-', '.')} - ${currentMeterReadingTime.replaceAll('-', '.')} )`,//"2024年2月 (2024.1.15-2024.2.15)",
          consumption: `${Number.parseInt(consumptionCheck)}度`,//"5806度", //用电量
          charge: `${Number.parseInt(paymentCheck)}元`,//"5342元",  // 电费
          price: `${parseFloat(currentPrice)}元`,//"0.92元",   // 电费单价
          degree: "3.96分",  // 健康度打分
          consumptionOfLastPeriod: `${Number.parseInt(lastConsumption)}度`,//"5434度",  // 上期电量
          consumptionOfDay: `${parseFloat(consumptionDailyCheck)}度`,//"187.31度",  // 日均电量
          produceEnergy: `${(production * 100 / paymentCheck).toFixed(1)}%`, //`${Number.parseInt(production)}元`,//"4807度",   // 生产用电
          businessEnergy: `${(business * 100 / paymentCheck).toFixed(1)}%`,//`${Number.parseInt(business)}元`,//"534度",    // 营业用电
          officeEnergy: `${(office * 100 / paymentCheck).toFixed(1)}%`,//`${Number.parseInt(office)}元`,//"534度",    // 办公用电
          benchmarkData: {  //对标环形图数据
              currval: scalar, //"4052",//生产标 - 环形的红色部分(红色+灰色为整个环, 红色部分的占比为: currval/(currval+maxval))
              maxval: `${scalar*100/superscalar - scalar}`,//"4680", // 环形的灰色部分 计算公式为(生产标/超标比例 - 生产标)
              result: `超标${superscalar}%`,//"超标43.29%",  // 对标结果
          },
      });
  // PUE数据
  const [pueData, setPueData] = useState({
      title: "实时数据",
      data: mockData.pueData,
      realTimeData: stationData.realTimeData
  })

  // 中上图 State
  const [topMiddleDiagram, setTopMiddleDiagram] = useState({
      title: "日用电变化情况",
      currentSeries: stationData.currentSeries,
      temperatureSeries: stationData.temperatureSeries,
  })

  // 中下图 State
    const [bottomMiddleDiagram, setBottomMiddleDiagram] = useState({
        title: "PUE日变化情况",
        pueSeries: stationData.pueSeries
    })

  // 站点信息
  const [stationInfoData, setStationInfoData] = useState({
      title: "网点信息",
      data: {
          "channelJfMap":{
              "NJ05166060_charge":9194,
              "NJ68689949_charge":2848,
              "NJ11050091_charge":-119,
              "NJ11057808_charge":-688,
              "NJ68689949_index":11,
              "NJ0104010153_charge":-139,
              "NJ72000095_charge":9433,
              "NJ05166060_index":6,
              "NJ11049063_index":10,
              "9901500010_charge":-250,
              "channelOrder":28,
              "channelTotal":57159,
              "NJ72000095_index":5,
              "NJ11010340_index":15,
              "9901660106_index":3,
              "NJ51789168_index":4,
              "NJ36038678_charge":918,
              "NJ90906337_index":7,
              "NJ37825052_index":8,
              "NJ0104010153_index":18,
              "channelLength":21,
              "NJ11049063_charge":6081,
              "NJ11032104_charge":-71,
              "NJ11032099_charge":6750,
              "0915020_index":13,
              "NJ37709514_charge":13063,
              "NJ51789168_charge":11633,
              "channelSum":97714,
              "staffCode":-3505,
              "9901660106_charge":12390,
              "NJ11057808_index":20,
              "NJ90906337_charge":8411,
              "0915020_charge":221,
              "NJ90908499_index":21,
              "NJ37825052_charge":7930,
              "NJ11010340_charge":0,
              "NJ36038678_index":12,
              "9901500010_index":19,
              "NJ37709514_index":2,
              "NJ11032500_charge":169,
              "NJ11032500_index":14,
              "NJ11050091_index":17,
              "NJ156677_charge":13445,
              "NJ156677_index":1,
              "NJ90908499_charge":-3505,
              "NJ11032099_index":9,
              "NJ11032104_index":16
          },
          "channelStaffLen":11,
          "channelStartWeiGui":1,
          "channelOrderNum":"233",
          /* 目前只使用了staffHandleInfo ==========begin */
          "staffHandleInfo":[[
              {
                  "staffCode":"9901500010",
                  "index":1,
                  "orderNum":"21",
                  "avgTime":"0.73",
                  "staffName":"共享状态",
                  "unicom": cuccShareRatio, //100, //联通共享比
                  "mobil": cmccShareRatio, //0,   // 移动共享比
                  "tele": ctcShareRatio, //0,    // 电信共享比
                  "powerTypeLabel": "供电方式",
                  "powerType": supplyType, //"直供电1",
                  "siteTypeLabel": "站点类型",
                  "siteType": siteType, // "接入网",
                  "ownerInfoLabel": "归属信息",
                  "ownerInfo": vestIn, // "非铁塔移交",
                  "siteId": siteID, // "406075",
                  "meterId": meterID, // "200056812",
              },
              {
                  "staffCode":"9901660106",
                  "index":2,
                  "orderNum":"23",
                  "avgTime":"1.55",
                  "staffName":"站点名称",
                  "siteName": site, //"朱老庄驻地机房",
                  "departmentLabel": "责任部门",
                  "department": responsibleDepartment, //"现场维护中心",
                  "maintainerLabel": "责任人",
                  "maintainer": responsiblePerson, //"冯xx",
                  "mphoneLabel": "联系电话",
                  "mphone": responsiblePhone, // "1565317XXXX",
                  "siteCode": cuccSiteCode, // "LCDC9010",
                  "powerStatus": consumptionStatus, // "10",

              }
          ],
              [
                  {
                      "staffCode":"NJ11032099",
                      "index":3,
                      "orderNum":"29",
                      "avgTime":"1.07",
                      "staffName":"共享状态",
                      "unicom": cuccShareRatio, //100, //联通共享比
                      "mobil": cmccShareRatio, //0,   // 移动共享比
                      "tele": ctcShareRatio, //0,    // 电信共享比
                      "powerTypeLabel": "光伏发电",
                      "powerType": photovoltaic, // "否",
                      "siteTypeLabel": "代缴状态",
                      "siteType": payBehalfStatus, //"联通自缴",
                      "ownerInfoLabel": "过户状态",
                      "ownerInfo": transferStatus, //"未过户",
                      "siteId": siteID, // "406075",
                      "meterId": meterID, // "200056812",
                  },
                  {
                      "staffCode":"NJ11032500",
                      "index":4,
                      "orderNum":"4",
                      "avgTime":"1.49",
                      "staffName":"站点名称",
                      "siteName": site, // "朱老庄驻地机房",
                      "departmentLabel": "营服",
                      "department": serviceCenter.replace("聊城市", "").replace("分公司", ""), //"XXX营服中心",
                      "maintainerLabel": "网格",
                      "maintainer": gridName.replace("聊城市", "").replace("分公司", ""), //"东昌维护网格",
                      "mphoneLabel": "联系人",
                      "mphone": responsiblePhone2, //"XXX",
                      "siteCode": cuccSiteCode, // "LCDC9010",
                      "powerStatus": consumptionStatus, // "10",
                  }
              ],
          ],
          /* 目前只使用了staffHandleInfo ========== end */
          "staffWgInfo":{
              "NJ11032500":0,
              "NJ36038678":0,
              "NJ156677":0,
              "NJ37709514":0,
              "NJ51789168":0,
              "NJ90906337":0,
              "NJ37825052":0,
              "9901500010":0,
              "NJ72000095":0,
              "9901660106":0,
              "NJ11032099":0
          },
          "channelAvgTime":"1.28"
      },
  })
  // UI显示控制数据
  const [uiState, setUiState] = useState({
      displaySearchTableBar: false, timeTitle: stationData.realTimeData.timeStr})

  // 测试用的方法
  const test = () => {
      /*const { displaySearchTableBar } = uiState
      setUiState({...uiState, displaySearchTableBar: !displaySearchTableBar})*/
      console.log("heel")
      location.href = "/"

  }

  const toggleSearchBar = () => {
      setUiState(uiState => {
          return {...uiState, displaySearchTableBar: !uiState.displaySearchTableBar}
      })
  }


  // useEffect
  useEffect(() => {
      const fetchRealTimeDatas = async () => {
          const data = await getRealTimedatasById(siteID);
          //console.log("RealTimeData: \n", data)
          setPueData(pueData =>{return {...pueData, realTimeData: data}})
          setUiState(uiState =>{return {...uiState, timeTitle: data.timeStr}})
          /* 更新 topMiddleDiagram */
          const currentSeries = await fetchData(`/api/datas/collectdatas/currentseriesdata/${siteID}`);
          const temperatureSeries = new Array(currentSeries.timeSeries.length).fill(0)
          setTopMiddleDiagram(topMiddleDiagram => {
              return {...topMiddleDiagram, currentSeries: currentSeries, temperatureSeries: temperatureSeries}
          })
          /* 更新 bottomMiddleDiagram */
          const pueSeries = await fetchData(`/api/datas/collectdatas/pueseriesdata/${siteID}`);
          setBottomMiddleDiagram(bottomMiddleDiagram => {
              return {...bottomMiddleDiagram, pueSeries: pueSeries}
          })

      }
      const realTimeDatasIntervalId = setInterval(fetchRealTimeDatas, 15000);

      return () => clearInterval(realTimeDatasIntervalId);

    }, [])


  // jsx代码块==================begin
  const SearchTableBar = (
      <div id="select-group-channel-tablebar"
           className={/* 控制查询框显示*/uiState.displaySearchTableBar? "" : "select-group-channel-tablebar"}>
          <div className="row">
              <div className="col-sm-2  col-md-2 pd"
                   style={{color: '#fff', height: '40px', lineHeight: '35px', marginTop: '15px',
                       textAlign: 'right', width: '110px', fontSize: '15px'}}>地域选择：
              </div>
              <div className="col-sm-4  col-md-4 pd" style={{height:'40px',marginTop:'15px'}}>
                  <input type="text" id="selectCity" name="cityCode" className="form-control"
                         style={{width: '150px'}} />
              </div>
              <div className="col-sm-2  col-md-2 pd"
                   style={{color:'#fff', height:'40px', lineHeight:'35px', marginTop:'15px',
                       textAlign:'right', width:'110px', fontSize:'15px'}}>区域选择：
              </div>
              <div className="col-sm-4  col-md-4 pd" style={{height: '40px', marginTop: '15px'}}>
                  <input type="text" id="selectCounty" name="countyCode" className="form-control"
                         style={{width:'150px'}} />
              </div>
          </div>
          <div className="row">
              <div className="col-sm-2  col-md-2 pd"
                   style={{color:'#fff',height:'40px',lineHeight:'35px',marginTop:'15px',
                       textAlign:'right',width:'110px',fontSize:'15px'}}>渠道名称：
              </div>
              <div className="col-sm-6  col-md-6 pd" style={{height:'40px',marginTop:'15px'}}>
                  <input type="text" id="channel_name" name="channelName" className="form-control"
                         style={{width:'330px'}} placeholder=""/>
              </div>
              <div className="col-sm-4  col-md-4 pd"
                   style={{height:'40px',marginTop:'15px',textAlign:'center'}}>
                  <button type="button" className="btn btn-info btn-sm"
                          style={{height:'35px',width:'70px',marginLeft:'10px',background:'#181C41'}}
                          onClick="doQueryChannelName();">查询
                  </button>
                  <button type="button" className="btn btn-info btn-sm"
                          style={{height:'35px',width:'70px',background:'#282C55'}} onClick="doRestChannelName();">重置
                  </button>
              </div>
          </div>
      </div>
  )

    // jsx代码块==================end

  return (
    <>
        <div className="container-fluid container-bg office-efficiency-index">
            <div className="row  office-header">
                <div className="col-sm-12 col-md-12 pd  title-info">
                    {station.name} <NavLink to='/'>能耗综合分析</NavLink>
                </div>
                <div className="col-sm-5  col-md-5 pd analysis-info">{energyData.alarm}</div>
                <div className="col-sm-7  col-md-7 pd analysis-filter">
                    <table style={{width: '100%', height: '48px'}}>
                        <tbody>
                            <tr>
                                <td style={{width: '70%', textAlign: 'right'}}>
                                </td>
                                <td style={{width: '15%', textAlign: 'right', paddingLeft: '10px',
                                    color: '#fff', fontSize: '14px', fontWeight: 'bold'}}
                                    id="td-data-date">
                                    {uiState.timeTitle}
                                </td>
                                <td style={{width: '15%'}}>
                                    <div className="cust-type-default right"
                                         onClick={() => navigate(`/history/station/${siteID}/${meterID}`)} type="2">历史分析</div>
                                    <div className="cust-type-default left active" type="1">实时监测</div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {SearchTableBar}
            </div>
            {/* ------------------------------------------------------------------------- */}
            <div className="row  office-header-content">
                <div className="col-sm-3 col-md-3 pd">
                    <Energy energyData={energyData}/>
                </div>
                <div className="col-sm-6 col-md-6 pd">
                    <TopMiddleDiagram station={station} diagramData={topMiddleDiagram}/>
                </div>
                <div className="col-sm-3 col-md-3 pd device-info-col">
                    <PUE pueData={pueData} />
                </div>
                <div className="col-sm-3 col-md-3 pd">
                    <StationInfo stationInfoData={stationInfoData} />
                </div>
                <div className="col-sm-5 col-md-5 pd time-step-col">
                    <BottomMiddleDiagram station={station} diagramData={bottomMiddleDiagram} />
                </div>
                <div className="col-sm-4 col-md-4 pd business-type-time-col">
                    <BottomRightDiagram diagramData={{title: "空调运行同比分析", data: mockData.timeStepAnalysis}} />
                </div>
            </div>

        </div>
    </>
  )
}

export default StationMonitor
