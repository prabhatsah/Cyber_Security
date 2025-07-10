'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function ComplianceProgressChart() {
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
        data: ['Controls Implemented', 'Policies Created', 'Risk Assessment'],
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
        data: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
        axisLabel: { color: '#9CA3AF' },
        axisLine: { lineStyle: { color: '#4B5563' } }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: { 
          color: '#9CA3AF',
          formatter: '{value}%'
        },
        axisLine: { lineStyle: { color: '#4B5563' } },
        splitLine: { lineStyle: { color: '#374151' } }
      },
      series: [
        {
          name: 'Controls Implemented',
          type: 'line',
          smooth: true,
          data: [15, 28, 42, 55, 68, 75, 82, 89],
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
          name: 'Policies Created',
          type: 'line',
          smooth: true,
          data: [8, 18, 32, 45, 58, 68, 78, 85],
          lineStyle: { color: '#10B981', width: 3 },
          itemStyle: { color: '#10B981' }
        },
        {
          name: 'Risk Assessment',
          type: 'line',
          smooth: true,
          data: [25, 35, 48, 62, 71, 78, 85, 92],
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