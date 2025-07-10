import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { getData, getLiveData } from '../../../get-data/get-cassandra-data';

interface ChartData {
    time: string; // Time in UTC
    temperature: number;
    humidity: number;
}

interface EChartLineComponentProps {
    chartData: {
        temperatureData: ChartData[];
        humidityData: ChartData[];
    };
}

const createParam = function (serviceName: string ,startDate: any , endDate: any) {
    let param = {}
    if (serviceName == 'RA Temp') {
        param = {
            "service_id": "00000194CA70D50D",
            "startDate": startDate ? new Date(startDate).getTime() : new Date('Tue Mar 25 2025 11:25:59').getTime(),
            "endDate": endDate ? new Date(endDate).getTime() : new Date().getTime(),

        }
    } else {
        var serviceIdList = [];
        if (serviceName == "RA  temperature setpoint") {
            serviceIdList.push("RA Temp control( Valve Feedback)");
            serviceIdList.push("AHU-01 RA Temp");
            serviceIdList.push("RA  temperature setpoint")
        } else if (serviceName == "SA Pressure setpoint") {
            serviceIdList.push("SA Pressure setpoint");
            serviceIdList.push("SA pressure")
        } else if (serviceName == "ra CO2 setpoint") {
            serviceIdList.push("ra CO2 setpoint");
            serviceIdList.push("RA damper control")
            serviceIdList.push("RA CO2")
        }
        // Get current time for startDate
        let startDate = new Date();

        // Set startDate as current time
        let startDateTimestamp = startDate.getTime();

        // Calculate endDate as 30 minutes before startDate
        let endDateTimestamp = new Date(startDate.getTime() - 30 * 60 * 1000).getTime(); // Subtract 30 minutes
        param = {
            "serviceNameList": serviceIdList,
            "startDate": endDateTimestamp,
            "endDate": startDateTimestamp,
        }
    }
    return param;
}
const EChartAreaComponent: React.FC<EChartLineComponentProps> = ({ chartData }) => {
    const [data, setData] = useState<any[]>([]); // Stores all data
    const [liveData, setLiveData] = useState<any | null>(null); // Stores live data

    const chartRef = useRef<HTMLDivElement | null>(null);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            const param = createParam('RA  temperature setpoint', null, null);
            const fetchedData = await getData(param);
            fetchedData.sort(
                (a: any, b: any) => new Date(a.data_received_on.replace(' UTC', '')).getTime() - new Date(b.data_received_on.replace(' UTC', '')).getTime()
            );
            console.log("RA  temperature setpoin", fetchedData);
            setData(fetchedData);
        };

        fetchData();
    }, []);

    // Fetch live data
    useEffect(() => {
        const fetchLiveData = () => {
            function updateLiveData(event: any) {
                if (event?.data) {
                    setLiveData(event.data); // Update state with new live data
                }
            }
            getLiveData(updateLiveData);
        };

        fetchLiveData();

        // Cleanup: In case the live data fetching can be stopped
        return () => {
            // Add any cleanup code here if needed for live data subscription
        };
    }, []); // Empty dependency array to set up live data once when the component mounts

    // Merge live data with existing data
    useEffect(() => {
        // if (liveData.service_name === 'AHU-01 RA Temp' || liveData.service_name === 'RA Humid') {
        if (liveData && typeof liveData === 'object' && (liveData.service_name === 'AHU-01 RA Temp' || liveData.service_name === 'RA Humid')) {
            // Here, we add new live data to the existing data array
            setData(prevData => [...prevData, liveData]);
        }
    }, [liveData]);

    // Format time function
    const formatTime = (time: string): string => {
        const correctedTime = time.replace(' UTC', 'Z');
        const date = new Date(correctedTime);

        if (Number.isNaN(date.getTime())) {
            console.error('Invalid date:', time);
            return 'Invalid Date';
        }

        return new Intl.DateTimeFormat(undefined, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
        }).format(date);
    };

    // Separate temperature and humidity data
    const RA_temperature_setpoint = data.filter((item) => item.service_name === 'RA  temperature setpoint');
    const AHU_01_RA_Temp = data.filter((item) => item.service_name === 'AHU-01 RA Temp');
    const RA_Temp_control_Valve_Feedback = data.filter((item) => item.service_name === 'RA Temp control( Valve Feedback)');

    const formatted_RA_temperature_setpoint = RA_temperature_setpoint.map((item) => ({
        ...item,
        time: formatTime(item.data_received_on),
    }));
    
    const formatted_AHU_01_RA_Temp = AHU_01_RA_Temp.map((item) => ({
        ...item,
        time: formatTime(item.data_received_on),
    }));
    
    const formatted_RA_Temp_control_Valve_Feedback = RA_Temp_control_Valve_Feedback.map((item) => ({
        ...item,
        time: formatTime(item.data_received_on),
    }));
    // Chart options
    const chartOptionMultipleLineTempVsHumid = {
        // title: {
        //   text: 'Stacked Area Chart'
        // },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['RA  temperature setpoint', 'AHU-01 RA Temp', 'RA Temp control( Valve Feedback)']
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: formatted_RA_temperature_setpoint.map((item) => item.time)
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'RA  temperature setpoint',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: formatted_RA_temperature_setpoint.map((item) => item.monitoring_data),
            },
            {
                name: 'AHU-01 RA Temp',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: formatted_AHU_01_RA_Temp.map((item) => item.monitoring_data),
            },
            {
                name: 'RA Temp control( Valve Feedback)',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: formatted_RA_Temp_control_Valve_Feedback.map((item) => item.monitoring_data),
            },
            // {
            //     name: 'Search Engine',
            //     type: 'line',
            //     stack: 'Total',
            //     label: {
            //         show: true,
            //         position: 'top'
            //     },
            //     areaStyle: {},
            //     emphasis: {
            //         focus: 'series'
            //     },
            //     data: [820, 932, 901, 934, 1290, 1330, 1320]
            // }
        ]
    };

    // Initialize and update the chart when the data changes
    useEffect(() => {
        if (chartRef.current) {
            const chart = echarts.init(chartRef.current);
            chart.setOption(chartOptionMultipleLineTempVsHumid);

            // Cleanup chart instance on component unmount
            return () => {
                chart.dispose();
            };
        }
    }, [data]); // Re-render chart on data change

    return <div ref={chartRef} style={{ height: 300, width: '100%' }} />;
};

export default EChartAreaComponent;
