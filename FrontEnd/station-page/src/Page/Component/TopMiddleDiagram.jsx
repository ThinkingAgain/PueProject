import {useEffect} from "react";
import {getRealTimedatasById} from "../../Service/getDatas";


export default function TopMiddleDiagram ({ diagramData } ) {
    const { title, data, currentSeries } = diagramData
    useEffect(() => {
        const option = {
            tooltip: {trigger: 'axis',axisPointer: {lineStyle: {color: '#fff'}}},
            legend: {
                icon: 'rect',
                itemWidth: 14,itemHeight: 5,itemGap:10,
                data: ['机房用电', '设备用电', '办公用电', '温度'],
                right: '10px',top: '0px',
                textStyle: {fontSize: 12,color: '#fff'}
            },
            grid: {x:40,y:50,x2:45,y2:40},
            xAxis: [{
                type: 'category',boundaryGap: false,axisLine: {lineStyle: {color: '#57617B'}},axisLabel: {textStyle: {color:'#fff'}},
                data: currentSeries.timeSeries//data.dataDateArr
            }],
            yAxis: [{
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {lineStyle: {color: '#57617B'}},
                axisLabel: {margin: 10,textStyle: {color:'#fff', fontSize: 12},formatter:'{value}℃'},
                splitLine: {lineStyle: {color: '#57617B'}}
            },{
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {lineStyle: {color: '#57617B'}},
                axisLabel: {margin: 10,textStyle: {color:'#fff', fontSize: 12},formatter:'{value}A'},
                splitLine: {show: false,lineStyle: {color: '#57617B'}}
            }],
            series: [{
                name: '机房用电',type: 'line',smooth: true,lineStyle: {normal: {width: 2}},
                yAxisIndex:1,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(185,150,248,0.3)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(185,150,248,0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {normal: { color: '#B996F8'}},
                data: currentSeries.product//data.handleTimeData
            }, {
                name: '设备用电',type: 'line',smooth: true,lineStyle: { normal: {width: 2}},
                yAxisIndex:1,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(3, 194, 236, 0.3)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(3, 194, 236, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {normal: {color: '#03C2EC'}},
                data: currentSeries.device//data.lineUpData
            }, {
                name: '办公用电',type: 'line',smooth: true,lineStyle: {normal: {width: 2}},
                yAxisIndex:1,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(218, 57, 20, 0.3)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(218, 57, 20, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {normal: {color: '#DA3914'}},
                data: currentSeries.office//data.orderNumData
            },{
                name: '温度',type: 'line',smooth: true,lineStyle: {normal: {width: 2}},
                yAxisIndex:0,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(232, 190, 49, 0.3)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(232, 190, 49, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {normal: {color: '#E8BE31'}},
                data: currentSeries.lease//data.custNumData
            }]


        };
        const myChart = echarts.init(document.getElementById('channel_handle_detail'));
        myChart.clear();
        myChart.setOption(option);

        //const randomx = () => Math.floor(Math.random() * 7);
        //const iconx = ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow']
        const fetchDiagramData =  () => {
            //const data = await getRealTimedatasById(siteID);

            //const x = randomx();
            //option.legend.icon = iconx[x]
            console.log(option)
            //myChart.clear()
            myChart.setOption(option)
        }
        const diagramIntervalId = setInterval(fetchDiagramData, 10000);

        return () => clearInterval(diagramIntervalId);

    }, [title])
    return (
        <div className="col-info">
            <div className="title">{title}</div>
            <div className="content" id="channel_handle_detail"></div>
        </div>
    )
}