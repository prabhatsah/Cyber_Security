'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function DeviceStatusChart() {
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
          name: 'Device Status',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
            color: '#9CA3AF',
            formatter: '{b}: {c}'
          },
          labelLine: {
            show: true,
            lineStyle: { color: '#4B5563' }
          },
          data: [
            { value: 4, name: 'Online', itemStyle: { color: '#10B981' } },
            { value: 1, name: 'Warning', itemStyle: { color: '#F59E0B' } },
            { value: 1, name: 'Critical', itemStyle: { color: '#EF4444' } }
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