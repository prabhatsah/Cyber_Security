'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function FrameworkRevenueChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    
    const option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#374151',
        borderColor: '#4B5563',
        textStyle: { color: '#F9FAFB' },
        formatter: '{a} <br/>{b}: ${c}K ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: { color: '#9CA3AF' }
      },
      series: [
        {
          name: 'Framework Revenue',
          type: 'pie',
          radius: '65%',
          center: ['60%', '50%'],
          data: [
            { value: 487, name: 'ISO 27001', itemStyle: { color: '#3B82F6' } },
            { value: 623, name: 'GDPR', itemStyle: { color: '#8B5CF6' } },
            { value: 356, name: 'PCI DSS', itemStyle: { color: '#10B981' } },
            { value: 289, name: 'SOX', itemStyle: { color: '#F59E0B' } },
            { value: 234, name: 'HIPAA', itemStyle: { color: '#EF4444' } },
            { value: 187, name: 'NIST', itemStyle: { color: '#6366F1' } }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
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