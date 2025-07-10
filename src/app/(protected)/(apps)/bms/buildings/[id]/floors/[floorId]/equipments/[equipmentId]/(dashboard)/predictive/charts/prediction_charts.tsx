import type React from 'react';
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface AccuracyData {
  timestamp: string;
  prediction: number;
}

interface EChartComponentPredectiveAccuracyProps {
  accuracyData: AccuracyData[];
  configurationObj: any;
}

const EChartComponentPredection: React.FC<EChartComponentPredectiveAccuracyProps> = ({ accuracyData, configurationObj,label_unit }) => {
  const chartRef = useRef<HTMLDivElement | null>(null); // Reference to the chart container
  //console.log('accuracyData', accuracyData);

  useEffect(() => {
    if (!chartRef.current) return;
    
    // Initialize chart only once
    let chart: echarts.ECharts;
    if (!(chartRef.current as any).__echarts_instance__) {
      chart = echarts.init(chartRef.current);
    } else {
      chart = echarts.getInstanceByDom(chartRef.current)!;
    }
    
    // Create a deep copy of the configuration object
    const updatedConfig = JSON.parse(JSON.stringify(configurationObj));
    
    // Update the series data with the accuracyData values
    if (updatedConfig.series && updatedConfig.series.length > 0) {
      updatedConfig.series[0].data = accuracyData.map(item => item.prediction);
      updatedConfig.series[0].name = label_unit; // Set the name of the series to the unit of measurement
    }

    if(updatedConfig.legend){
      updatedConfig.legend.data = [label_unit]; // Set the legend data to the unit of measurement
    }
    
    // Update the x-axis data with the timestamps
    if (updatedConfig.xAxis) {
      updatedConfig.xAxis.data = accuracyData.map(item => {
        // Format timestamp as needed
        return item.timestamp instanceof Date 
          ? item.timestamp.toLocaleString() 
          : item.timestamp;
      });
    }

    if (updatedConfig.yAxis && accuracyData.length > 0) {
      const predictionValues = accuracyData.map(item => item.prediction);
      if (predictionValues.length > 0) {
        updatedConfig.yAxis.min = Math.min(...predictionValues).toFixed(4);
        updatedConfig.yAxis.max = Math.max(...predictionValues).toFixed(4);
      }
    }
    
    // Use setTimeout to ensure the chart is rendered before setting options
    setTimeout(() => {
      chart.setOption(updatedConfig, true); // Add true to clear previous option
    }, 0);

    // Resize the chart when the window is resized
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    // Dispose the chart on cleanup to avoid memory leaks
    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [accuracyData, configurationObj, label_unit]); // Re-run the effect when accuracyData or configurationObj changes

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

export default EChartComponentPredection;
