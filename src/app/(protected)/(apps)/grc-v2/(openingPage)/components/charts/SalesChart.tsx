'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function SalesChart() {
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
        data: ['Revenue', 'Subscriptions'],
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
      yAxis: [
        {
          type: 'value',
          name: 'Revenue ($K)',
          nameTextStyle: { color: '#9CA3AF' },
          axisLabel: { color: '#9CA3AF' },
          axisLine: { lineStyle: { color: '#4B5563' } },
          splitLine: { lineStyle: { color: '#374151' } }
        },
        {
          type: 'value',
          name: 'Subscriptions',
          nameTextStyle: { color: '#9CA3AF' },
          axisLabel: { color: '#9CA3AF' },
          axisLine: { lineStyle: { color: '#4B5563' } }
        }
      ],
      series: [
        {
          name: 'Revenue',
          type: 'line',
          smooth: true,
          data: [180, 195, 210, 225, 240, 260, 285, 310, 335, 360, 385, 410],
          lineStyle: { color: '#3B82F6', width: 3 },
          itemStyle: { color: '#3B82F6' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
            ])
          }
        },
        {
          name: 'Subscriptions',
          type: 'bar',
          yAxisIndex: 1,
          data: [45, 52, 58, 65, 72, 78, 85, 92, 98, 105, 112, 120],
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