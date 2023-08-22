import dayjs from 'dayjs';
import {TChartColor} from '@/config/color';
import {getChartListColor} from '@/utils/color';
import {getRandomArray} from '@/utils/charts';

/** 首页 dashboard 折线图 */
export function constructInitDashboardDataset(type: string) {
    const dateArray: Array<string> = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const datasetAxis = {
        xAxis: {
            type: 'category',
            show: false,
            data: dateArray,
        },
        yAxis: {
            show: false,
            type: 'value',
        },
        grid: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
        },
    };

    if (type === 'line') {
        const lineDataset = {
            ...datasetAxis,
            color: ['#fff'],
            series: [
                {
                    data: [150, 230, 224, 218, 135, 147, 900],
                    type,
                    showSymbol: true,
                    symbol: 'circle',
                    symbolSize: 0,
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'},
                        ],
                    },
                    lineStyle: {
                        width: 2,
                    },
                },
            ],
        };
        return lineDataset;
    }
    const barDataset = {
        ...datasetAxis,
        color: getChartListColor(),
        series: [
            {
                data: [
                    100,
                    130,
                    184,
                    218,
                    {
                        value: 135,
                        itemStyle: {
                            opacity: 0.2,
                        },
                    },
                    {
                        value: 118,
                        itemStyle: {
                            opacity: 0.2,
                        },
                    },
                    {
                        value: 60,
                        itemStyle: {
                            opacity: 0.2,
                        },
                    },
                ],
                type,
                barWidth: 9,
            },
        ],
    };
    return barDataset;
}

/**
 * 柱状图数据源
 * @param dateTime
 * @param reportCountList
 * @param placeholderColor
 * @param borderColor
 *
 * tips：使用了 TypeScript 参数解构和类型注解的组合
 * 外层的大括号 {} 表示这是一个对象解构。这意味着这个函数接受一个对象作为参数，并从这个对象中提取特定的属性值
 * 内部的属性dateTime, reportCountList被赋予了默认值[]，意味着如果调用函数时没有传递这些属性，它们将为默认值[]
 * placeholderColor 和 borderColor 是两个属性，它们没有默认值，因此它们是可选的
 *
 * 综上所述，这段代码定义了一个接受特定参数结构和类型的函数
 * 当调用这个函数时，必须传递一个带有 dateTime 和 reportCountList 属性的对象
 * 但 placeholderColor 和 borderColor 是可选的
 */
export function constructInitDataset(
    {
        dateTime = [],
        reportCountList = [],
        placeholderColor,
        borderColor,
    }: { dateTime: Array<string> } & { reportCountList: Array<string> } & TChartColor) {
    // const dataset: Array<Array<string>> = [['时间'], ['入库'], ['出库']];
    const divideNum = 7;
    const timeArray = [];
    const outArray = reportCountList;
    for (let i = 0; i < divideNum; i++) {
        // const [timeArray, inArray, outArray] = dataset;
        if (dateTime.length > 0) {
            const dateAbsTime: number = (new Date(dateTime[1]).getTime() - new Date(dateTime[0]).getTime()) / divideNum;
            const enhandTime: number = new Date(dateTime[0]).getTime() + dateAbsTime * i;
            // console.log('dateAbsTime..', dateAbsTime, enhandTime);
            timeArray.push(dayjs(enhandTime).format('YYYY-MM-DD'));
        } else {
            timeArray.push(dayjs().subtract(divideNum - i, 'day').format('YYYY-MM-DD'));
        }
    }

    // console.log('timeArray..', timeArray);

    const dataset = {
        color: getChartListColor(),
        tooltip: {
            trigger: 'item',
        },
        xAxis: {
            type: 'category',
            data: timeArray,
            axisLabel: {
                color: placeholderColor,
            },
            axisLine: {
                lineStyle: {
                    color: getChartListColor()[1],
                    width: 1,
                },
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: placeholderColor,
            },
            splitLine: {
                lineStyle: {
                    color: borderColor,
                },
            },
        },
        grid: {
            top: '5%',
            left: '25px',
            right: 0,
            bottom: '60px',
        },
        legend: {
            icon: 'rect',
            itemWidth: 12,
            itemHeight: 4,
            itemGap: 48,
            textStyle: {
                fontSize: 12,
                color: placeholderColor,
            },
            left: 'center',
            bottom: '0',
            orient: 'horizontal',
            data: ['报单数'],
        },
        series: [
            {
                name: '报单数',
                data: outArray,
                type: 'bar',
            }
        ],
    };

    return dataset;
}

/**
 *  线性图表数据源
 *
 * @export
 * @param {Array<string>} [dateTime=[]]
 * @returns {*}
 */
export function getLineChartDataSet(
    {
        dateTime = [],
        placeholderColor,
        borderColor,
    }: { dateTime?: Array<string> } & TChartColor) {
    const divideNum = 10;
    const timeArray = [];
    const inArray = [];
    const outArray = [];
    for (let i = 0; i < divideNum; i++) {
        if (dateTime.length > 0) {
            const dateAbsTime: number = (new Date(dateTime[1]).getTime() - new Date(dateTime[0]).getTime()) / divideNum;
            const enhandTime: number = new Date(dateTime[0]).getTime() + dateAbsTime * i;
            // console.log('dateAbsTime..', dateAbsTime, enhandTime);
            timeArray.push(dayjs(enhandTime).format('MM-DD'));
        } else {
            timeArray.push(
                dayjs()
                    .subtract(divideNum - i, 'day')
                    .format('MM-DD'),
            );
        }

        inArray.push(getRandomArray().toString());
        outArray.push(getRandomArray().toString());
    }

    const dataSet = {
        color: getChartListColor(),
        tooltip: {
            trigger: 'item',
        },
        grid: {
            left: '0',
            right: '20px',
            top: '5px',
            bottom: '36px',
            containLabel: true,
        },
        legend: {
            left: 'center',
            bottom: '0',
            orient: 'horizontal', // legend 横向布局。
            data: ['本月', '上月'],
            textStyle: {
                fontSize: 12,
                color: placeholderColor,
            },
        },
        xAxis: {
            type: 'category',
            data: timeArray,
            boundaryGap: false,
            axisLabel: {
                color: placeholderColor,
            },
            axisLine: {
                lineStyle: {
                    width: 1,
                },
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: placeholderColor,
            },
            splitLine: {
                lineStyle: {
                    color: borderColor,
                },
            },
        },
        series: [
            {
                name: '本月',
                data: outArray,
                type: 'line',
                smooth: false,
                showSymbol: true,
                symbol: 'circle',
                symbolSize: 8,
                itemStyle: {
                    borderColor,
                    borderWidth: 1,
                },
                areaStyle: {
                    opacity: 0.1,
                },
            },
            {
                name: '上月',
                data: inArray,
                type: 'line',
                smooth: false,
                showSymbol: true,
                symbol: 'circle',
                symbolSize: 8,
                itemStyle: {
                    borderColor,
                    borderWidth: 1,
                },
            },
        ],
    };
    return dataSet;
}

/**
 * 获取饼图数据
 *
 * @export
 * @param {number} [radius=1]
 * @returns {*}
 */
export function getPieChartDataSet({
                                       radius = 42,
                                       textColor,
                                       placeholderColor,
                                       containerColor,
                                   }: { radius?: number } & Record<string, string>) {
    return {
        color: getChartListColor(),
        tooltip: {
            show: false,
            trigger: 'axis',
            position: null,
        },
        grid: {
            top: '0',
            right: '0',
        },
        legend: {
            selectedMode: false,
            itemWidth: 12,
            itemHeight: 4,
            textStyle: {
                fontSize: 12,
                color: placeholderColor,
            },
            left: 'center',
            bottom: '0',
            orient: 'horizontal', // legend 横向布局。
        },
        series: [
            {
                name: '销售渠道',
                type: 'pie',
                radius: ['48%', '60%'],
                avoidLabelOverlap: true,
                selectedMode: true,
                silent: true,
                itemStyle: {
                    borderColor: containerColor,
                    borderWidth: 1,
                },
                label: {
                    show: true,
                    position: 'center',
                    formatter: ['{value|{d}%}', '{name|{b}渠道占比}'].join('\n'),
                    rich: {
                        value: {
                            color: textColor,
                            fontSize: 28,
                            fontWeight: 'normal',
                            lineHeight: 46,
                        },
                        name: {
                            color: '#909399',
                            fontSize: 12,
                            lineHeight: 14,
                        },
                    },
                },
                emphasis: {
                    scale: true,
                    label: {
                        show: true,
                        formatter: ['{value|{d}%}', '{name|{b}渠道占比}'].join('\n'),
                        rich: {
                            value: {
                                color: textColor,
                                fontSize: 28,
                                fontWeight: 'normal',
                                lineHeight: 46,
                            },
                            name: {
                                color: '#909399',
                                fontSize: 14,
                                lineHeight: 14,
                            },
                        },
                    },
                },
                labelLine: {
                    show: false,
                },
                data: [
                    {
                        value: 1048,
                        name: '线上',
                    },
                    {value: radius * 7, name: '门店'},
                ],
            },
        ],
    };
}
