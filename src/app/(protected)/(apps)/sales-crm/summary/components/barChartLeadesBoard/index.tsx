'use client'
import { useThemeOptions } from '@/ikon/components/theme-provider';
import ReactECharts, { EChartsOption } from 'echarts-for-react';
import React, { useMemo } from 'react'

export default function BarChartLeadersBoard({ salesLeaderBoard }: { salesLeaderBoard: { name: string | null | undefined, revenue: number }[] }) {

  const { state } = useThemeOptions();

  const chartColor = useMemo(() =>
    state.mode === 'dark' ? Object.values(state.dark) : Object.values(state.light)
    , []);

  const textColor = useMemo(() => {
    if (state.mode === 'dark') {
      return `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim()})`;
    } else {
      return `hsl(${getComputedStyle(document.documentElement).getPropertyValue('--background').trim()})`;
    }
  }, []);

  const chartOption = useMemo(() => {
    const sortedSalesLeaderBoard = [...salesLeaderBoard].sort((a, b) => a.revenue - b.revenue);
    return {
      title: {
        text: "Sales Leaderboard (Top 5)",
        textStyle: {
          color: textColor,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
        axisLine: {
          lineStyle: {
            color: textColor
          }
        }
      },
      yAxis: {
        type: "category",
        data: sortedSalesLeaderBoard.map((item) => item.name),
        axisLine: {
          lineStyle: {
            color: textColor
          }
        }
      },
      series: [
        {
          name: "Revenue",
          type: "bar",
          data: sortedSalesLeaderBoard.map((item, index) => ({
            value: item.revenue,
            itemStyle: { color: chartColor[index % chartColor.length] },
          })),
        },
      ],
    } as EChartsOption;
  }, [])

  return (
    <div>
      <ReactECharts option={chartOption} />
    </div>
  )
}
