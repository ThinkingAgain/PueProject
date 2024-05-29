import {useEffect} from "react";

export default function StationInfo({ stationInfoData }) {
    const { title, data } = stationInfoData

    useEffect(() => {
        const mySwiperStationInfo = new Swiper('.visual_swiper_staffInfo', {
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
            <div className="content staff-info" id="staff-info">
                <div className='swiper-container visual_swiper_staffInfo'>
                    <div className='swiper-wrapper' >
                        {data.staffHandleInfo &&
                        data.staffHandleInfo.map((item, index) =>
                            <div id={"stationInfoMap" + index} className="swiper-slide">
                                <table>
                                    {/* tr1=========================*/}
                                    <tr className="td-avg-time">
                                        <td colSpan="3">
                                            <div className={`index  + ${index === 0 ? "first" : ""}`}>{item[0].index}</div>
                                            <div className="staff-name">{item[0].staffName}</div>
                                            <div className="avg-time-label">|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我方</div>
                                            <div className="avg-time-value">{item[0].unicom}</div>
                                            <div className="avg-time-label">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;移动</div>
                                            <div className="avg-time-value">{item[0].mobil}</div>
                                            <div className="avg-time-label">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;电信</div>
                                            <div className="avg-time-value">{item[0].tele}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="staff-cust-time">
                                                <span style={{fontSize:'15px'}}>{item[0].powerTypeLabel}</span>
                                                <br/>
                                                <span style={{color:'#00A8FE',fontSize:'18px',fontWeight:600,whiteSpace:"nowrap", overflow:"hidden"}}>{item[0].powerType}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="staff-order-count">
                                                <span style={{fontSize:'15px'}}>{item[0].siteTypeLabel}</span>
                                                <br/>
                                                <span style={{color:'#00A8FE',fontSize:'18px',fontWeight:600}}>{item[0].siteType}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="staff-alarm">
                                                <span style={{fontSize:'15px'}}>{item[0].ownerInfoLabel}</span>
                                                <br/>
                                                <span style={{color:'#00A8FE',fontSize:'18px',fontWeight:600}}>{item[0].ownerInfo}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="td-integral">
                                        <td colSpan="3">
                                            <div className="integral-label">站点ID：</div>
                                            <div className="integral-value">{item[0].siteId}</div>
                                            <div className="integral-label" style={{width:'60px'}}>电表ID:</div>
                                            <div className="integral-value" style={{width:'100px'}}>{item[0].meterId}</div>
                                        </td>
                                    </tr>

                                    {/*tr2=================*/}
                                    <tr>
                                        <td colSpan="3">
                                            <div className="split-line"></div>
                                        </td>
                                    </tr>
                                    <tr className="td-avg-time">
                                        <td colSpan="3">
                                            <div className={`index  + ${index === 0 ? "second" : ""}`}>{item[1].index}</div>
                                            <div className="staff-name">{item[1].staffName}</div>
                                            <div className="avg-time-label">|&nbsp;&nbsp;{item[1].siteName}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="staff-cust-time">
                                                <span style={{fontSize:'15px'}}>{item[1].departmentLabel}</span>
                                                <br/>
                                                <span style={{color:'#00A8FE',fontSize:'18px',fontWeight:600, whiteSpace:"nowrap", overflow:"hidden"}}>{item[1].department}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="staff-order-count">
                                                <span style={{fontSize:'15px'}}>{item[1].maintainerLabel}</span>
                                                <br/>
                                                <span style={{color:'#00A8FE',fontSize:'18px',fontWeight:600, whiteSpace:"nowrap", overflow:"hidden"}}>{item[1].maintainer}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="staff-alarm">
                                                <span style={{fontSize:'15px'}}>{item[1].mphoneLabel}</span>
                                                <br/>
                                                <span style={{color:'#00A8FE',fontSize:'18px',fontWeight:600}}>{item[1].mphone}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className="td-integral">
                                        <td colSpan="3">
                                            <div className="integral-label">站址编码：</div>
                                            <div className="integral-value" style={{overflow:"hidden"}}>{item[1].siteCode}</div>
                                            <div className="integral-label" style={{width:'60px'}}>能耗状态:</div>
                                            <div className="integral-value"
                                                 style={{width:'100px'}}>&nbsp;&nbsp;{item[1].powerStatus}
                                            </div>
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