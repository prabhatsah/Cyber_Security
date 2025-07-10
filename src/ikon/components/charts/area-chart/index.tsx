import React, { useEffect, useRef, useState } from 'react';
import useECharts from "../useECharts";
import { useThemeOptions } from '@/ikon/components/theme-provider';
import { getColorScale } from "../common-function";
import useDarkModeObserver from "../useDarkModeObserver";

interface EChartLineComponentProps {
    chartData: any[],
    configurationObj?: any;
}
// Format time function
const formatTime = (time: string): string => {
    const correctedTime = time.replace(' UTC', 'Z');
    const date = new Date(correctedTime);

    if (Number.isNaN(date.getTime())) {
        console.error('Invalid date:', time);
        return 'Invalid Date';
    }

    return new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    }).format(date);
};
const getSeriesData = (chartData: any[], seriesConfig: any) => {
    let seriesData: any[] = [];
    for (let i = 0; i < chartData.length; i++) {
        const element = chartData[i];
        if (element.service_name === seriesConfig.seriesName) {
            seriesData.push(element.monitoring_data);
        }
    }
    return seriesData;
}
const AreaChart: React.FC<EChartLineComponentProps> = ({ chartData, configurationObj }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance: any = useECharts(chartRef as React.RefObject<HTMLDivElement>);
    const { state } = useThemeOptions();
    const chartColors = ['#FFA500', '#1E90FF', '#32CD32'];


    // Chart options
    useEffect(() => {
        if (chartInstance && chartData && configurationObj) {
            // Destructure configurationObj to extract values
            const colorScale = getColorScale(chartData, state);
            const {
                title,
                categoryKey,
                seriesCreationArrayofObj,
                showLegend,
                showCursor,
                showScrollx,
                showScrolly,
                zoomToIndex,
                zoomStartIndex,
                zoomEndIndex,
                showoverallTooltip,
                overallTooltip,
                yAxisParams,
            } = configurationObj;

            const defaultTooltip = {
                trigger: "axis",
                // formatter: overallTooltip,
                // axisPointer: {
                //     type: showCursor ? "cross" : "shadow",
                // },
            };

            const defaultLegend = {
                orient: "horizontal",
                bottom: 0,
                left: "right",
            };
            const options = {
                title: {
                  text: title
                },
                tooltip: showoverallTooltip !== undefined ? (showoverallTooltip ? defaultTooltip : undefined) : defaultTooltip,
                // legend: {
                //     data: ['RA  temperature setpoint', 'AHU-01 RA Temp', 'RA Temp control( Valve Feedback)']
                // },
                legend: showLegend !== undefined ? (showLegend ? defaultLegend : undefined) : defaultLegend,
                // toolbox: {
                //     feature: {
                //         saveAsImage: {}
                //     }
                // },
                grid: {
                    left: '6%',
                    right: '4%',
                    bottom: '12%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                          },
                        // boundaryGap: false,
                        // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        data: chartData
                            .filter((_, index) => index % seriesCreationArrayofObj.length === 0)
                            .map((data: any) => formatTime(data[categoryKey])),
                    }
                ],
                yAxis: yAxisParams,
                dataZoom: [
                    showScrollx
                        ? {
                            type: "slider",
                            start: zoomToIndex ? Number(zoomStartIndex) : 0,
                            end: zoomToIndex ? Number(zoomEndIndex) : 100,
                        }
                        : undefined,
                    showScrolly
                        ? {
                            type: "slider",
                            yAxisIndex: 0,
                            start: zoomToIndex ? Number(zoomStartIndex) : 0,
                            end: zoomToIndex ? Number(zoomEndIndex) : 100,
                        }
                        : undefined,
                ].filter(Boolean) as echarts.DataZoomComponentOption[],
                series: seriesCreationArrayofObj.map((seriesConfig: any, index: number) => ({
                    name: seriesConfig.seriesName,
                    type: seriesConfig.seriesType === "bar" ? "bar" : "line",
                    yAxisIndex: seriesConfig?.yAxisIndex,
                    // stack: 'Total', // Add this to stack the series
                    areaStyle: {}, // Add this to make it an area chart
                    // data: [120, 132, 101, 134, 90, 230, 210],
                    data: getSeriesData(chartData, seriesConfig),
                    itemStyle: {
                        // color: colorScale[((index + 1)*16) % colorScale.length]
                        color: chartColors[index],
                    }, 
                    
                    showSeriesTooltip: true,
                })),
            };
            chartInstance.setOption(options);
        }
    }, [chartInstance && chartData && configurationObj]);
    const isDarkModeEnabled = state.mode === "dark";
    useDarkModeObserver(chartInstance, isDarkModeEnabled);
    // Initialize and update the chart when the data changes
    // useEffect(() => {
    //     if (chartRef.current) {
    //         const chart = echarts.init(chartRef.current);
    //         chart.setOption(chartOptionMultipleLineTempVsHumid);

    //         // Cleanup chart instance on component unmount
    //         return () => {
    //             chart.dispose();
    //         };
    //     }
    // }, [data]); // Re-render chart on data change

    return (
        <div
            ref={chartRef}
            style={{ width: "100%", height: "100%", minHeight: "350px" }}
        />
    )
};

export default AreaChart;
