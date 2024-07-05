import {useEffect} from "react";
import {fetchData, getRealTimedatasById} from "../../Service/getDatas";


export default function TopMiddleDiagram ({ station, diagramData } ) {
    const {siteID} = station;
    const { title, currentSeries, temperatureSeries } = diagramData
    useEffect(() => {
        console.log(diagramData)
        const option = {
            tooltip: {trigger: 'axis',axisPointer: {lineStyle: {color: '#fff'}}},
            legend: {
                icon: 'rect',
                itemWidth: 14,itemHeight: 5,itemGap:10,
                data: ['生产用电', '设备用电', '营业用电', '办公用电', '外租用电', '温度'],
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
                name: '生产用电',type: 'line',smooth: true,lineStyle: {normal: {width: 2}},
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
                name: '设备用电',type: 'line',smooth: true,lineStyle: {normal: {width: 2}},
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
                data: currentSeries.device//data.orderNumData
            }, {
                name: '营业用电',type: 'line',smooth: true,lineStyle: { normal: {width: 2}},
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
                data: currentSeries.business//data.lineUpData
            }, {
                name: '办公用电',type: 'line',smooth: true,lineStyle: {normal: {width: 2}},
                yAxisIndex:1,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(30, 144, 255, 0.3)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(30, 144, 255, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {normal: {color: '#1E90FF'}},
                data: currentSeries.office//data.orderNumData
            },{
                name: '外租用电',type: 'line',smooth: true,lineStyle: {normal: {width: 2}},
                yAxisIndex:1,
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
            }, {
                name: '温度',type: 'line',smooth: true,lineStyle: {normal: {width: 2}},
                yAxisIndex:0,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(34, 139, 34, 0.3)'
                        }, {
                            offset: 0.8,
                            color: 'rgba(34, 139, 34, 0)'
                        }], false),
                        shadowColor: 'rgba(0, 0, 0, 0.1)',
                        shadowBlur: 10
                    }
                },
                itemStyle: {normal: {color: '#228B22'}},
                data: temperatureSeries//data.custNumData
            }]


        };
        const myChart = echarts.init(document.getElementById('channel_handle_detail'));
        myChart.clear();
        myChart.setOption(option);

        //const randomx = () => Math.floor(Math.random() * 7);
        //const iconx = ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow']
       /* const fetchDiagramData =  async () => {
            const data = await fetchData(`/api/datas/collectdatas/currentseriesdata/${siteID}`);
            console.log("CURRENTSERIESDATA: \n", data)

            //option.xAxis[0].data = data.timeSeries;
            option.series[0].data = data.product;
            option.series[1].data = data.device;
            option.series[2].data = data.office;
            option.series[3].data = data.lease;
            //console.log(option)
            //myChart.clear()
            myChart.setOption(option)
        }
        const diagramIntervalId = setInterval(fetchDiagramData, 7000);

        return () => clearInterval(diagramIntervalId);*/

    }, [currentSeries])
    return (
        <div className="col-info">
            <div className="title">{title}</div>
            <div className="content" id="channel_handle_detail"></div>
        </div>
    )
}