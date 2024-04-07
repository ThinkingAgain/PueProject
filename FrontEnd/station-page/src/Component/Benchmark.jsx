import { useEffect } from "react";

export default function Benchmark({ benchmarkData }) {
    const { currval, maxval } = benchmarkData
    useEffect(() => {
        const unit = "度"

        var option = {
            series: [{
                type: 'pie',radius: ['65%', '80%'],color: '#E63F19',label: {normal: {position: 'center'}},
                data: [{
                    value: currval,//当前值
                    name: '电量',
                    label: {normal: {formatter: currval + unit,textStyle: {fontSize: 16,color: '#FED546'}}}
                },{
                    value: maxval,//比对值
                    name: '电量',
                    label: {normal: {formatter: function (params) {return '\n生产标' },textStyle: {color: '#fff',fontSize: 13}}},
                    itemStyle: {normal: {color: 'rgba(255,255,255,.2)'},emphasis: {color: '#fff'}},
                }]
            }]
        };
        var myChart= echarts.init(document.getElementById('integral_echart'));
        myChart.clear();
        myChart.setOption(option);
    }, [currval, maxval])
    return (
        <div id="integral_echart" className="integral-echart"></div>
    )
}