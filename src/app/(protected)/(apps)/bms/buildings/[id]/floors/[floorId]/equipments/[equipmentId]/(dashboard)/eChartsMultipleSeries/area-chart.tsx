import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { getData } from '@/app/(protected)/(apps)/bms/get-data/get-cassandra-data';
import { Skeleton } from '@/shadcn/ui/skeleton'; // Adjust path if needed

interface MonitoringItem {
  data_received_on: string;
  monitoring_data: string;
}

const EAreaChartComponent: React.FC = () => {
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
    startDate: null,
    endDate: null,
    timePeriod: 1000*60*60*1,
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
      const sortedData = [...energyData].sort((a, b) => {
        const timeA = new Date(a.data_received_on.replace(' UTC', 'Z')).getTime();
        const timeB = new Date(b.data_received_on.replace(' UTC', 'Z')).getTime();
        return timeA - timeB;
      });

      const timestamps: string[] = [];
      const powerValues: string[] = [];

      // biome-ignore lint/complexity/noForEach: <explanation>
      sortedData.forEach(item => {
        const date = new Date(item.data_received_on.replace(' UTC', 'Z'));
        const formatted = new Intl.DateTimeFormat(undefined, {
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }).format(date);

        timestamps.push(formatted);
        powerValues.push(Number.parseFloat(item.monitoring_data).toFixed(2));
      });

      const configurationObj = {
        title: {
          text: 'Fan Power (KW) – Raw Data',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: timestamps,
          name: 'Time',
          axisLabel: {
            rotate: 45,
            fontSize: 10,
          },
        },
        yAxis: {
          type: 'value',
          name: 'Power (KW)',
        },
        series: [
          {
            name: 'Power (KW)',
            type: 'line',
            data: powerValues,
            areaStyle: {}, // Enables area chart
            smooth: true,
            itemStyle: {
              color: '#3BA272',
            },
            lineStyle: {
              width: 2,
              color: '#3BA272',
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
        <Skeleton className="w-full h-[300px] rounded-md bg-gray-400" />
      ) : (
        <div
          ref={chartRef}
          style={{
            height: '300px',
            width: '100%',
          }}
        />
      )}
    </>
  );
};

export default EAreaChartComponent;
