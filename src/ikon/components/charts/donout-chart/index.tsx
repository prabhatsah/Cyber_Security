'use client'
import React, { useEffect, useRef } from "react";
import { Props } from "./types";
import * as echarts from "echarts";
import useDarkModeObserver from "../useDarkModeObserver";
import useECharts from "../useECharts";
import { useThemeOptions } from '@/ikon/components/theme-provider';
import { getColorScale } from "../common-function";

const DonoutChart: React.FC<Props> = ({ chartData, chartConfiguration }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance: any = useECharts(chartRef as React.RefObject<HTMLDivElement>);
  const { state } = useThemeOptions();

  useEffect(() => {
    const darkModeEnabled = document.getElementById("protectedMainContainer")?.classList.contains("dark") || false;
    if (chartInstance) {
      // Destructure configurationObj to extract values
      const colorScale = getColorScale(chartData, state);
      const {
        title,
        DarkColorPalette,
        lightColorPalette,
        showLegend,
        colorPalette,
        showCursor,
        showoverallTooltip,
        overallTooltip,
      } = chartConfiguration;

      const defaultTooltip = {
        trigger: "item",
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
        // visualMap: {
        //   inRange: {
        //     color: darkModeEnabled ? DarkColorPalette : lightColorPalette
        //   }
        // },
        // ...(colorPalette && { color: colorPalette }),
        tooltip: showoverallTooltip !== undefined ? (showoverallTooltip ? defaultTooltip : undefined) : defaultTooltip,
        legend: showLegend !== undefined ? (showLegend ? defaultLegend : undefined) : defaultLegend,
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['pie'] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            //   label: {
            //     show: false,
            //     position: 'center'
            //   },
            label: {
              show: true,
              color: 'inherit', // Optional: ensure labels take on the default color
              // formatter: '{b}: {c}', // Display label and value
              formatter: (params: any) => {
                const total = chartData.reduce((sum: number, item: any) => sum + item.value, 0);
                const percent = ((params.value / total) * 100).toFixed(2);
                return `${params.name}: ${percent}%`;
              }
            },
            itemStyle: {
              color: (params: any) => colorScale[params.dataIndex % colorScale.length],
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
              // itemStyle: {
              //     // Removed shadow part
              //     shadowBlur: 0, // Ensure no shadow effect
              //     shadowOffsetX: 0,
              //     shadowOffsetY: 0,
              //     shadowColor: 'rgba(0, 0, 0, 0)',
              //   },
            },
            labelLine: {
              show: true
            },
            data: chartData,
          }
        ]
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

export default DonoutChart;