'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import ReactECharts, { EChartsOption } from 'echarts-for-react';
import { useThemeOptions } from '@/ikon/components/theme-provider';

export default function SectorwiseRevenuePieChart(
    sectorWiseRevenueDatas: { sectorWiseRevenueData: Record<string, any>[] }
) {
    const { state } = useThemeOptions();
        const chartColor = useMemo(() =>
        state.mode === 'dark' ? Object.values(state.dark) : Object.values(state.light)
        , []);

    const textColor = useMemo(() => {
        if (state.mode === 'dark') {
            return `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim()})`;
        } else {
            return `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--background').trim()})`;
        }
    }, []);

    const chartOption = useMemo(() => {
        const rawData = sectorWiseRevenueDatas.sectorWiseRevenueData;

        const formattedData = rawData.map((item) => ({
            name: item.sector,
            value: Number(item.sumOfActualRevenue).toFixed(2)
        }));

        return {
            title: {
                text: 'Sector Wise Revenue',
                left: 'left',
                textStyle: {
                    color: textColor,
                },
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                top: '20%',
                textStyle: {
                    color: textColor,
                }
            },
            series: [
                {
                    name: 'Revenue',
                    type: 'pie',
                    radius: '80%',
                    data: formattedData.map((item, index) => ({
                        ...item,
                        itemStyle: { color: chartColor[index % chartColor.length] },
                    })),
                    label: {
                        show: false
                    },
                    emphasis: {
                        label: {
                            show: false
                        },
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                },
            ],
        } as EChartsOption;
    }, []);

    // useEffect(() => {
    //     if (chartInstance.current) {
    //         chartInstance.current.setOption(chartOption);
    //     }
    // }, [chartOption]);

    return (
        <div>
            <ReactECharts
                option={chartOption}
                // ref={(chart) => {
                //     if (chart && !chartInstance.current) {
                //         chartInstance.current = chart.getEchartsInstance();
                //     }
                // }}
            />
        </div>
    );
}
