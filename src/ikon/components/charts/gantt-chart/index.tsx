"use client";

import React, { useEffect, useRef, useState } from "react";
import { Props } from "./type";
import useECharts from "../useECharts";
import useDarkModeObserver from "../useDarkModeObserver";
import { useThemeOptions } from '@/ikon/components/theme-provider';
import { getColorScale } from "../common-function";

const GanttChart: React.FC<Props> = ({ chartData, configurationObj }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance: any = useECharts(chartRef as React.RefObject<HTMLDivElement>);
    const { state } = useThemeOptions();
    useEffect(() => {
        if (chartInstance) {
            const colorScale = getColorScale(chartData, state);
            console.log("colorScale", colorScale);
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
            const options  = {
                tooltip: {
                  formatter: function (params: any) {
                    return `${params.name}<br/>${params.seriesName}: ${params.value[1]} - ${params.value[0]}`;
                  }
                },
                title: {
                  text: 'Gantt-style Chart'
                },
                xAxis: {
                  type: 'time'
                },
                yAxis: {
                  type: 'category',
                  data: ['SA Pressure', 'RA Temp', 'RA CO2']
                },
                series: [
                  {
                    name: 'Normal',
                    type: 'custom',
                    renderItem: function (params: any, api: any) {
                      const categoryIndex = api.value(2);
                      const start = api.coord([api.value(0), categoryIndex]);
                      const end = api.coord([api.value(1), categoryIndex]);
                      const height = 20;
                      return {
                        type: 'rect',
                        shape: {
                          x: start[0],
                          y: start[1] - height / 2,
                          width: end[0] - start[0],
                          height: height
                        },
                        style: {
                          fill: '#4CAF50'
                        }
                      };
                    },
                    encode: {
                      x: [0, 1],
                      y: 2
                    },
                    data: [
                      ['2025-04-04', '2025-04-07', 0],
                      ['2025-04-05', '2025-04-06', 1],
                      ['2025-04-06', '2025-04-07', 2]
                    ]
                  }
                ]
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

export default GanttChart;
