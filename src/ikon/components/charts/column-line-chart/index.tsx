"use client";

import React, { useEffect, useRef, useState } from "react";
import { Props } from "./types";
import useECharts from "../useECharts";
import useDarkModeObserver from "../useDarkModeObserver";
import * as echarts from "echarts";
import { useThemeOptions } from '@/ikon/components/theme-provider';
import { getColorScale } from "../common-function";

const ColumnLineChart: React.FC<Props> = ({ chartData, configurationObj }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance: any = useECharts(chartRef as React.RefObject<HTMLDivElement>);
    const { state } = useThemeOptions();
    useEffect(() => {
        if (chartInstance) {
            const colorScale = getColorScale(chartData, state);
            const {
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
                formatter: overallTooltip,
                axisPointer: {
                    type: showCursor ? "cross" : "shadow",
                },
                // textStyle: {
                //     color: "#ff0000", // Change to red color
                //     fontSize: 14, // Optional: Adjust font size
                //     fontWeight: "bold" // Optional: Make it bold
                // },
                // backgroundColor: "rgba(0, 0, 0, 0.7)", // Optional: Change tooltip background
                // borderColor: "#ffffff", // Optional: Change border color
                // borderWidth: 1
            };

            const defaultLegend = {
                orient: "horizontal",
                bottom: 0,
                left: "right",
            };
            const options = {
                title: {
                    text: configurationObj.title,
                },
                tooltip: showoverallTooltip !== undefined ? (showoverallTooltip ? defaultTooltip : undefined) : defaultTooltip,
                legend: showLegend !== undefined ? (showLegend ? defaultLegend : undefined) : defaultLegend,
                toolbox: {
                    feature: {
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                xAxis: [
                    {
                        type: 'category',
                        data: chartData.map((data: any) => data[categoryKey]),
                        axisPointer: {
                            type: 'shadow'
                        }

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
                    type: seriesConfig.seriesType === "column" ? "bar" : "line",
                    data: chartData.map((data: any) => data[seriesConfig.seriesName]),
                    itemStyle: {
                        color: colorScale[index % colorScale.length]
                    },
                    tooltip: seriesConfig.showSeriesTooltip
                        ? {
                            valueFormatter: (value: any) =>
                                `${value} ${seriesConfig.seriesTooltipText}`,
                        }
                        : undefined,
                })),
            };
            chartInstance.setOption(options);
        }
        // }
    }, [chartInstance]);
    const isDarkModeEnabled = state.mode === "dark";
    useDarkModeObserver(chartInstance, isDarkModeEnabled);
    return (
        <div
            ref={chartRef}
            style={{ width: "100%", height: "100%", minHeight: "350px" }}
        />
    );
};

export default ColumnLineChart;
