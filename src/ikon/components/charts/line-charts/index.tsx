// 'use client';

// import * as chroma from 'chroma-js';
// import * as echarts from 'echarts';
// import React, { useEffect, useRef, useState } from 'react';
// import { LineChartProps } from './type';

// const EChartLineChart: React.FC<LineChartProps> = ({chartData, configurationObj }) => {
//   const chartRef = useRef<HTMLDivElement>(null);
//   const [isClient, setIsClient] = useState(false);
  
  
//   // Use useEffect to delay initialization until client-side rendering
//   useEffect(() => {
//     setIsClient(true); // Mark component as client-rendered

//     if (isClient && chartRef.current) {
//       // Initialize chart when the component is mounted on the client side
//       const myChart = echarts.init(chartRef.current);

//       // Define chart options based on passed configuration
//       const option = {
//         title: {
//           text: configurationObj.title || 'Default Title',
//           left: 'center',
//         },
//         tooltip: {
//           trigger: 'axis',
//         },
//         legend: {
//           show: configurationObj.showLegend !== undefined ? configurationObj.showLegend : true,
//           data: chartData.map((item: any) => item.name), // Use 'name' for legend
//         },
//         xAxis: {
//           type: 'category',
//           data: chartData.map((item: any) => item[configurationObj.categoryKey]),
//           axisLabel: {
//             interval: configurationObj.showScrollx ? 'auto' : 0,
//           },
//         },
//         yAxis: {
//           type: 'value',
//         },
//         series: [
//           {
//             name: 'Value',
//             type: 'line',
//             data: chartData.map((item: any) => item[configurationObj.valueKey]),
//             barWidth: '60%',
//             itemStyle: {
//               color: function (params: any) {
//                 // Use chroma.js to create a color scale
//                 const colorList = chroma.scale('YlGnBu').colors(chartData.length);
//                 return colorList[params.dataIndex];
//               }
//             }
//           },
//         ],
//         grid: {
//           left: '3%',
//           right: '4%',
//           bottom: '3%',
//           containLabel: true,
//         },
//         // cursor: configurationObj.showCursor ? 'pointer' : 'default',
//         // dataZoom: [
//         //   // {
//         //   //   type: 'slider',    // Use the slider type for zooming
//         //   //   show: true,
//         //   //   xAxisIndex: [0],   // Enable zoom on the x-axis (category axis)
//         //   //   start: configurationObj.zoomStartIndex || 0,  // Start zoom
//         //   //   end: configurationObj.zoomEndIndex || 100,   // End zoom
//         //   // },
//         //   {
//         //     type: 'inside',    // Use the inside zoom, allowing zooming with mouse wheel or touch
//         //     xAxisIndex: [0],   // Enable zoom on the x-axis (category axis)
//         //     start: configurationObj.zoomStartIndex || 0,  // Start zoom
//         //     end: configurationObj.zoomEndIndex || 100,   // End zoom
//         //   }
//         // ],
//       };

//       // Apply the chart options
//       myChart.setOption(option);

//       // Handle resize
//       window.addEventListener('resize', () => {
//         myChart.resize();
//       });

//       return () => {
//         // Cleanup event listener when component unmounts
//         window.removeEventListener('resize', () => {
//           myChart.resize();
//         });
//         myChart.dispose();
//       };
//     }
//   }, [isClient, chartData, configurationObj]);

//   if (!isClient) {
//     return null; // Prevent rendering on the server side
//   }

//   return <div ref={chartRef} style={{ width: '100%', height: '100%' }}></div>;
// };

// export default EChartLineChart;



'use client';

import * as chroma from 'chroma-js';
import * as echarts from 'echarts';
import React, { useEffect, useRef, useState } from 'react';
import { LineChartProps } from './type';
import useECharts from '../useECharts';
import useDarkModeObserver from '../useDarkModeObserver';

const EChartLineChart: React.FC<LineChartProps> = ({ chartData, configurationObj }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  //const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);
  const chartInstance = useECharts(chartRef);
  // Use useEffect to delay initialization until client-side rendering
  useEffect(() => {
    setIsClient(true); // Mark component as client-rendered
    if (chartInstance) {
      const option = {
        title: {
          text: configurationObj.title || 'Default Title',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          show: configurationObj.showLegend !== undefined ? configurationObj.showLegend : true,
          data: chartData.map((item: any) => item.name), // Use 'name' for legend
        },
        xAxis: {
          type: 'category',
          data: chartData.map((item: any) => item[configurationObj.categoryKey]),
          axisLabel: {
            interval: configurationObj.showScrollx ? 'auto' : 0,
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: 'Value',
            type: 'line',
            data: chartData.map((item: any) => item[configurationObj.valueKey]),
            barWidth: '60%',
            itemStyle: {
              color: function (params: any) {
                // Use chroma.js to create a color scale
                //const colorList = chroma.scale('YlGnBu').colors(chartData.length);
                return configurationObj.colors[params.dataIndex % configurationObj.colors.length];
              }
            }
          },
        ],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        cursor: configurationObj.showCursor ? 'pointer' : 'default',
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
            start: configurationObj.zoomStartIndex || 0,  // Start zoom
            end: configurationObj.zoomEndIndex || 100,   // End zoom
          }
        ],
      };

      chartInstance.setOption(option);
    }
    
      // Initialize the chart when the component is mounted on the client side
      //const myChart = echarts.init(chartRef.current);
      //setChartInstance(myChart);

      // Define chart options based on the passed configuration


      // Set the options for the chart instance
      //myChart.setOption(option);

      // Resize the chart when the window resizes
      // const handleResize = () => {
      //   if (chartInstance) {
      //     chartInstance.resize();
      //   }
      // };

      // // Set up a resize observer to resize the chart when its container size changes
      // const resizeObserver = new ResizeObserver(handleResize);
      // if (chartRef.current?.parentElement) {
      //   resizeObserver.observe(chartRef.current.parentElement);
      // }

      // Clean up on unmount
      // return () => {
      //   resizeObserver.disconnect();
      //   if (chartInstance) {
      //     chartInstance.dispose();
      //   }
      // };
    //}
  }, [isClient, chartData, configurationObj, chartInstance]); // Dependencies for re-initialization
  useDarkModeObserver(chartInstance);
  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: '100%', // You can adjust this or make it dynamic
      }}
    />
  );
};

export default EChartLineChart;
