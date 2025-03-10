import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { EChartBarChartWithNegativeProps } from './type';
import useECharts from '../useECharts';
import useDarkModeObserver from '../useDarkModeObserver';


const EchartBarChartWithNegative: React.FC<EChartBarChartWithNegativeProps> = ({
  chartData,
  chartConfiguration,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  //const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);

  const chartInstance = useECharts(chartRef as React.RefObject<HTMLDivElement>);
  useEffect(() => {
    if (chartInstance) {
      // Initialize the chart
      //const myChart = echarts.init(chartRef.current);
      //setChartInstance(myChart);

      // Prepare chart options using props
      const chartOption = {
        title: {
          text: chartConfiguration.title || 'Negative Bar Chart',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: Object.keys(chartData), // Dynamically set the legend labels from chartData keys
          show: chartConfiguration.showLegend ?? true,
          bottom: '0%',  // Position the legend at the bottom of the chart
          left: 'center',  // Optionally center-align the legend horizontally
          itemGap: 20,  // Optional: Adjust the space between legend items
          itemWidth: 20,  // Optional: Set width of legend items
          itemHeight: 10,  // Optional: Set height of legend items
          textStyle: {
            fontSize: 14, // Optional: Customize font size for legend text
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',  // Ensure space for the legend at the bottom
          containLabel: true,
        },
        xAxis: [
          {
            type: 'value',
          },
        ],
        yAxis: [
          {
            type: 'category',
            axisTick: {
              show: false,
            },
            data: chartConfiguration.categories, // Categories from props
          },
        ],


        series: Object.keys(chartData).map((category, index) => ({
          name: category, // Use category name as series name
          type: 'bar',
          data: chartData[category], // Use the data for that category
          itemStyle: {
            color: chartConfiguration.colors?.[index] || '#000', // Set color from configuration
          },
        })),

        dataZoom: [
          // {
          //   type: 'slider',    // Use the slider type for zooming
          //   show: true,
          //   xAxisIndex: [0],   // Enable zoom on the x-axis (category axis)
          //   start: configurationObj.zoomStartIndex || 0,  // Start zoom
          //   end: configurationObj.zoomEndIndex || 100,   // End zoom
          // },
          {
            type: 'inside',    // Use the inside zoom, allowing zooming with mouse wheel or touch
            xAxisIndex: [0],   // Enable zoom on the x-axis (category axis)
            yAxisIndex: [0],
            start:0,  // Start zoom
            end: 100,   // End zoom
          }
        ],
      };

      // Set the chart options
      chartInstance.setOption(chartOption);

      // Handle resize event
      //const handleResize = () => {
        //   if (chartInstance) {
        //     chartInstance.resize();
        //   }
        // };

        // // Set up a resize observer to resize the chart when its container size changes
        // const resizeObserver = new ResizeObserver(handleResize);
        // if (chartRef.current?.parentElement) {
        //   resizeObserver.observe(chartRef.current.parentElement);
        // }

        // Clean up resize observer on component unmount
        // return () => {
        //   if (resizeObserver) {
        //     resizeObserver.disconnect();
        //   }
        // };
      //}
    }
  }, [chartData, chartConfiguration, chartInstance]);
  useDarkModeObserver(chartInstance);
  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};

export default EchartBarChartWithNegative;
