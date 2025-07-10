import type React from 'react';
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

// Define the type for the chart data
interface EnergyData {
  month: string;
  hvac: number;
  lighting: number;
  equipment: number;
}

interface EChartBarComponentProps {
  energyData: EnergyData[];
}

const EChartBarComponent: React.FC<EChartBarComponentProps> = ({ energyData }) => {
  const chartRef = useRef<HTMLDivElement | null>(null); // Reference to the chart container
  
  // Set chart options
  const chartOptionStackedBar = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['HVAC', 'Lighting', 'Equipment'],
      top: '90%',
      left: 'center',
    },
    xAxis: {
      type: 'category',
      data: energyData.map(item => item.month), // Extract month for xAxis
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'HVAC',
        type: 'bar',
        stack: 'total',
        data: energyData.map(item => item.hvac), // Extract HVAC data for the series
        itemStyle: {
          color: '#8884d8',
        },
      },
      {
        name: 'Lighting',
        type: 'bar',
        stack: 'total',
        data: energyData.map(item => item.lighting), // Extract lighting data for the series
        itemStyle: {
          color: '#82ca9d',
        },
      },
      {
        name: 'Equipment',
        type: 'bar',
        stack: 'total',
        data: energyData.map(item => item.equipment), // Extract equipment data for the series
        itemStyle: {
          color: '#ffc658',
        },
      },
    ],
  };

  useEffect(() => {
    // Initialize the chart instance if the ref is available
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      
      // Set the option for the chart
      chart.setOption(chartOptionStackedBar);

      // Dispose the chart on cleanup to avoid memory leaks
      return () => {
        chart.dispose();
      };
    }
  }, [energyData]); // Re-run the effect if energyData changes

  return <div ref={chartRef} style={{ height: 400, width: '100%' }} />;
};

export default EChartBarComponent;
