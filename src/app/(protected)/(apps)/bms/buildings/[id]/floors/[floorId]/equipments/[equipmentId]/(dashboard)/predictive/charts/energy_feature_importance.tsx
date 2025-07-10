'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Card } from "@/shadcn/ui/card";

interface FeatureImportanceData {
  [key: string]: number;
}

const EnergyFeatureImportance: React.FC<{ data?: FeatureImportanceData }> = ({ 
  data = {
    "RA_Damper_Position": 0.25480934977531433,
    "day_of_week": 0.25290045142173767,
    "OA_Flow": 0.20824801921844482,
    "SA_Pressure_Setpoint": 0.09088488668203354,
    "SA_Pressure": 0.0841270387172699,
    "Pressure_Diff": 0.03527902811765671,
    "hour_sin": 0.0290699265897274,
    "hour_cos": 0.02408488281071186,
    "SA_Temperature": 0.020596429705619812,
    "Damper_Ratio": 0.0,
    "month": 0.0
  }
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    // Convert data object to arrays for ECharts
    const sortedData = Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10); // Take top 10 features
    
    const featureNames = sortedData.map(([name]) => name);
    const values = sortedData.map(([, value]) => value);

    // Initialize chart
    if (chartRef.current) {
      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current);
      }

      const option: echarts.EChartsOption = {
        title: {
          text: 'Energy Feature Importance',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params: any) {
            const dataIndex = params[0].dataIndex;
            const name = featureNames[dataIndex];
            const value = (values[dataIndex] * 100).toFixed(2);
            return `${name}: ${value}%`;
          }
        },
        grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          max: 'dataMax',
          axisLabel: {
            formatter: '{value}%'
          }
        },
        yAxis: {
          type: 'category',
          data: featureNames,
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300
        },
        series: [
          {
            realtimeSort: true,
            name: 'Feature Importance',
            type: 'bar',
            data: values.map(value => value * 100), // Convert to percentage
            label: {
              show: true,
              position: 'right',
              valueAnimation: true,
              formatter: function(params: any) {
                return params.value.toFixed(2) + '%';
              }
            },
            itemStyle: {
              color: function(params: any) {
                // Create a gradient color based on the value
                const colorList = [
                  '#91cc75', // green
                  '#fac858', // yellow
                  '#ee6666'  // red
                ];
                const index = Math.floor(params.dataIndex / (featureNames.length / 3));
                return colorList[Math.min(index, colorList.length - 1)];
              }
            }
          }
        ],
        legend: {
           show: false
        },
        animationDuration: 0,
        animationDurationUpdate: 1000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
      };

      chartInstance.current.setOption(option);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [data]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Card className="w-full p-4">
      <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
    </Card>
  );
};

export default EnergyFeatureImportance;