'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function CustomerGrowthChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#374151',
        borderColor: '#4B5563',
        textStyle: { color: '#F9FAFB' }
      },
      legend: {
        data: ['New Customers', 'Total Customers'],
        textStyle: { color: '#9CA3AF' },
        top: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisLabel: { color: '#9CA3AF' },
        axisLine: { lineStyle: { color: '#4B5563' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#9CA3AF' },
        axisLine: { lineStyle: { color: '#4B5563' } },
        splitLine: { lineStyle: { color: '#374151' } }
      },
      series: [
        {
          name: 'New Customers',
          type: 'bar',
          data: [35, 42, 38, 55, 48, 62, 71, 67, 78, 85, 92, 98],
          itemStyle: { color: '#10B981' }
        },
        {
          name: 'Total Customers',
          type: 'line',
          smooth: true,
          data: [150, 192, 230, 285, 333, 395, 466, 533, 611, 696, 788, 886],
          lineStyle: { color: '#8B5CF6', width: 3 },
          itemStyle: { color: '#8B5CF6' }
        }
      ]
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, []);

  return <div ref={chartRef} className="w-full h-80" />;
}