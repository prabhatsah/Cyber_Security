import type React from 'react';
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface TemperatureData {
  time: string;
  temperature: number;
  setpoint: number;
  humidity: number;
}

interface EChartComponentTempAndHumidityProps {
  temperatureData: TemperatureData[];
  configurationObj: any;
}

const EChartComponentTempAndHumidity: React.FC<EChartComponentTempAndHumidityProps> = ({ temperatureData, configurationObj }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);

   
      // Set the chart options
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
  }, [temperatureData]);

  return (
    <div
      ref={chartRef}
      style={{
        height: '400px',
        width: '100%',
      }}
    />
  );
};

export default EChartComponentTempAndHumidity;
