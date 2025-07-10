import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { getData } from '@/app/(protected)/(apps)/bms/get-data/get-cassandra-data';
import { Skeleton } from '@/shadcn/ui/skeleton'; // Adjust path if needed

// Define types
interface MonitoringItem {
  data_received_on: string;
  monitoring_data: string;
}

const EBarChartComponent: React.FC = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [energyData, setEnergyData] = useState<MonitoringItem[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const param = {
    dataCount: null,
    service_name: null,
    serviceNameList: ['Fan Power meter (KW)'],
    startDate: sevenDaysAgo.getTime(),
    endDate: today.getTime(),
    timePeriod: null,
  };

  const generateEnergyData = async () => {
    return await getData(param);
  };

  useEffect(() => {
    const fetchEnergyData = async () => {
      setLoading(true);
      const data = await generateEnergyData();
      setEnergyData(data);
      setLoading(false);
    };
    fetchEnergyData();
  }, []);

  useEffect(() => {
    if (chartRef.current && energyData.length > 0) {
      const chart = echarts.init(chartRef.current);

      const groupedData: Record<string, number[]> = {};

      // biome-ignore lint/complexity/noForEach: <explanation>
      energyData.forEach(item => {
        const dateStr = new Date(item.data_received_on.replace(' UTC', 'Z')).toISOString().split('T')[0];
        const val = parseFloat(item.monitoring_data);
        if (!groupedData[dateStr]) {
          groupedData[dateStr] = [];
        }
        groupedData[dateStr].push(val);
      });

      const sortedDates = Object.keys(groupedData).sort();
      const avgPowerPerDay = sortedDates.map(date =>
        (groupedData[date].reduce((sum, val) => sum + val, 0) / groupedData[date].length).toFixed(2)
      );

      const configurationObj = {
        title: {
          text: 'Weekly Avg Fan Power (KW)',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: sortedDates,
          name: 'Date',
          axisLabel: {
            rotate: 45,
          },
        },
        yAxis: {
          type: 'value',
          name: 'Avg Power (KW)',
        },
        series: [
          {
            name: 'Avg Power',
            type: 'bar',
            data: avgPowerPerDay,
            itemStyle: {
              color: '#5470C6',
            },
          },
        ],
      };

      chart.setOption(configurationObj);

      const resizeHandler = () => chart.resize();
      window.addEventListener('resize', resizeHandler);

      return () => {
        chart.dispose();
        window.removeEventListener('resize', resizeHandler);
      };
    }
  }, [energyData]);

  return (
    <>
      {loading ? (
        <Skeleton className="w-full h-[400px] rounded-md bg-gray-400" />
      ) : (
        <div
          ref={chartRef}
          style={{
            height: '400px',
            width: '100%',
          }}
        />
      )}
    </>
  );
};

export default EBarChartComponent;
