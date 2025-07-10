'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function ComplianceOverviewChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#374151',
        borderColor: '#4B5563',
        textStyle: { color: '#F9FAFB' }
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        textStyle: { color: '#9CA3AF' }
      },
      series: [
        {
          name: 'Compliance Status',
          type: 'pie',
          radius: ['30%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold',
              color: '#F9FAFB'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: 'Compliant', itemStyle: { color: '#10B981' } },
            { value: 735, name: 'In Progress', itemStyle: { color: '#F59E0B' } },
            { value: 580, name: 'Gaps Identified', itemStyle: { color: '#EF4444' } },
            { value: 484, name: 'Not Started', itemStyle: { color: '#6B7280' } }
          ]
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