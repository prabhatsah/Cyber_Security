'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function RiskTrendChart() {
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
        data: ['High Risk', 'Medium Risk', 'Low Risk'],
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
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
          name: 'High Risk',
          type: 'line',
          stack: 'Total',
          smooth: true,
          data: [1, 2, 1, 3, 2, 1, 1],
          lineStyle: { color: '#EF4444' },
          itemStyle: { color: '#EF4444' },
          areaStyle: { color: 'rgba(239, 68, 68, 0.3)' }
        },
        {
          name: 'Medium Risk',
          type: 'line',
          stack: 'Total',
          smooth: true,
          data: [3, 2, 4, 3, 5, 4, 2],
          lineStyle: { color: '#F59E0B' },
          itemStyle: { color: '#F59E0B' },
          areaStyle: { color: 'rgba(245, 158, 11, 0.3)' }
        },
        {
          name: 'Low Risk',
          type: 'line',
          stack: 'Total',
          smooth: true,
          data: [2, 3, 1, 2, 1, 3, 4],
          lineStyle: { color: '#10B981' },
          itemStyle: { color: '#10B981' },
          areaStyle: { color: 'rgba(16, 185, 129, 0.3)' }
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