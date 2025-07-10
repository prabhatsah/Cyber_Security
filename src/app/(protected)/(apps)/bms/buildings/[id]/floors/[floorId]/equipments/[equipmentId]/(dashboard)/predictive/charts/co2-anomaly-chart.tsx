"use client"

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import anomalyData from './co2_anomaly_results.json';

//debugger;

//const requirednaomalyData = anomalyData;

type DataPoint = [Date, number];

interface CO2AnomalyChartProps {
  normalData?: DataPoint[];
  anomalyData?: DataPoint[];
  height?: string;
}

const CO2AnomalyChart = ({
 /*  normalData = [
    [new Date('2025-03-20 00:00:00'), 500],
    [new Date('2025-03-20 01:00:00'), 520],
    [new Date('2025-03-20 02:00:00'), 510],
    [new Date('2025-03-20 03:00:00'), 800],
    [new Date('2025-03-20 04:00:00'), 1200],
    [new Date('2025-03-20 05:00:00'), 530],
    [new Date('2025-03-20 06:00:00'), 550],
  ], */
 /*  anomalyData = [
    [new Date('2025-03-20 04:00:00'), 1200],
    [new Date('2025-03-20 07:00:00'), 900],
    [new Date('2025-03-20 08:00:00'), 1500]
  ] ,*/
  height = '100%'
}: CO2AnomalyChartProps) => {

  //import anomalyData from './co2_anomaly_results.json';
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    // Initialize the echarts instance
    chartInstance.current = echarts.init(chartRef.current);
    
    // Process the anomaly data from the JSON file
    const processedData: {
      normal: DataPoint[];
      anomaly: DataPoint[];
    } = {
      normal: [],
      anomaly: []
    };
    
    // Generate dates for the x-axis (for demonstration)
    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);
    //debugger;
   // anomalyData = requirednaomalyData;;
    
    // Process the anomaly results from JSON file
    anomalyData.forEach((item, index) => {
      const timestamp = new Date(baseDate);
      timestamp.setHours(timestamp.getHours() + index);
      
      // Random CO2 value between 300 and 1500 for visualization
      //const co2Value = 300 + Math.random() * 1200;
      //debugger;
      const co2Value = parseFloat(item['RA CO2']);
      console.log("item", item);
      
      if (item.anomaly === "-1") {
        // -1 indicates an anomaly
        processedData.anomaly.push([timestamp, co2Value]);
      } else {
        // 1 indicates normal data
        processedData.normal.push([timestamp, co2Value]);
      }
    });
    
    // Chart options
    const option = {
      title: {
        text: 'CO2 Anomaly Detection',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const date = new Date(params[0].value[0]);
          const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
          return `${formattedDate}<br/>CO2: ${params[0].value[1]} ppm`;
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        },
        axisLabel: {
          formatter: '{HH}:{mm}'
        }
      },
      yAxis: {
        type: 'value',
        name: 'CO2 (ppm)',
        splitLine: {
          show: true
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100
        }
      ],
      series: [
        {
          name: 'Normal Data',
          type: 'line',
          showSymbol: false,
          data: processedData.normal.map(item => [item[0].getTime(), item[1]]),
          color: '#3BB273',
          lineStyle: {
            width: 2
          }
        },
        {
          name: 'Anomaly',
          type: 'scatter',
          symbolSize: 10,
          data: processedData.anomaly.map(item => [item[0].getTime(), item[1]]),
          color: '#FF6B6B',
          itemStyle: {
            borderColor: '#000',
            borderWidth: 1
          }
        }
      ],
      legend: {
        data: ['Normal Data', 'Anomaly'],
        bottom: 10
      },
      grid: {
        left: 50,
        right: 50,
        top: 70,
        bottom: 70
      }
    };
    
    // Set the options and render the chart
    chartInstance.current.setOption(option);
    
    // Handle resize events
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, []);

  return (
    <div 
      ref={chartRef} 
      style={{ width: '100%', height: height, minHeight: '400px' }}
    />
  );
};

export default CO2AnomalyChart;
