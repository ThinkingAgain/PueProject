import {useEffect} from "react";


export default function BottomMiddleDiagram ({ diagramData } ) {
    const { title, data } = diagramData
    useEffect(() => {
        const option = {
            title : {text:'',subtext:'',top:'3',right:'0'},
            tooltip: {trigger: 'axis'},
            grid: {left: '8%',right: '8%',bottom: '10%'},
            xAxis: {type: 'category',axisLine: {lineStyle: {color: '#57617B'}},axisLabel: {interval:0,textStyle: {color:'#fff',}},data: data.categoryArr},
            yAxis:[
                {
                    type: 'value',name: '',
                    axisLine: {lineStyle: {color: '#57617B'}},
                    axisLabel: {margin: 10,textStyle: {fontSize: 12, color:'#fff'},formatter:'{value}度'},
                    splitLine: {show: false}
                },
                {
                    type: 'value',name: '',max:9000,min: 3000,
                    axisLabel: {margin: 10,textStyle: {fontSize: 12, color:'#fff'},formatter:'{value}元'},
                    splitLine: {
                        show: true,
                        lineStyle:{
                            type:'dashed',
                            color: ['#25CEF3']
                        }
                    }
                }
            ],
            series: [
                {
                    name:'日均电量',
                    type:'line',
                    yAxisIndex:0,
                    smooth: false,
                    symbolSize:5,
                    lineStyle: { normal: {width: 2}},
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(230, 48, 123, 0.8)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(230, 48, 123, 0)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                            shadowBlur: 10
                        }
                    },
                    itemStyle: {normal: { color: '#DA2F78'}},
                    data:data.avgTime
                },
                {
                    name:'报账电费',
                    type:'bar',
                    barWidth:12,
                    yAxisIndex:1,
                    itemStyle : {
                        normal: {
                            barBorderRadius:[10, 10, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                offset: 0,
                                color: "#4033F9"
                            }, {
                                offset: 0.8,
                                color: "#BA97F9"
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                    data:data.orderNum
                }
            ]
        };
        const myChart = echarts.init(document.getElementById('time-step-detial'));
        myChart.clear();
        myChart.setOption(option);

    }, [title])
    return (
        <div className="col-info">
            <div className="title">{title}</div>
            <div className="content" id="time-step-detial"></div>
        </div>
    )
}