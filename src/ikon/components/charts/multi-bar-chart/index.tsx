"use client";

import React, { useEffect, useRef } from "react";
// import { Props } from "./types";
import useECharts from "../useECharts";
import useDarkModeObserver from "../useDarkModeObserver";
import * as echarts from "echarts";
import { useThemeOptions } from '@/ikon/components/theme-provider';
import { getColorScale } from "../common-function";

interface Props {
    chartData: any;
    chartConfiguration: any;
}
const MultiBarChart: React.FC<Props> = ({ chartData, chartConfiguration }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance: any = useECharts(chartRef as React.RefObject<HTMLDivElement>);
    const { state } = useThemeOptions();
    // useDarkModeObserver(chartInstance);
    useEffect(() => {
        const darkModeEnabled = document.getElementById("protectedMainContainer")?.classList.contains("dark") || false;
        if (chartInstance) {
            // Define the chart options
            const colorScale = getColorScale(chartData, state);
            const {
                title,
                seriesCreationArrayofObj,
                DarkColorPalette,
                lightColorPalette,
                showLegend,
                showCursor,
                showScrollx,
                showScrolly,
                zoomToIndex,
                zoomStartIndex,
                zoomEndIndex,
                showoverallTooltip,
                dimensions
            } = chartConfiguration;

            const defaultTooltip = {
                position: 'top',
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
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                dataset: {
                    dimensions: dimensions,
                    source: chartData
                },
                xAxis: { type: 'category' },
                yAxis: {},
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
                    // itemStyle: {
                    //     color: seriesConfig.seriesColor || undefined,
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

export default MultiBarChart;