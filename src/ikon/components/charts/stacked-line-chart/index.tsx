"use client";

import React, { useEffect, useRef } from "react";
import { Props } from "./types";
import useECharts from "../useECharts";
import useDarkModeObserver from "../useDarkModeObserver";
import * as echarts from "echarts";
import { useThemeOptions } from '@/ikon/components/theme-provider';
import { getColorScale } from "../common-function";

const StackedLineChart: React.FC<Props> = ({ chartData, configurationObj }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const { state } = useThemeOptions();
    const chartInstance: any = useECharts(chartRef as React.RefObject<HTMLDivElement>);
    useEffect(() => {
        if (chartInstance) {
            const colorScale = getColorScale(chartData, state);
            // Define the chart options
            const {
                categoryKey,
                title,
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
            } = configurationObj;

            const defaultTooltip = {
                trigger: "axis",
                formatter: overallTooltip,
                axisPointer: {
                    type: showCursor ? "cross" : "shadow",
                },
            };

            const defaultLegend = {
                orient: "horizontal",
                bottom: 0,
                left: "right",
            };

            const options = {
                title: {
                    text: title,
                },
                tooltip: showoverallTooltip !== undefined ? (showoverallTooltip ? defaultTooltip : undefined) : defaultTooltip,
                legend: showLegend !== undefined ? (showLegend ? defaultLegend : undefined) : defaultLegend,
                toolbox: {
                    feature: {
                        saveAsImage: {},
                    },
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: chartData[categoryKey],
                },
                yAxis: {
                    type: "value",
                },
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
                    // name: seriesConfig.seriesName,
                    type: seriesConfig.seriesType,
                    // data: chartData,
                    // label: {
                    //     show: true
                    // },
                    itemStyle: {
                        color: colorScale[index % colorScale.length]
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                })),
            };
            chartInstance.setOption(options);
        }
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

export default StackedLineChart;