import { outlineCurrentsData } from "./hugeData.ts";


const sizeValue = '57%';
const symbolSize = 2.5;
export const fakeGridLinesOption = {
    title: {
        text: '24小时能耗变化'
    },
    legend: {show: false},
    tooltip: {trigger: "axis"},
    toolbox: {
        left: 'center',
        feature: {
            dataZoom: {}
        }
    },
    grid: [
        { right: sizeValue, bottom: sizeValue },
        { left: sizeValue, bottom: sizeValue },
        { right: sizeValue, top: sizeValue },
        { left: sizeValue, top: sizeValue }
    ],
    xAxis: [
        {
            type: 'category',
            gridIndex: 0,
            name: '时间',
            axisLabel: { rotate: 50, interval: 3 }
        },
        {
            type: 'category',
            gridIndex: 1,
            name: '时间',
            boundaryGap: false,
            axisLabel: { rotate: 50, interval: 3 }
        },
        {
            type: 'category',
            gridIndex: 2,
            name: '时间',
            axisLabel: { rotate: 50, interval: 3 }
        },
        {
            type: 'category',
            gridIndex: 3,
            name: '时间',
            axisLabel: { rotate: 50, interval: 3 }
        }
    ],
    yAxis: [
        { type: 'value', gridIndex: 0, name: '生产电流' },
        { type: 'value', gridIndex: 1, name: '外租电流' },
        { type: 'value', gridIndex: 2, name: '营业电流' },
        { type: 'value', gridIndex: 3, name: '办公电流' }
    ],
    dataset: {
        dimensions: [
            '时间', '总电流', '生产', '办公', '营业', '外租', '动力源配电屏', '华为配电屏', '洲际配电屏', '艾默生配电屏', '食堂', '中央空调', '办公楼', '营业大厅', '营业空调', '工商局', '大数据局', '大数据局机房', '大数据局办公'
        ],
        source: outlineCurrentsData
    },
    series: [
        // 生产 ---
        {
            type: 'line',
            name: '动力源配电屏',
            symbolSize: symbolSize,
            xAxisIndex: 0,
            yAxisIndex: 0,
            encode: {
                x: '时间',
                y: '动力源配电屏',
               // tooltip: ['生产', '动力源配电屏', '华为配电屏', '洲际配电屏', '艾默生配电屏']
            }
        },
        {
            type: 'line',
            name: '华为配电屏',
            symbolSize: symbolSize,
            xAxisIndex: 0,
            yAxisIndex: 0,
            encode: {
                x: '时间',
                y: '华为配电屏',
                //tooltip: ['生产', '动力源配电屏', '华为配电屏', '洲际配电屏', '艾默生配电屏']
            }
        },
        {
            type: 'line',
            name: '洲际配电屏',
            symbolSize: symbolSize,
            xAxisIndex: 0,
            yAxisIndex: 0,
            encode: {
                x: '时间',
                y: '洲际配电屏',
                //tooltip: ['生产', '动力源配电屏', '华为配电屏', '洲际配电屏', '艾默生配电屏']
            }
        },
        {
            type: 'line',
            name: "艾默生配电屏",
            symbolSize: symbolSize,
            xAxisIndex: 0,
            yAxisIndex: 0,
            encode: {
                x: '时间',
                y: '艾默生配电屏',
               // tooltip: ['生产', '动力源配电屏', '华为配电屏', '洲际配电屏', '艾默生配电屏']
            }
        },

        // 外租 ------

        {
            type: 'line',
            name: '大数据局机房',
            symbolSize: symbolSize,
            xAxisIndex: 1,
            yAxisIndex: 1,
            encode: {
                x: '时间',
                y: '大数据局机房',
                //tooltip: ['大数据局机房', '大数据局办公', '工商局']
            }
        },
        {
            type: 'line',
            name: '大数据局办公',
            symbolSize: symbolSize,
            xAxisIndex: 1,
            yAxisIndex: 1,
            encode: {
                x: '时间',
                y: '大数据局办公',
                //tooltip: ['大数据局机房', '大数据局办公', '工商局']
            }
        },
        {
            type: 'line',
            name: '工商局',
            symbolSize: symbolSize,
            xAxisIndex: 1,
            yAxisIndex: 1,
            encode: {
                x: '时间',
                y: '工商局',
                //tooltip: ['大数据局机房', '大数据局办公', '工商局']
            }
        },

        // 营业 ---
        {
            type: 'line',
            name: '营业大厅',
            symbolSize: symbolSize,
            xAxisIndex: 2,
            yAxisIndex: 2,
            encode: {
                x: '时间',
                y: '营业大厅',
                //tooltip: ['营业大厅', '营业空调',]
            }
        },
        {
            type: 'line',
            name: '营业空调',
            symbolSize: symbolSize,
            xAxisIndex: 2,
            yAxisIndex: 2,
            encode: {
                x: '时间',
                y: '营业空调',
                //tooltip: ['营业大厅', '营业空调',]
            }
        },

        // 办公 --
        {
            type: 'line',
            name: '办公楼',
            symbolSize: symbolSize,
            xAxisIndex: 3,
            yAxisIndex: 3,
            encode: {
                x: '时间',
                y: '办公楼',
                //tooltip: [ '办公楼', '食堂', '中央空调',]
            }
        },
        {
            type: 'line',
            name: '食堂',
            symbolSize: symbolSize,
            xAxisIndex: 3,
            yAxisIndex: 3,
            encode: {
                x: '时间',
                y: '食堂',
                //tooltip: [ '办公楼', '食堂', '中央空调',]
            }
        },
        {
            type: 'line',
            name: '中央空调',
            symbolSize: symbolSize,
            xAxisIndex: 3,
            yAxisIndex: 3,
            encode: {
                x: '时间',
                y: '中央空调',
                //tooltip: [ '办公楼', '食堂', '中央空调',]
            }
        },

    ]
    };

export const fakeGridPiesOption = {
    title: {
        text: '一级科目内的能耗分布'
    },
    legend: { show: false},
    tooltip: {valueFormatter: (v: number) => `${(v * 100).toFixed(0)}%` },
    dataset: {
        /*source: [
            ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
            ['Milk Tea', 86.5, 92.1, 85.7, 83.1, 73.4, 55.1],
            ['Matcha Latte', 41.1, 30.4, 65.1, 53.3, 83.8, 98.7],
            ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4, 65.2, 82.5],
            ['Walnut Brownie', 55.2, 67.1, 69.2, 72.4, 53.9, 39.1]
        ]*/
        source: {
            'product':['动力源配电屏', '华为配电屏', '洲际配电屏', '艾默生配电屏'],
            'lease': ['大数据局机房', '大数据局办公', '工商局'],
            'business': ['营业大厅', '营业空调'],
            'office': ['食堂', '中央空调', '办公楼'],
            'product_value': [0.32, 0.26, 0.02, 0.41],//[252.9, 207.0, 15.2, 326.8],
            'lease_value': [0.57, 0.41, 0.02],//[261.0, 187.4, 9.2],
            'business_value': [0.75, 0.25],//[39.3, 12.8],
            'office_value': [0.36, 0.12, 0.52],//[42.0, 14.5, 61.4]
        }
    },
    series: [
        {
            name: '生产',
            type: 'pie',
            radius: '20%',
            center: ['25%', '30%'],
            encode: {
                itemName: 'product',
                value: 'product_value'
            }
        },
        {
            name: '外租',
            type: 'pie',
            radius: '20%',
            center: ['75%', '30%'],
            encode: {
                itemName: 'lease',
                value: 'lease_value'
            }
        },
        {
            name: '营业',
            type: 'pie',
            radius: '20%',
            center: ['25%', '75%'],
            encode: {
                itemName: 'business',
                value: 'business_value'
            }
        },
        {
            name: '办公',
            type: 'pie',
            radius: '20%',
            center: ['75%', '75%'],
            encode: {
                itemName: 'office',
                value: 'office_value'
            }
        }
    ]
};
