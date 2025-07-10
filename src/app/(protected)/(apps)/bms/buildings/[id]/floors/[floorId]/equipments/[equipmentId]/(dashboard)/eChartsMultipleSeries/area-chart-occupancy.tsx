import type React from 'react';
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface OccupancyData {
  time: string;
  occupancy: number;
}

interface EChartAreaOccupancyComponentProps {
  occupancyData: OccupancyData[];
  configurationObj: any;
}

const EChartAreaOccupancyComponent: React.FC<EChartAreaOccupancyComponentProps> = ({ occupancyData ,configurationObj}) => {
  const chartRef = useRef<HTMLDivElement | null>(null); // Reference to the chart container

  useEffect(() => {
    // Initialize the chart instance if the ref is available
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);

     
      // Set the option for the chart
      chart.setOption(configurationObj);

      // Resize the chart when the window is resized
      window.addEventListener('resize', () => {
        chart.resize();
      });

      // Dispose the chart on cleanup to avoid memory leaks
      return () => {
        chart.dispose();
        window.removeEventListener('resize', () => chart.resize());
      };
    }
  }, [occupancyData]);

  return (
    <div
      ref={chartRef}
      style={{
        height: '300px',
        width: '100%',
      }}
    />
  );
};

export default EChartAreaOccupancyComponent;
