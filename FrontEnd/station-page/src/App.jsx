import { useState } from 'react'
import Energy from "./Component/Energy";
import TopMiddleDiagram from './Component/TopMiddleDiagram'
import PUE from "./Component/PUE";
import StationInfo from "./Component/StationInfo";
import { data } from './mock/mockData'
import BottomMiddleDiagram from "./Component/BottomMiddleDiagram";
import BottomRightDiagram from "./Component/BottomRightDiagram";
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'


function App() {
  // 站点管理数据
  const [station, setStation] = useState({name: "朱老庄驻地机房"});
  // 能源系统数据
  const [energyData, setEnergyData] = useState(
      {
          alarm: "能耗预警: 当前异常电量超标, 超标准电量43.29%",
          period: "2024年2月 (2024.1.15-2024.2.15)",
          consumption: "5806度", //用电量
          charge: "5342元",  // 电费
          price: "0.92元",   // 电费单价
          degree: "3.96分",  // 健康度打分
          consumptionOfLastPeriod: "5434度",  // 上期电量
          consumptionOfDay: "187.31度",  // 日均电量
          produceEnergy: "4807度",   // 生产用电
          officeEnergy: "534度",    // 办公经营用电
          periodDays: "31天",   // 结算周期
          benchmarkData: {  //对标环形图数据
              currval: "4052",
              maxval: "4680",
              result: "超标43.29%",  // 对标结果
          },
      });
  // PUE数据
  const [pueData, setPueData] = useState({
      title: "动环数据",
      data: data.pueData
  })
  // 站点信息
  const [stationInfoData, setStationInfoData] = useState({
      title: "网点信息",
      data: data.stationInfo
  })
  // UI显示控制数据
  const [uiState, setUiState] = useState({displaySearchTableBar: false })

  // 测试用的方法
  const test = () => {
      const { displaySearchTableBar } = uiState
      setUiState({...uiState, displaySearchTableBar: !displaySearchTableBar})
  }

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
                <div className="col-sm-12 col-md-12 pd  title-info">{station.name}PUE分析</div>
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
                                </td>
                                <td style={{width: '15%'}}>
                                    <div className="cust-type-default right" onClick={test} type="2">监测控制</div>
                                    <div className="cust-type-default left active" type="1">PUE分析</div>
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
                    <TopMiddleDiagram diagramData={{title: "PUE数据变化情况", data: data.channelHandleInfo}}/>
                </div>
                <div className="col-sm-3 col-md-3 pd device-info-col">
                    <PUE pueData={pueData} />
                </div>
                <div className="col-sm-3 col-md-3 pd">
                    <StationInfo stationInfoData={stationInfoData} />
                </div>
                <div className="col-sm-5 col-md-5 pd time-step-col">
                    <BottomMiddleDiagram diagramData={{title: "能耗变化情况", data: data.businessTypeAnalysis}} />
                </div>
                <div className="col-sm-4 col-md-4 pd business-type-time-col">
                    <BottomRightDiagram diagramData={{title: "空调运行同比分析", data: data.timeStepAnalysis}} />
                </div>
            </div>
            
        </div>
    </>
  )
}

export default App
