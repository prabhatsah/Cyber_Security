"use client"
import React, { useEffect, useMemo, useState } from 'react'
import ReactEcharts, { EChartsOption } from "echarts-for-react";
import { useThemeOptions } from '@/ikon/components/theme-provider';

export default function BarChartsSummaryPage({ barChartData }: any) {

    console.log(barChartData);
    console.log(Object.keys(barChartData));
    console.log(Object.values(barChartData))

    const data = Object.values(barChartData).map((data) => data?.percentage);
    console.log(data);

    const { state, dispatch } = useThemeOptions();

    // const [chartColor, setChartColor] = useState<string[]>([])

    // useEffect(() => {
    //     if (state.mode === "dark") {
    //         setChartColor(Object.values(state.dark))
    //     } else {
    //         setChartColor(Object.values(state.light))
    //     }
    // }, [])

    // console.log(chartColor);

    // const textColor = useMemo(() => {
    //     if (state.mode === 'dark') {
    //         return `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim()})`;
    //     } else {
    //         return `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--background').trim()})`;
    //     }
    // }, [state.mode]);

    const chartColor = useMemo(() =>
        state.mode === 'dark' ? Object.values(state.dark) : Object.values(state.light)
, [state.mode]);


    const chartOption = useMemo(() => {
        // const textColor = chroma(`hsl(var(--foreground)`).hex();
        const textColor = `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim()})`
        return {
            title: {
                text: 'Progress (in %)',
                left: 'center', // Centers the title horizontally
                textStyle: {
                    color: textColor,
                    fontSize: 16, // Increase font size
                    fontWeight: 'bold', // Make it bold (optional)
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '8%',
                top: '30%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: textColor
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    axisLine: {
                        lineStyle: {
                            color: textColor
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    name: 'Task',
                    nameTextStyle: {
                        color: textColor,
                        fontSize: 16, // Increase font size
                        fontWeight: "bold",
                        align: 'right',
                    },
                    data: Object.keys(barChartData)
                }
            ],
            series: [
                {
                    name: 'Percentage Complete',
                    type: 'bar',
                    label: {
                        show: true,
                        position: 'outside',
                        color: textColor
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: Object.values(barChartData).map((data, index) => ({
                        value: data?.percentage,
                        itemStyle: {
                            color: chartColor[index % chartColor.length], // Cycle through colors
                        },
                    })),
                },
            ]
        } as EChartsOption
    }, [])

    // const chartOption: EChartsOption = {
    //     title: {
    //         text: 'Progress (in %)',
    //         left: 'center', // Centers the title horizontally
    //         textStyle: {
    //             fontSize: 24, // Increase font size
    //             fontWeight: 'bold', // Make it bold (optional)
    //         }
    //     },
    //     tooltip: {
    //         trigger: 'axis',
    //         axisPointer: {
    //             type: 'shadow'
    //         }
    //     },
    //     grid: {
    //         left: '3%',
    //         right: '4%',
    //         bottom: '8%',
    //         top: '30%',
    //         containLabel: true
    //     },
    //     xAxis: [
    //         {
    //             type: 'value',
    //         }
    //     ],
    //     yAxis: [
    //         {
    //             type: 'category',
    //             axisTick: {
    //                 show: false
    //             },
    //             name: 'Task',
    //             nameTextStyle: {
    //                 fontSize: 16, // Increase font size
    //                 fontWeight: "bold",
    //                 align: 'right',
    //             },
    //             data: Object.keys(barChartData)
    //         }
    //     ],
    //     series: [
    //         {
    //             name: 'Percentage Complete',
    //             type: 'bar',
    //             label: {
    //                 show: true,
    //                 position: 'inside'
    //             },
    //             emphasis: {
    //                 focus: 'series'
    //             },
    //             data: Object.values(barChartData).map((data, index) => ({
    //                 value: data?.percentage,
    //                 itemStyle: {
    //                     color: chartColor[index % chartColor.length], // Cycle through colors
    //                 },
    //             })),
    //         },
    //     ]
    // };



    return (
        <>
            <ReactEcharts option={chartOption} />
        </>
    )
}
