'use client'
import React, { useEffect, useMemo, useRef } from "react";
import { Props } from "./types";
import useDarkModeObserver from "../useDarkModeObserver";
import useECharts from "../useECharts";
import { useThemeOptions } from '@/ikon/components/theme-provider';
import { getColorScale } from "../common-function";

const DonoutChart: React.FC<Props> = ({ chartData, configurationObj }) => {
  console.log(chartData)
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance: any = useECharts(chartRef as React.RefObject<HTMLDivElement>);
  // const { state } = useThemeOptions();

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
      } = configurationObj;

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
          textStyle: {
            color: textColor,
          },
        },

        // tooltip: showoverallTooltip !== undefined ? (showoverallTooltip ? defaultTooltip : undefined) : defaultTooltip,
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c} ({d}%)"
        },
        legend: {
          orient: 'horizontal',
          left: 'right',
          top: "bottom",
          textStyle: {
            color: textColor,
            borderWidth: 0
          },
          itemStyle: {
            borderWidth: 0, 
            borderColor: "transparent", 
          }
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: false,
              }
            },
            labelLine: {
              show: false
            },
            data: chartData.map((data: Record<string, string | number>, index: number) => ({
              value: data.value,
              name: data.name,
              itemStyle: { 
                color: chartColor[index % chartColor.length],
                borderWidth: 2, 
                borderColor: textColor
              },
            })),
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