import Benchmark from "./Benchmark";

export default function Energy({ energyData }) {
    const { consumption, charge, price, degree, consumptionOfLastPeriod, consumptionOfDay,
        produceEnergy, officeEnergy, periodDays, benchmarkData } = energyData
    return (
        <div className="col-info">
            <div className="title">电费信息</div>
            <div className="content base-info" id="base-info">
                <table>
                    <tr>
                        <td colSpan={4}>
                            <div className="channel-name">报账月份: {energyData.period}</div>
                        </td>
                    </tr>
                    <tr>
                        <td rowSpan={2}>
                            <Benchmark benchmarkData={benchmarkData}/>
                        </td>
                        <td><div className="ding-dan-bg"></div></td>
                        <td><div className="ke-liu-bg"></div></td>
                        <td><div className="pai-dui-ji-bg"></div></td>
                    </tr>
                    <tr>
                        <td>
                            <div className="liang-shu-zhi" type="dingdanVal">{consumption}</div>
                        </td>
                        <td>
                            <div className="liang-shu-zhi" type="custNumVal">{charge}</div>
                        </td>
                        <td>
                            <div className="liang-shu-zhi" type="lineUpVal">{price}</div>
                        </td>
                    </tr>
                    <tr className="td-shu-zhi">
                        <td className="popval">{benchmarkData.result}</td>
                        <td>本期电量</td>
                        <td>报账电费</td>
                        <td>本期单价</td>
                    </tr>
                    <tr>
                        <td>
                            <div className="channel-star-level">能耗健康度</div>
                        </td>
                        <td colSpan="3" className="chanenl-star">
                            <img src="./static/images/star1.png" style={{width:"21px", height:"20px"}} />
                            <img src="./static/images/star1.png" style={{width:"21px", height:"20px"}} />
                            <img src="./static/images/star1.png" style={{width:"21px", height:"20px"}} />
                            <div className="channel-total-score">{degree}</div>
                        </td>
                    </tr>
                    <tr>
                        <td className="label-name">上期电量：</td>
                        <td className="label-value  device-score">
                            <img src="./static/images/star2.png"/>
                            <div className="score-val">{consumptionOfLastPeriod}</div>
                        </td>
                        <td className="label-name">日均电量：</td>
                        <td className="label-value avgtime">
                            <img src="./static/images/star2.png"/>
                            <div className="score-val">{consumptionOfDay}</div>
                        </td>
                    </tr>
                    <tr>
                        <td className="label-name">生产用电：</td>
                        <td className="label-value weigui">
                            <img src="./static/images/star1.png"/>
                            <div className="score-val">{produceEnergy}</div>
                        </td>
                        <td className="label-name">办公经营：</td>
                        <td className="label-value yingxiao">
                            <img src="./static/images/star1.png"/>
                            <div className="score-val">{officeEnergy}</div>
                        </td>
                    </tr>
                    <tr>
                        <td className="label-name">结算周期：</td>
                        <td className="label-value yewuliang">
                            <img src="./static/images/star2.png"/>
                            <div className="score-val">{periodDays}</div>
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
            </div>
        </div>
    )
}