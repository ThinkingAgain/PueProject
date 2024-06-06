import {useEffect} from "react";
import {fetchData} from "../../Service/getDatas.jsx";


export default function BottomMiddleDiagram ({ station, diagramData } ) {
    const {siteID} = station;
    const { title, data, pueSeries } = diagramData
    useEffect(() => {
        const option = {
            title : {text:'',subtext:'',top:'3',right:'0'},
            legend: {
                icon: 'rect',
                itemWidth: 14,itemHeight: 5,itemGap:10,
                data: ['PUE', '设备用电'],
                right: '10px',top: '0px',
                textStyle: {fontSize: 12,color: '#fff'}
            },
            tooltip: {trigger: 'axis'},
            grid: {left: '8%',right: '8%',bottom: '10%'},
            xAxis: {
                type: 'category',
                axisLine: {lineStyle: {color: '#57617B'}},
                axisLabel: {textStyle: {color:'#fff',}},
                data: pueSeries.timeSeries//data.categoryArr
            },
            yAxis:[
                {
                    type: 'value',name: '', //max:1.6,min: 0.6,
                    axisLine: {lineStyle: {color: '#57617B'}},
                    axisLabel: {margin: 10,textStyle: {fontSize: 12, color:'#fff'},formatter:'{value}'},
                    splitLine: {show: false}
                },
                {
                    type: 'value',name: '',// max:200,min: 0,
                    axisLabel: {margin: 10,textStyle: {fontSize: 12, color:'#fff'},formatter:'{value}A'},
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
                    name:'PUE',
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
                    data: pueSeries.pue//data.avgTime
                },
                {
                    name:'设备用电',
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
                    data: pueSeries.device//data.orderNum
                }
            ]
        };
        const myChart = echarts.init(document.getElementById('time-step-detial'));
        myChart.clear();
        myChart.setOption(option);

        /* 定时更新 */
        const fetchDiagramData =  async () => {
            const data = await fetchData(`/api/datas/collectdatas/pueseriesdata/${siteID}`);
            //console.log(data)

            //option.xAxis[0].data = data.timeSeries;
            option.series[0].data = data.pue;
            option.series[1].data = data.device;
            //console.log(option)
            //myChart.clear()
            myChart.setOption(option)
        }
        const diagramIntervalId = setInterval(fetchDiagramData, 11000);

        return () => clearInterval(diagramIntervalId);



    }, [title])
    return (
        <div className="col-info">
            <div className="title">{title}</div>
            <div className="content" id="time-step-detial"></div>
        </div>
    )
}