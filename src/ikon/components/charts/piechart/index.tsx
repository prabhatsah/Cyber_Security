"use client";
import React, { useEffect, useRef } from "react";
import { Props } from "./types";
import useDarkModeObserver from "../useDarkModeObserver";
import useECharts from "../useECharts";
import { useThemeOptions } from "@/ikon/components/theme-provider";
import { getColorScale } from "../common-function";

const PieChart: React.FC<Props> = ({ chartData, chartConfiguration }) => {
  const { state } = useThemeOptions();
  console.log(state);
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance: any = useECharts(
    chartRef as React.RefObject<HTMLDivElement>
  );

  useEffect(() => {
    if (chartInstance) {
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
        tooltip:
          showoverallTooltip !== undefined
            ? showoverallTooltip
              ? defaultTooltip
              : undefined
            : defaultTooltip,
        legend:
          showLegend !== undefined
            ? showLegend
              ? defaultLegend
              : undefined
            : defaultLegend,
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["pie"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: chartData,
            emphasis: {
              itemStyle: {
                // Removed shadow part
                shadowBlur: 0, // Ensure no shadow effect
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: "rgba(0, 0, 0, 0)",
              },
            },
            label: {
              show: true,
              color: "inherit", // Optional: ensure labels take on the default color
            },
            itemStyle: {
              color: (params: any) =>
                colorScale[params.dataIndex % colorScale.length],
              //     shadowBlur: 0, // Ensure no shadow effect
              //     shadowOffsetX: 0,
              //     shadowOffsetY: 0,
              //     shadowColor: 'rgba(0, 0, 0, 0)',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: true,
            },
            data: chartData,
          },
        ],
      };
      chartInstance.setOption(options);
    }
  }, [chartInstance]);

  const isDarkModeEnabled = state.mode === "dark";
  useDarkModeObserver(chartInstance, isDarkModeEnabled);

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};

export default PieChart;
