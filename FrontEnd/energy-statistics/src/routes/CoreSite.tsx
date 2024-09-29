import { Card, Row, Col } from 'antd'
import EChart from "./components/EChart.tsx";
import { fakeGridLinesOption, fakeGridPiesOption } from "../service/fake/fakeEchartDatas.ts";

const sunData =
    [
        {
            name: '生产',
            value: 924.9,
            children: [
                {
                    name: '动力源配电屏',
                    value: 252.9,
                },
                {
                    name: '华为配电屏',
                    value: 207.0,
                },

                {
                    name: '艾默生配电屏',
                    value: 326.8,
                },

            ]
        },
        {
            name: '办公',
            value: 118.2,
            children: [
                {
                    name: '食堂',
                    value: 42.0,
                },
                {
                    name: '办公楼',
                    value: 61.4,
                },

            ]
        },

        {
            name: '营业',
            value: 52.1,
            children: [
                {
                    name: '营业大厅',
                    value: 39.3,
                },
                {
                    name: '营业空调',
                    value: 12.8,
                },

            ]
        },

        {
            name: '外租',
            value: 457.6,
            children: [

                {
                    name: '大数据局',
                    value: 448.4,
                    children: [
                        {
                            name: '数据局机房',
                            value: 261.0,
                        },
                        {
                            name: '数据局办公',
                            value: 187.4,
                        },
                    ]
                },

            ]
        },



    ]


const option2 = {
    title: {
        text: '能耗分布'
    },
    silent: false,
    tooltip: {
        trigger: 'item',
        valueFormatter: (value: number) => ((value * 100) / 1552.8).toFixed(1) + '%'
    },
    series: [
        {
            radius: ['20%', '100%'],
            type: 'sunburst',
            sort: undefined,

            emphasis: {
                focus: 'ancestor'
            },
            data: sunData,
            /*label: {
                color: '#000',
                textBorderColor: '#fff',
                textBorderWidth: 2,
                formatter: function (param) {
                    var depth = param.treePathInfo.length;
                    if (depth === 2) {
                        return 'radial';
                    } else if (depth === 3) {
                        return 'tangential';
                    } else if (depth === 4) {
                        return '0';
                    }
                    return '';
                }
            },*/
            label:{
                rotate: 'radial'
            },
            /*levels: [
                {},
                {
                    itemStyle: {
                        color: '#CD4949'
                    },
                    label: {
                        rotate: 'radial'
                    }
                },
                {
                    itemStyle: {
                        color: '#F47251'
                    },
                    label: {
                        rotate: 'tangential'
                    }
                },
                {
                    itemStyle: {
                        color: '#FFC75F'
                    },
                    label: {
                        rotate: 0
                    }
                }
            ]*/
        }
    ]
};

const data = {
    nodes: [
        {name: '总电流', depth: 0},
        {name: '生产', depth: 1},
        {name: '办公', depth: 1},
        {name: '营业', depth: 1},
        {name: '外租', depth: 1},
        {name: '动力源配电屏', depth: 2},
        {name: '华为配电屏', depth: 2},
        {name: '洲际配电屏', depth: 2},
        {name: '艾默生配电屏', depth: 2},
        {name: '食堂', depth: 2},
        {name: '中央空调', depth: 2},
        {name: '办公楼', depth: 2},
        {name: '营业大厅', depth: 2},
        {name: '营业空调', depth: 2},
        {name: '工商局', depth: 2},
        {name: '大数据局', depth: 2},
        {name: '大数据局机房', depth: 3},
        {name: '大数据局办公', depth: 3}
    ],
    links: [
        {
            source: '总电流',
            target: '生产',
            value: 924.9
        },
        {
            source: '总电流',
            target: '办公',
            value: 118.2
        },
        {
            source: '总电流',
            target: '营业',
            value: 52.1
        },
        {
            source: '总电流',
            target: '外租',
            value: 457.6
        },
        {
            source: '生产',
            target: '动力源配电屏',
            value: 252.9
        },
        {
            source: '生产',
            target: '华为配电屏',
            value: 207.0
        },
        {
            source: '生产',
            target: '洲际配电屏',
            value: 15.2
        },
        {
            source: '生产',
            target: '艾默生配电屏',
            value: 326.8
        },
        {
            source: '办公',
            target: '食堂',
            value: 42.0
        },
        {
            source: '办公',
            target: '中央空调',
            value: 14.5
        },
        {
            source: '办公',
            target: '办公楼',
            value: 61.4
        },
        {
            source: '营业',
            target: '营业大厅',
            value: 39.3
        },
        {
            source: '营业',
            target: '营业空调',
            value: 12.8
        },
        {
            source: '外租',
            target: '工商局',
            value: 9.2
        },
        {
            source: '外租',
            target: '大数据局',
            value: 448.4
        },
        {
            source: '大数据局',
            target: '大数据局机房',
            value: 261.0
        },
        {
            source: '大数据局',
            target: '大数据局办公',
            value: 187.4
        },

    ]
}
const option = {
    title: {
        text: '能源流动'
    },
    tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
    },
    series: [
        {
            type: 'sankey',
            data: data.nodes,
            links: data.links,
            emphasis: {
                focus: 'trajectory'
            },
           /* levels: [
                {
                    depth: 0,
                    itemStyle: {
                        color: '#fbb4ae'
                    },
                    lineStyle: {
                        color: 'source',
                        opacity: 0.6
                    }
                },
                {
                    depth: 1,
                    itemStyle: {
                        color: '#b3cde3'
                    },
                    lineStyle: {
                        color: 'source',
                        opacity: 0.6
                    }
                },
                {
                    depth: 2,
                    itemStyle: {
                        color: '#ccebc5'
                    },
                    lineStyle: {
                        color: 'source',
                        opacity: 0.6
                    }
                },
                {
                    depth: 3,
                    itemStyle: {
                        color: '#decbe4'
                    },
                    lineStyle: {
                        color: 'source',
                        opacity: 0.6
                    }
                }
            ],*/
            lineStyle: {
                color: 'gradient',
                curveness: 0.5
            }
        }
    ]
}

export const CoreSite = () => {
    return (
        <>
            <Card className="mb-12" id="overview">
                <Row >
                    <Col xl={19} lg={12} md={12} sm={24} xs={24} >
                        <div className="h-[27rem] p-0">
                            <EChart option={option}  />
                        </div>
                    </Col>
                    <Col xl={5} lg={12} md={12} sm={24} xs={24}>
                        <div className="h-[27rem] p-0">
                            <EChart option={option2} />
                        </div>
                    </Col>
                </Row>
            </Card>
            <Card className="mb-4" id="grid-charts">
                <Row >
                    <Col xl={15} lg={12} md={12} sm={24} xs={24} >
                        <div className="h-[30rem] p-0">
                            <EChart option={fakeGridLinesOption}  />
                        </div>
                    </Col>
                    <Col xl={9} lg={12} md={12} sm={24} xs={24}>
                        <div className="h-[30rem] p-0">
                            <EChart option={fakeGridPiesOption} />
                        </div>
                    </Col>
                </Row>
            </Card>
        </>
    )
}

export default CoreSite