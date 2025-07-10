import type React from 'react';
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface EnergyData {
  date: string;
  hvac: number;
  lighting: number;
  equipment: number;
}

interface EChartComponentEnergyConsupLineProps {
  energyData: EnergyData[];
  energyDataConfiguration: any;
}

const EChartComponentEnergyConsupLine: React.FC<EChartComponentEnergyConsupLineProps> = ({ energyData , energyDataConfiguration}) => {
  const chartRef = useRef<HTMLDivElement | null>(null); // Reference to the chart container

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);

      

      // Set the chart options
      chart.setOption(energyDataConfiguration);

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
  }, [energyData]);

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

export default EChartComponentEnergyConsupLine;
