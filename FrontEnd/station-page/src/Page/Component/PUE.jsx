import {useEffect} from "react";

export default function PUE({ pueData }) {
    const { title, data, realTimeData } = pueData
    //console.log("data: \n", data)
    //console.log("realtimedata: \n", realTimeData)
    useEffect(() => {
        const mySwiper1 = new Swiper('.visual_swiper_deviceInfo', {
            //autoplay: true,//可选选项，自动滑动
            speed:1500,//可选选项，滑动速度
            autoplay: {
                delay: 15000,//毫秒
            }
        });
    }, [])

    return (
        <div className="col-info">
            <div className="title">{title}</div>
            <div className="title-icon">
                <div className="device-alarm">
                    <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icongaojing2"></use>
                    </svg>
                    <span type="grayGrade">{data.Ub}</span></div>
                <div className="device-alarm">
                    <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icongaojing1"></use>
                    </svg>
                    <span type="redGrade">{data.Uc}</span></div>
                <div className="device-alarm">
                    <svg className="icon" aria-hidden="true">
                        <use xlinkHref="#icongaojing"></use>
                    </svg>
                    <span type="greenGrade">{data.Ua}</span></div>
            </div>
            <div className="content deviceInfo" id="device-info">
                <div className='swiper-container visual_swiper_deviceInfo'>
                    <div className='swiper-wrapper'>
                        {data.deviceInfo &&
                            data.deviceInfo.map((item) =>
                                <div className="swiper-slide">
                                    <table>
                                        <tr>
                                            <td rowSpan="3" className="device-img">
                                                <img src="/static/images/device-green.png"/>
                                            </td>
                                            <td>
                                                <div className="label-name"><b>P • U • E</b></div>
                                            </td>
                                            <td rowSpan="3" colSpan="2" className="kuan-dai">
                                                <div className="progress-label">机房配电输入电流 {realTimeData.tagCurrents.PRODUCT.toFixed(1)}A</div>
                                                <div style={{width:'180px', height:'15px'}}>
                                                    <div className="progress"
                                                         style={{float:'left', height:'8px', width:'180px', backgroundColor:'#383E60'}}>
                                                        <div className="progress-bar progress-bar-striped"
                                                             style={{minWidth:0, width:'100%'}}></div>
                                                    </div>
                                                </div>
                                                <div className="progress-label">开关电源输入电流 {realTimeData.tagCurrents.DEVICE.toFixed(1)}A</div>
                                                <div style={{width:'180px', height:'15px'}}>
                                                    <div className="progress"
                                                         style={{float:'left', height:'8px', width:'180px', backgroundColor:'#383E60'}}>
                                                        <div className="progress-bar progress-bar-striped"
                                                             style={{minWidth:0, width:`${realTimeData.tagCurrents.DEVICE * 100 / realTimeData.tagCurrents.PRODUCT}%`}}></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="label-name score">{realTimeData.tagCurrents.PUE.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td className="label-name">
                                                <div className="os-name" title={item.osName || "--"}>
                                                    {item.osName || "--"}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr className="device-use">
                                            <td></td>

                                            <td>
                                                <div className="nei-cun-size">
                                                    <span>{`${(realTimeData.proportions.PRODUCT * 100).toFixed(1)}%` || 0}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cpu-use">
                                                    <span>{`${(realTimeData.proportions.BUSINESS * 100).toFixed(1)}%` || 0}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="nei-cun-use">
                                                    <span>{`${(realTimeData.proportions.OFFICE * 100).toFixed(1)}%` || 0}</span>
                                                </div>
                                            </td>
                                           {/* <td>
                                                <div className="nei-cun-use">
                                                    <span>{`${(realTimeData.proportions.LEASE * 100).toFixed(1)}%` || 0}</span>
                                                </div>
                                            </td>*/}

                                        </tr>
                                        <tr>
                                             <td></td>

                                            <td>
                                                <div className="labe-value">&nbsp;&nbsp;生 产 耗 能</div>
                                            </td>
                                            <td>
                                                <div className="labe-value">&nbsp;&nbsp;营 业 耗 能</div>
                                            </td>
                                            <td>
                                                <div className="labe-value">&nbsp;&nbsp;办 公 耗 能</div>
                                            </td>
                                            {/*<td>
                                                <div className="labe-value">&nbsp;&nbsp;外 租 耗 能</div>
                                            </td>*/}

                                        </tr>
                                        <tr className="device-use">
                                             <td></td>

                                            {/*<td>
                                                <div className="nei-cun-size"><span>{item.outsideTemperature || 0}</span></div>
                                            </td>*/}
                                            <td>
                                                <div className="nei-cun-size"><span>{item.temperature || 0}</span></div>
                                            </td>
                                            <td>
                                                <div className="cpu-use"><span>{item.humidity || 0}</span></div>
                                            </td>
                                            <td>
                                                <div className="nei-cun-use">
                                                    <span>{item.airConditionerStatus}</span></div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            {/*<td>
                                            <div className="labe-value">&nbsp;&nbsp;室 外 温 度</div>
                                            </td>*/}
                                            <td>
                                                <div className="labe-value">&nbsp;&nbsp;机 房 温 度</div>
                                            </td>
                                            <td>
                                                <div className="labe-value">&nbsp;&nbsp;机 房 湿 度</div>
                                            </td>
                                            <td>
                                                <div className="labe-value">&nbsp;&nbsp;空 调 状 态</div>
                                            </td>
                                        </tr>
                                    </table>
                                </div>)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}