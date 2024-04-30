import {useEffect} from "react";


export default function BottomRightDiagram ({ diagramData } ) {
    const { title, data } = diagramData
    useEffect(() => {
        const option = {
            tooltip: {trigger: 'axis',},
            grid: {left:'6%',right: '5%',bottom:'10%'},
            legend: {
                icon: 'rect',
                itemWidth: 14,itemHeight: 5,itemGap:10,
                data:data.legendArr,
                left: '10px',top: '0px',
                textStyle: {fontSize: 12,color: '#fff'}
            },
            xAxis: [
                {
                    type: 'category',
                    axisLine: {lineStyle: {color: '#57617B'}},axisLabel: {interval:0,textStyle: {color:'#fff',}},
                    data:data.categoryArr
                }
            ],
            yAxis: [{
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {lineStyle: {color: '#57617B'}},
                axisLabel: {margin: 0,textStyle: {fontSize: 12, color:'#fff'},formatter:'{value}时'},
                splitLine: {
                    show: true,
                    lineStyle:{
                        type:'dashed',
                        color: ['#25CEF3']
                    }
                }

            }],
            series: [
                {
                    name:'2022',
                    type:'bar',
                    barWidth:8,
                    itemStyle : {
                        normal: {
                            barBorderRadius:[10, 10, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                offset: 0,
                                color: "#009AFD"
                            }, {
                                offset: 0.8,
                                color: "#33DAFF"
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                    data:data.channelTime
                },
                {
                    name:'2023',
                    type:'bar',
                    barWidth:8,
                    barGap:2,
                    itemStyle : {
                        normal: {
                            barBorderRadius:[10, 10, 0, 0],
                            color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                offset: 0,
                                color: "#E57230"
                            }, {
                                offset: 0.8,
                                color: "#D8AE22"
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                    data:data.provinceTime
                }
            ]
        };
        const myChart = echarts.init(document.getElementById('business-type-time-detial'));
        myChart.clear();
        myChart.setOption(option);

    }, [title])
    return (
        <div className="col-info">
            <div className="title">{title}</div>
            <div className="content" id="business-type-time-detial"></div>
        </div>
    )
}