import type React from 'react';
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface AccuracyData {
  month: string;
  accuracy: number;
}

interface EChartComponentPredectiveAccuracyProps {
  accuracyData: AccuracyData[];
  configurationObj: any;
}

const EChartComponentPredectiveAccuracy: React.FC<EChartComponentPredectiveAccuracyProps> = ({ accuracyData , configurationObj}) => {
  const chartRef = useRef<HTMLDivElement | null>(null); // Reference to the chart container
  //console.log('accuracyData', accuracyData);

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
  }, [accuracyData]);

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

export default EChartComponentPredectiveAccuracy;
