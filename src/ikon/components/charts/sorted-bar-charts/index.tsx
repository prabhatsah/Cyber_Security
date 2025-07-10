import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { EChartProps } from "./type";
import useECharts from "../useECharts";
import useDarkModeObserver from "../useDarkModeObserver";
import { useThemeOptions } from "../../theme-provider";
import { getColorScale } from "../common-function";

const EChartSortedBarChart: React.FC<EChartProps> = ({
  chartData,
  configurationObj,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  //const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  const { state } = useThemeOptions();
  const chartInstance = useECharts(chartRef);
  // Resize handler for updating chart dimensions
  // const handleResize = () => {
  //   if (chartInstanceRef.current) {
  //     chartInstanceRef.current.resize();
  //   }
  // };

  // // Add ResizeObserver if required
  // useEffect(() => {
  //   const resizeObserver = new ResizeObserver(handleResize);

  //   if (chartRef.current?.parentElement) {
  //     resizeObserver.observe(chartRef.current.parentElement);
  //   }

  //   return () => {
  //     resizeObserver.disconnect(); // Cleanup observer on unmount
  //   };
  // }, []);

  useEffect(() => {
    if (chartInstance) {
      const colorScale = getColorScale(chartData, state);
      // Initialize the ECharts instance
      // const myChart = echarts.init(chartRef.current);
      // chartInstanceRef.current = myChart;

      // Prepare the sorted dataset based on the specified field
      const sortedData = [...chartData].sort((a, b) => {
        const sortField = configurationObj.sortBy;
        const valA = a[sortField];
        const valB = b[sortField];
        return valB - valA; // Sorting in descending order, modify as needed
      });
      const colors = configurationObj.colors || [
        "#5470C6",
        "#91CC75",
        "#EE6666",
        "#FFB980",
        "#FF99C3",
      ]; // Default colors if none provided
      // Configure chart options dynamically using props
      const chartOption = {
        title: {
          text: configurationObj.title || "Sorted Bar Chart",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          show: configurationObj.showLegend ?? true,
          data: ["Bar Series"],
          bottom: 10, // Position legend at the bottom
        },
        xAxis: {
          type: "category",
          data: sortedData.map((item: any) => item.name), // Update with dynamic categories
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "Bar Series",
            type: "bar",
            data: sortedData.map((item: any) => item[configurationObj.sortBy]), // Dynamic data based on the sorted field
            emphasis: {
              focus: "series",
            },
            itemStyle: {
              color: (params: any) =>
                colorScale[params.dataIndex % colorScale.length],
            },
          },
        ],
        dataZoom: [
          // {
          //   type: 'slider',    // Use the slider type for zooming
          //   show: true,
          //   xAxisIndex: [0],   // Enable zoom on the x-axis (category axis)
          //   start: configurationObj.zoomStartIndex || 0,  // Start zoom
          //   end: configurationObj.zoomEndIndex || 100,   // End zoom
          // },
          {
            type: "inside", // Use the inside zoom, allowing zooming with mouse wheel or touch
            xAxisIndex: [0], // Enable zoom on the x-axis (category axis)
            start: 0, // Start zoom
            end: 100, // End zoom
          },
        ],
      };

      // Set the chart option
      chartInstance.setOption(chartOption);
    }

    // Cleanup on unmount
    // return () => {
    //   if (chartInstanceRef.current) {
    //     chartInstanceRef.current.dispose();
    //   }
    // };
  }, [chartData, configurationObj, chartInstance]);

  const isDarkModeEnabled = state.mode === "dark";
    useDarkModeObserver(chartInstance, isDarkModeEnabled);
  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "100%", // You can adjust this or make it dynamic
      }}
    />
  );
};

export default EChartSortedBarChart;
