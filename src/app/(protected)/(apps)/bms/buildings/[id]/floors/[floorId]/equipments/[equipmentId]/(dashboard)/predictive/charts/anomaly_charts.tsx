import * as echarts from 'echarts';

type DataPoint = [Date, number];

interface ChartOption {
  xAxis: {
    type: string;
  };
  yAxis: {
    type: string;
    name: string;
  };
  series: Array<{
    data: DataPoint[];
    type: string;
    name: string;
    symbolSize?: number;
    itemStyle?: {
      color: string;
    };
  }>;
  [key: string]: any; // Add index signature to allow any other properties
}

// Initialize chart only if DOM is available
const initChart = (): void => {
  const chartDom = document.getElementById('main');
  if (!chartDom) return;
  
  const chart = echarts.init(chartDom);
  const option: ChartOption = {
    xAxis: {
      type: 'time',
    },
    yAxis: {
      type: 'value',
      name: 'CO2 (ppm)'
    },
    series: [
      {
        data: [
          [new Date('2025-03-20 00:00:00'), 500],
          [new Date('2025-03-20 01:00:00'), 520],
          [new Date('2025-03-20 02:00:00'), 510],
          [new Date('2025-03-20 03:00:00'), 800],
          [new Date('2025-03-20 04:00:00'), 1200],
          [new Date('2025-03-20 05:00:00'), 530],
          [new Date('2025-03-20 06:00:00'), 550],
        ],
        type: 'line',
        name: 'CO2 Level'
      },
      {
        data: [
          [new Date('2025-03-20 04:00:00'), 1200],
          [new Date('2025-03-20 07:00:00'), 900],
          [new Date('2025-03-20 08:00:00'), 1500]
        ],
        type: 'scatter',
        name: 'Anomalies',
        symbolSize: 10,
        itemStyle: {
          color: 'red'
        }
      }
    ]
  };

  chart.setOption(option);
};

// Execute the function when the component mounts
if (typeof document !== 'undefined') {
  initChart();
}

export {};