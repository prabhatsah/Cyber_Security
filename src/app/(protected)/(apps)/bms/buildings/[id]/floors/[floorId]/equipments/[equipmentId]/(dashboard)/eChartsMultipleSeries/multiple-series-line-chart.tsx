import type React from "react";
import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { getData, getLiveData } from "@/app/(protected)/(apps)/bms/get-data/get-cassandra-data";
import { Skeleton } from "@/shadcn/ui/skeleton"; // Adjust path if needed


interface ChartData {
  time: string;
  temperature: number;
  humidity: number;
}

interface EChartLineComponentProps {
  chartData: {
    temperatureData: ChartData[];
    humidityData: ChartData[];
  };
}
const formatTime = (time: string): string => {
  const correctedTime = time.replace(" UTC", "Z");
  const date = new Date(correctedTime);
  if (Number.isNaN(date.getTime())) {
    console.error("Invalid date:", time);
    return "Invalid Date";
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }).format(date);
};

const param = {
  dataCount: 100,
  service_name: null,
  serviceNameList: ["AHU-01 RA Temp", "RA Humid"],
  startDate: null,
  endDate: null,
  timePeriod: null,
};

const EChartLineComponent: React.FC<EChartLineComponentProps> = ({
  chartData,
  chartType
}) => {
  const [data, setData] = useState<any[]>([]);
  const [liveData, setLiveData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const chartRef = useRef<HTMLDivElement | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getData(param);
      fetchedData.sort(
        (a: any, b: any) =>
          new Date(a.data_received_on.replace(" UTC", "")).getTime() -
          new Date(b.data_received_on.replace(" UTC", "")).getTime()
      );
      setData(fetchedData);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Fetch live data
  useEffect(() => {
    const fetchLiveData = () => {
      function updateLiveData(event: any) {
        if (event?.data) {
          setLiveData(event.data);
        }
      }
      getLiveData(updateLiveData);
    };

    fetchLiveData();

    return () => {
      // Cleanup logic for live data subscription
    };
  }, []);

  // Merge live data with existing data
  useEffect(() => {
    const dataPoint = {};
    if (liveData?.monitoring_data) {
      const { data_received_on, ip, monitoring_data: monitoringArray, client_id } = liveData;

      const baseDataPoint = {
        data_received_on: data_received_on || null,
        device_id: ip || "Unknown Device",
        client_id: client_id || "Unknown Client",
      };

      if (Array.isArray(monitoringArray)) {
        for (const item of monitoringArray) {
          const service_name = item.object_name || "Unknown Service";
          const present_value = item.present_value || "Unknown Data";

          if (service_name === "AHU-01 RA Temp") {
            console.log("AHU-01 RA Temp", {
              ...baseDataPoint,
              service_name,
              monitoring_data: present_value,
            });
            setData((prevData) => [
              ...prevData,
              {
                ...baseDataPoint,
                service_name,
                monitoring_data: present_value,
              },
            ]);
          }

          if (service_name === "RA Humid") {
            setData((prevData) => [
              ...prevData,
              {
                ...baseDataPoint,
                service_name,
                monitoring_data: present_value,
              },
            ]);
          }
        }
      } else {
        console.warn("Monitoring data is not an array:", monitoringArray);
      }
    }

  }, [liveData]);

  const temperatureData = data.filter(
    (item) => item.service_name === "AHU-01 RA Temp"
  );
  const humidityData = data.filter((item) => item.service_name === "RA Humid");

  const formattedTemperatureData = temperatureData.map((item) => ({
    ...item,
    time: formatTime(item.data_received_on),
  }));

  const formattedHumidityData = humidityData.map((item) => ({
    ...item,
    time: formatTime(item.data_received_on),
  }));
  const chartOptionMultipleLineTempVsHumid = {
    tooltip: { trigger: "axis" },
    legend: {
      data: ["Temperature (°C)", "Humidity (%)"],
      top: "90%",
      left: "center",
    },
    toolbox: {
      feature: {
          saveAsImage: {
              type: 'png', 
              name: 'Temperature and Humidity Chart',
              title: 'Save as PNG',
              iconStyle: {
                  borderColor: '#fff', 
              },
          }
      }
  },
  yAxis: [
    {
      type: 'value',
      name: 'Temperature (°C)',
      min: (value) => {
        return Math.floor(value.min - 1); // or use a smaller/larger padding
      },
      max: (value) => Math.ceil(value.max + 1),
      axisLabel: { formatter: '{value}°C' },
    },
    {
      type: 'value',
      name: 'Humidity (%)',
      position: 'right',
      min: (value) => Math.floor(value.min - 2),
      max: (value) => Math.ceil(value.max + 2),
      axisLabel: { formatter: '{value}%' },
    },
  ],
    series: [
      {
        name: "Temperature (°C)",
        type: chartType,
        data: formattedTemperatureData.map((item) => item.monitoring_data),
        lineStyle: { color: "#8884d8" },
        symbolSize: 8,
        smooth: true,
      },
      {
        name: "Humidity (%)",
        type: chartType,
        data: formattedHumidityData.map((item) => item.monitoring_data),
        lineStyle: { color: "#82ca9d" },
        yAxisIndex: 1,
      },
    ],
  };

  useEffect(() => {
    if (!chartRef.current || loading) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      ...chartOptionMultipleLineTempVsHumid,
      xAxis: {
        ...chartOptionMultipleLineTempVsHumid.xAxis,
        data: formattedTemperatureData.map((item) => item.time),
      },
      series: [
        {
          ...chartOptionMultipleLineTempVsHumid.series[0],
          data: formattedTemperatureData.map((item) => item.monitoring_data),
        },
        {
          ...chartOptionMultipleLineTempVsHumid.series[1],
          data: formattedHumidityData.map((item) => item.monitoring_data),
        },
      ],
    };
    // console.log(data);

    chart.setOption(option, true); // <- `true` ensures the option is updated completely

    return () => {
      chart.dispose();
    };
  }, [formattedTemperatureData, formattedHumidityData, loading]);

  return (
    <div>
      {loading ? (
        <Skeleton className="w-full h-[300px] rounded-md bg-gray-400" />
      ) : (
        <div ref={chartRef} style={{ height: 300, width: "100%" }} />
      )}
    </div>
  );
};

export default EChartLineComponent;
