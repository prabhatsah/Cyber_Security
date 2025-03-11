// import React, { useEffect, useRef } from 'react';
// import * as echarts from 'echarts';
// import { EChartProps } from './type';

// const EChartStackBarNormalization: React.FC<EChartProps> = ({ chartData, chartConfiguration }) => {
//   const chartRef = useRef<HTMLDivElement>(null);
//   const chartInstanceRef = useRef<echarts.ECharts | null>(null);

//   useEffect(() => {
//     if (chartRef.current) {
//       // Initialize the chart instance
//       const myChart = echarts.init(chartRef.current);
//       chartInstanceRef.current = myChart;

//       // Prepare totalData by summing up values of each column in the rawData
//       const totalData = [];
//       for (let i = 0; i < chartData[0].length; ++i) {
//         let sum = 0;
//         for (let j = 0; j < chartData.length; ++j) {
//           sum += chartData[j][i];
//         }
//         totalData.push(sum);
//       }

//       // Configure chart options dynamically using props
//       const chartOption = {
//         title: {
//           text: chartConfiguration.title || 'Mixed Bar and Line Chart',
//           left: 'center',
//         },
//         tooltip: {
//           trigger: 'axis',
//         },
//         legend: {
//           show: chartConfiguration.showLegend ?? true,
//           data: chartConfiguration.seriesNames, // Use passed series names
//           bottom: 10, // Position legend at the bottom
//         },
//         xAxis: {
//           type: 'category',
//           data: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 'Category 6', 'Category 7'], // Replace with dynamic category data if needed
//         },
//         yAxis: [
//           {
//             type: 'value',
//             name: 'Stacked Values',
//           },
//         ],
//         series: chartConfiguration.seriesNames.map((name, sid) => ({
//           name,
//           type: 'bar',
//           stack: 'total',
//           barWidth: '60%',
//           label: {
//             show: true,
//             formatter: (params: any) => params.value,
//           },
//           data: chartData[sid], // Data for each series (this assumes each series corresponds to one row of data)
//         })),

//         dataZoom: [
//             // {
//             //   type: 'slider',    // Use the slider type for zooming
//             //   show: true,
//             //   xAxisIndex: [0],   // Enable zoom on the x-axis (category axis)
//             //   start: configurationObj.zoomStartIndex || 0,  // Start zoom
//             //   end: configurationObj.zoomEndIndex || 100,   // End zoom
//             // },
//             {
//               type: 'inside',    // Use the inside zoom, allowing zooming with mouse wheel or touch
//               xAxisIndex: [0],   // Enable zoom on the x-axis (category axis)
//               start: 0,  // Start zoom
//               end: 100,   // End zoom
//             }
//           ],

//       };

//       // Set the chart option
//       myChart.setOption(chartOption);

//       // Resize the chart when the window size changes or the container size changes
//       const handleResize = () => {
//         if (myChart) {
//           myChart.resize();
//         }
//       };

//       // Use ResizeObserver to observe changes in the chart container's size
//       const resizeObserver = new ResizeObserver(handleResize);
//       if (chartRef.current) {
//         resizeObserver.observe(chartRef.current);
//       }

//       // Cleanup observer on component unmount
//       return () => {
//         if (chartRef.current) {
//           resizeObserver.unobserve(chartRef.current);
//         }
//         if (myChart) {
//           myChart.dispose();
//         }
//       };
//     }
//   }, [chartData, chartConfiguration]);

//   return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />;
// };

// export default EChartStackBarNormalization;





import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { EChartProps } from './type';
import useECharts from '../useECharts';
import useDarkModeObserver from '../useDarkModeObserver';

const EChartStackBarNormalization: React.FC<EChartProps> = ({ chartData, chartConfiguration }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const chartInstance = useECharts(chartRef);
  useEffect(() => {
    if (chartInstance) {
      // Initialize the chart instance
      // const myChart = echarts.init(chartRef.current);
      // chartInstanceRef.current = myChart;

      // Define dynamic colors (use chartConfiguration.colors or fallback to default colors)
      const colors = chartConfiguration.colors || [
        '#5470C6', '#91CC75', '#EE6666', '#FFB980', '#FF99C3', '#D7AEE0',
        '#F7B7A3', '#FF8247', '#A1E4D9',
      ];

      // Prepare totalData by summing up values of each column in the rawData
      const totalData: number[] = [];
      for (let i = 0; i < chartData[0].length; ++i) {
        let sum = 0;
        for (let j = 0; j < chartData.length; ++j) {
          sum += chartData[j][i];
        }
        totalData.push(sum);
      }

      // Prepare series data (normalize each category's value and assign dynamic colors)
      const series = chartData.map((data: number[], index: number) => ({
        name: chartConfiguration.seriesNames ? chartConfiguration.seriesNames[index] : `Series ${index + 1}`,
        type: 'bar',
        stack: 'stack',  // Stack the bars
        data: data,
        itemStyle: {
          color: colors[index % colors.length], // Use the color from configuration or default
        },
      }));

      // Prepare chart options
      const chartOption = {
        title: {
          text: chartConfiguration.title || 'Stacked Bar Chart with Negative Values',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          data: chartConfiguration.seriesNames || series.map((s) => s.name),  // Dynamic legend
          show: chartConfiguration.showLegend ?? true,  // Use the showLegend config (default to true)
          bottom: '0%',  // Position the legend at the bottom of the chart
          left: 'center',  // Optionally center-align the legend horizontally
          itemGap: 20,  // Adjust the space between legend items
          itemWidth: 20,  // Set width of legend items
          itemHeight: 10,  // Set height of legend items
          textStyle: {
            fontSize: 14, // Customize font size for legend text
          },
        },
        xAxis: {
          type: 'category',
          data: chartData[0].map((_, index) => `Category ${index + 1}`), // Dynamically label x-axis
        },
        yAxis: {
          type: 'value',
        },
        series: series, // Dynamically generated series


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
            start:0,  // Start zoom
            end: 100,   // End zoom
          }
        ],
      };

      // Set chart options
      chartInstance.setOption(chartOption);
      // Resize the chart when the window size changes or the container size changes
      // const handleResize = () => {
      //   if (myChart) {
      //     myChart.resize();
      //   }
      // };

      // // Use ResizeObserver to observe changes in the chart container's size
      // const resizeObserver = new ResizeObserver(handleResize);
      // if (chartRef.current) {
      //   resizeObserver.observe(chartRef.current);
      // }
      // // Resize chart on window resize
      // window.addEventListener('resize', () => myChart.resize());
      // return () => {
      //   window.removeEventListener('resize', () => myChart.resize());
      //   myChart.dispose();
      // };
    }
  }, [chartData, chartConfiguration, chartInstance]);

  useDarkModeObserver(chartInstance);

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
};

export default EChartStackBarNormalization;
