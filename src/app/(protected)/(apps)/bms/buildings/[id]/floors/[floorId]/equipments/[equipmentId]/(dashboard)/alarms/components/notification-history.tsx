'use client';
import type React from 'react';
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
} from 'echarts/components';
import { CustomChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  CustomChart,
  CanvasRenderer,
]);

type TimelineData = {
  from: number;
  to: number;
  statusStr: string;
  color: string;
};

type Props = {
  data: TimelineData[];
};

const DeviceTimelineChart: React.FC<Props> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const chart = echarts.init(chartRef.current);

    const chartData = data.map((d) => ({
      name: 'Device',
      value: [0, d.from, d.to, d.statusStr],
      itemStyle: { color: d.color },
    }));

    const option: echarts.EChartsCoreOption = {
      tooltip: {
        formatter: (params: any) => {
          const { value, color } = params;
          const label = value[3];
          const icon = color === 'green' ? '🟢' : color === 'yellow' ? '🟡' : '⚠️';
          return `${icon} ${label}`;
        },
      },
      grid: {
        left: 60,
        right: 20,
        top: 20,
        bottom: 50,
      },
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter: (value: number) => new Date(value).toLocaleString(),
        },
      },
      yAxis: {
        type: 'category',
        data: ['Device'],
      },
      dataZoom: [
        {
          type: 'inside',
          show: true,
          xAxisIndex: 0,
          minValueSpan: 3600 * 1000, // 1 hour
          maxValueSpan: 30 * 24 * 3600 * 1000, // 30 days
          handleSize: '120%',
          fillerColor: 'transparent', // Selected area (middle)
          dataBackground: {
            lineStyle: {
              color: 'transparent'
            },
            areaStyle: {
              color: 'transparent' // Outside selection (both left & right)
            },
          },
          textStyle: {
            fontWeight: 'semi-bold', // 🔥 This makes the text bold
            fontSize: 14,       // Optional: make it larger
            color: '#333'        // Optional: change color
          },
        //  borderColor: 'transparent'
        },
        {
          type: 'inside',
          xAxisIndex: 0,
        },
      ],
      series: [
        {
          type: 'custom',
          renderItem: (params, api) => {
            const yIndex = api.value(0);
            const start = api.coord([api.value(1), yIndex]);
            const end = api.coord([api.value(2), yIndex]);
            const height = 20;
            const width = Math.max(end[0] - start[0], 2); // prevent invisible bars

            return {
              type: 'rect',
              shape: {
                x: start[0],
                y: start[1] - height / 2,
                width,
                height,
              },
              style: api.style(),
            };
          },
          encode: {
            x: [1, 2],
            y: 0,
          },
          data: chartData,
        },
      ],
    };

    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());

    return () => {
      chart.dispose();
      window.removeEventListener('resize', () => chart.resize());
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: 200 }} />;
};

export default DeviceTimelineChart;
