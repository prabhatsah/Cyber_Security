// 'use client';

// import * as chroma from 'chroma-js';
// import * as echarts from 'echarts';
// import React, { useEffect, useRef, useState } from 'react';
// import { BarChartProps } from './type';

// const EChartBarChart: React.FC<BarChartProps> = ({data, configurationObj }) => {
//   const chartRef = useRef<HTMLDivElement>(null);
//   const [isClient, setIsClient] = useState(false);

//   const [view, setView] = useState('main'); // Track the current chart view (main or drill-down)
//   const [selectedCategory, setSelectedCategory] = useState(''); // Store the selected category for drill-down

//   // Sample drill-down data
//   const drillDownData : any = {
//     'Category 1': ['Day 1', 'Day 2', 'Day 3'],
//     'Category 2': ['Day 1', 'Day 2', 'Day 3'],
//     'Category 3': ['Day 1', 'Day 2', 'Day 3'],
//   };

//   const drillDownValues : any = {
//     'Category 1': [90, 100, 110],
//     'Category 2': [120, 90, 80],
//     'Category 3': [120, 85, 70],
//   };

//   const renderChart = (chartInstance: any) => {
//     const option = {
//       title: {
//         text: view === 'main' ? configurationObj.title || 'Default Title' : `Details for ${selectedCategory}`,
//         left: 'center',
//       },
//       tooltip: {
//         trigger: 'axis',
//       },
//       legend: {
//         show: configurationObj.showLegend !== undefined ? configurationObj.showLegend : true,
//         data: view === 'main' ? data.map((item: any) => item.name) : drillDownData[selectedCategory],
//       },
//       xAxis: {
//         type: 'category',
//         data: view === 'main' ? data.map((item: any) => item[configurationObj.categoryKey]) : drillDownData[selectedCategory],
//       },
//       yAxis: {
//         type: 'value',
//       },
//       series: [
//         {
//           name: 'Value',
//           type: 'bar',
//           data: view === 'main' ? data.map((item: any) => item[configurationObj.valueKey]) : drillDownValues[selectedCategory],
//           barWidth: '60%',
//           itemStyle: {
//             color: function (params: any) {
//               const colorList = chroma.scale('YlGnBu').colors(view === 'main' ? data.length : drillDownData[selectedCategory].length);
//               return colorList[params.dataIndex];
//             },
//           },
//         },
//       ],
//       grid: {
//         left: '3%',
//         right: '4%',
//         bottom: '3%',
//         containLabel: true,
//       },
//       cursor: configurationObj.showCursor ? 'pointer' : 'default',
//       dataZoom: [
//           // {
//           //   type: 'slider',    // Use the slider type for zooming
//           //   show: true,
//           //   xAxisIndex: [0],   // Enable zoom on the x-axis (category axis)
//           //   start: configurationObj.zoomStartIndex || 0,  // Start zoom
//           //   end: configurationObj.zoomEndIndex || 100,   // End zoom
//           // },
//           {
//             type: 'inside',    // Use the inside zoom, allowing zooming with mouse wheel or touch
//             xAxisIndex: [0],   // Enable zoom on the x-axis (category axis)
//             start: configurationObj.zoomStartIndex || 0,  // Start zoom
//             end: configurationObj.zoomEndIndex || 100,   // End zoom
//           }
//         ],
//     };

//     chartInstance.setOption(option);
//   };

//   useEffect(() => {
//     setIsClient(true);

//     if (isClient && chartRef.current) {
//       const myChart = echarts.init(chartRef.current);

//       renderChart(myChart);

//       myChart.on('click', (params: any) => {
//         configurationObj.onHitFn?.(params);
//         if (view === 'main') {
//           setSelectedCategory(params.name); // Store the clicked category
//           setView('drill-down'); // Switch to drill-down view
//         }
//       });

//       window.addEventListener('resize', () => {
//         myChart.resize();
//       });

//       return () => {
//         myChart.dispose();
//         window.removeEventListener('resize', () => {
//           myChart.resize();
//         });
//       };
//     }
//   }, [isClient, view, selectedCategory]);

//   return (
//     <div style={{ position: 'relative' }}>
//       {view === 'drill-down' && (
//         <button
//           onClick={() => {
//             setView('main'); // Go back to the main view
//             setSelectedCategory(''); // Clear the selected category
//           }}
//           style={{ position: 'absolute',
//             top: '5x',
//             left: '10px',
//             background: 'none',
//             border: 'none',
//             cursor: 'pointer',
//             fontSize: '24px', // You can adjust the size of the icon
//             color: '#000', // Change the icon color
//             zIndex: 10, }}
//         >
//            ← {/* This is the back arrow, you can also use an icon here */}
//         </button>
//       )}
//       <div ref={chartRef} style={{ width: '100%', height: '400px'}} />
//     </div>
//   );
// };

// export default EChartBarChart;


'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BarChartProps } from './type';
import useECharts from '../useECharts';  // Import the useECharts hook
import useDarkModeObserver from '../useDarkModeObserver';
import { useThemeOptions } from '@/ikon/components/theme-provider';
import { getColorScale } from "../common-function";

const EChartBarChart: React.FC<BarChartProps> = ({ chartData, configurationObj }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const { state } = useThemeOptions();

  const chartInstance = useECharts(chartRef as React.RefObject<HTMLDivElement>);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (chartInstance) {
      const colorScale = getColorScale(chartData, state);
      const {
        title,
        showLegend,
        categoryKey,
        showScrollx,
        valueKey,
        showCursor,
        showoverallTooltip,
        overallTooltip,
      } = configurationObj;

      const categories = chartData.map((item: any) => item[categoryKey]);
      const values = chartData.map((item: any) => item[valueKey]);

      const defaultTooltip = {
        trigger: "item",
        formatter: overallTooltip,
        axisPointer: {
          type: showCursor ? "cross" : "shadow",
        },
      };

      const options = {
        title: {
          text: title || '',
        },
        tooltip: showoverallTooltip ? defaultTooltip : undefined,
        // legend: {
        //   show: showLegend !== undefined ? showLegend : true,
        //   data: categories, // Ensuring legend items match the categories
        //   textStyle: {
        //     color: state.mode === "dark" ? "#fff" : "#000",
        //   },
        // },
        legend: {
          show: showLegend !== undefined ? showLegend : true,
          data: chartData.map((item: any) => item[categoryKey]), // Match legend with bar names
          textStyle: {
            color: state.mode === "dark" ? "#fff" : "#000",
          },
        },
        xAxis: {
          type: 'category',
          data: categories,
          axisLabel: {
            interval: showScrollx ? 'auto' : 0,
          },
        },
        yAxis: {
          type: 'value',
        },
        // series: [
        //   {
        //     name: title, // Assigning title to match legend
        //     type: 'bar',
        //     data: values,
        //     barWidth: '60%',
        //     itemStyle: {
        //       color: (params: any) => colorScale[params.dataIndex % colorScale.length],
        //     },
        //   },
        // ],
        series: chartData.map((item: any, index: number) => ({
          name: item[categoryKey], // This name should match legend items
          type: "bar",
          data: [{ value: item[valueKey], name: item[categoryKey] }],
          barWidth: "60%",
          barGap: "-100%",  // Ensures the bars are centrally aligned
          barCategoryGap: "50%",
          itemStyle: {
            color: (params: any) => colorScale[params.dataIndex % colorScale.length], // Ensure color consistency
          },
        })),
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        cursor: showCursor ? 'pointer' : 'default',
      };     
      chartInstance.setOption(options);
    }
  }, [chartInstance, chartData, configurationObj]);



  const isDarkModeEnabled = state.mode === "dark";
  useDarkModeObserver(chartInstance, isDarkModeEnabled);

  return <div ref={chartRef} style={{ width: '100%', height: '100%', minHeight: "350px" }} />;
};

export default EChartBarChart;

