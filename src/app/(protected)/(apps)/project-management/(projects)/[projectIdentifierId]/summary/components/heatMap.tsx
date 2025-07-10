"use client"
import React, { useEffect, useMemo, useState } from 'react'
import ReactEcharts, { EChartsOption } from "echarts-for-react";
import { useThemeOptions } from '@/ikon/components/theme-provider';
import { Button } from '@/shadcn/ui/button';
import { Minus, Plus } from 'lucide-react';

export default function HeatMapForRole({ heatMapData }: any) {
    console.log(heatMapData);

    // const getLastNMonths = (numberOfMonths: number) => {
    //     const months = [];
    //     const now = new Date();
    //     let tempMonthduration = numberOfMonths
    //     if (tempMonthduration <= 0) {
    //         tempMonthduration = -tempMonthduration
    //         tempMonthduration += 1;
    //     }

    //     for (let i = 0; i < tempMonthduration; i++) {
    //         if (numberOfMonths <= 0) {
    //             const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    //             const monthStr = date.toLocaleString('en-US', { month: 'short' }) + "_" + date.getFullYear().toString();
    //             months.push(monthStr);
    //         }
    //         else {
    //             const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    //             const monthStr = date.toLocaleString('en-US', { month: 'short' }) + "_" + date.getFullYear().toString();
    //             months.unshift(monthStr);
    //         }
    //     }

    //     return months; // Ensure oldest month appears first
    // };
    const getLastNMonths = (offset: number) => {
        const months = [];
        const now = new Date();
        
        for (let i = 5; i >= 0; i--) { // Always get 6 months
            const date = new Date(now.getFullYear(), now.getMonth() - i + offset, 1);
            const monthStr = date.toLocaleString("en-US", { month: "short" }) + "_" + date.getFullYear();
            months.push(monthStr);
        }
    
        return months;
    };

    const initialMonths = getLastNMonths(0);

    console.log(initialMonths);

    const categories = Object.keys(heatMapData);

    console.log(categories);

    const transformData = (months: string[]) => {
        const formattedData: any = [];
        categories.forEach((category, yIndex) => {
            months.forEach((month, xIndex) => {
                formattedData.push([xIndex, yIndex, heatMapData[category][month] || 0]);
            });
        });
        return formattedData;
    };

    const [months, setMonths] = useState(initialMonths);
    const [chartData, setChartData] = useState(transformData(initialMonths));

    const [numberOfPrevMonth, setNumberOfPrevMonth] = useState<number>(0);

    console.log(numberOfPrevMonth);

    console.log(months);
    console.log(chartData);

    const { state, dispatch } = useThemeOptions();

    // const [chartColor, setChartColor] = useState<string[]>([])

    // useEffect(() => {
    //     if (state.mode === "dark") {
    //         setChartColor(Object.values(state.dark))
    //     } else {
    //         setChartColor(Object.values(state.light))
    //     }
    // }, [])
    const textColor = useMemo(() => {
        if (state.mode === 'dark') {
            return `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim()})`;
        } else {
            return `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--background').trim()})`;
        }
    }, []);

    const chartColor = useMemo(() =>
        state.mode === 'dark' ? Object.values(state.dark) : Object.values(state.light)
        , []);

    const chartOption = useMemo(() => {
        return {
            title: {
                text: 'Resource Allocation',
                left: 'center', // Centers the title horizontally
                textStyle: {
                    color: textColor,
                    fontSize: 18, // Increase font size
                    fontWeight: 'bold', // Make it bold (optional)
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: { height: '70%', top: '20%', left: '20%' },
            xAxis: {
                type: 'category',
                data: months,
                splitArea: { show: true },
                name: 'Month',
                nameTextStyle: {
                    fontSize: 16, // Increase font size
                    fontWeight: "bold",

                },
                axisLine: {
                    lineStyle: {
                        color: textColor 
                    }
                }
            },
            yAxis: {
                type: 'category',
                data: categories,
                splitArea: { show: true },
                name: 'Role',
                nameTextStyle: {
                    fontSize: 16, // Increase font size
                    fontWeight: "bold",
                    align: 'right',
                },
                axisLine: {
                    lineStyle: {
                        color: textColor 
                    }
                }
            },
            visualMap: {
                min: 0,
                max: 30,
                calculable: true,
                orient: 'vertical', 
                right: 10, 
                top: 'center', 
                textStyle: {
                    color: textColor
                },
                inRange: {
                    color: [chartColor[0], chartColor[2]] // Apply color gradient
                },
            },
            series: [{
                name: 'Resource Allocated',
                type: 'heatmap',
                data: chartData,
                label: { show: true },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        } as EChartsOption
    }, [months])


    useEffect(() => {
        const newMonths = getLastNMonths(numberOfPrevMonth); // Get 3 more previous months
        setMonths(newMonths); // Add older months

        const newChartData = transformData(newMonths);
        setChartData(newChartData);
    }, [numberOfPrevMonth])

    // const options: EChartsOption = {
    //     title: {
    //         text: 'Resource Allocation',
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
    //     grid: { height: '70%', top: '20%', left: '20%' },
    //     xAxis: {
    //         type: 'category',
    //         data: months,
    //         splitArea: { show: true },
    //         name: 'Month',
    //         nameTextStyle: {
    //             fontSize: 16, // Increase font size
    //             fontWeight: "bold",

    //         },
    //     },
    //     yAxis: {
    //         type: 'category',
    //         data: categories,
    //         splitArea: { show: true },
    //         name: 'Role',
    //         nameTextStyle: {
    //             fontSize: 16, // Increase font size
    //             fontWeight: "bold",
    //             align: 'right',
    //         },
    //     },
    //     visualMap: {
    //         min: 0,
    //         max: 30,
    //         calculable: true,
    //         orient: 'vertical', // Change to vertical orientation
    //         right: 10, // Position it on the right side (in pixels)
    //         top: 'center', // Center vertically
    //         inRange: {
    //             color: [chartColor[0], chartColor[2]] // Apply color gradient
    //         },

    //     },
    //     series: [{
    //         name: 'Resource Allocated',
    //         type: 'heatmap',
    //         data: chartData,
    //         label: { show: true },
    //         emphasis: {
    //             itemStyle: {
    //                 shadowBlur: 10,
    //                 shadowColor: 'rgba(0, 0, 0, 0.5)'
    //             }
    //         }
    //     }]
    // };

    return (
        <>
            <div className='flex flex-col'>
                <div>
                    <ReactEcharts option={chartOption} />
                </div>
                <div className='flex flex-row justify-center gap-2'>
                    <Button onClick={() => { setNumberOfPrevMonth((prev: number) => prev - 1) }} size='icon'><Minus /></Button>
                    <Button onClick={() => { setNumberOfPrevMonth((prev: number) => prev + 1) }} size='icon'><Plus /></Button>
                </div>
            </div>
        </>
    )
}