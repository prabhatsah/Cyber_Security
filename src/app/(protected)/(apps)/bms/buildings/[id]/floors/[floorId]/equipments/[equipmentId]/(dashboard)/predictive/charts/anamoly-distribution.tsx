import type React from 'react';
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

// Define the type for the pie data
interface PieData {
  name: string;
  value: number;
}

interface EChartPieComponentProps {
  pieData: PieData[];
}

const EChartPieComponent: React.FC<EChartPieComponentProps> = ({ pieData }) => {
  const chartRef = useRef<HTMLDivElement | null>(null); // Reference to the chart container

  // Define the chart options for the pie chart
  const chartOptionPie = {
    tooltip: {
      trigger: 'item',
      formatter: '{b} {d}%', // Shows name and percentage
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Category',
        type: 'pie',
        radius: ['40%', '80%'], // Inner and outer radius for the pie chart
        center: ['50%', '50%'], // Position at the center
        data: pieData.map(item => ({
          value: item.value,
          name: item.name,
        })),
        label: {
          formatter: '{b} {d}%', // Format label as name and percentage
        },
        itemStyle: {
          borderRadius: 10,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  useEffect(() => {
    // Initialize the chart instance if the ref is available
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      
      // Set the option for the chart
      chart.setOption(chartOptionPie);

      // Dispose the chart on cleanup to avoid memory leaks
      return () => {
        chart.dispose();
      };
    }
  }, []); // Re-run the effect if pieData changes

  return <div ref={chartRef} style={{ height: 300, width: '100%' }} />;
};

export default EChartPieComponent;
