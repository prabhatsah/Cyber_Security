import React, { useEffect, useRef, useState } from 'react';
import { getData, getLiveData } from '@/app/(protected)/(apps)/bms/get-data/get-cassandra-data';
import AreaChart from '@/ikon/components/charts/area-chart';
import { Skeleton } from "@/shadcn/ui/skeleton";
import { useHvac } from "@/app/(protected)/(apps)/bms/context/HvacContext"; // adjust path as needed

const createParam = function (serviceName: string, startDate: any, endDate: any) {
    let param = {}
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
    startDate = new Date();

    // Set startDate as current time
    let startDateTimestamp = startDate.getTime();

    // Calculate endDate as 30 minutes before startDate
    let endDateTimestamp = new Date(startDate.getTime() - 30 * 60 * 1000).getTime(); // Subtract 30 minutes
    param = {
        "serviceNameList": serviceIdList,
        "startDate": endDateTimestamp,
        "endDate": startDateTimestamp,
    }
    return param;
}
const seriesNameMap: any = {
    'RA  temperature setpoint': 'Temperature Setpoint',
    'AHU-01 RA Temp': 'RA Temp',
    'RA Temp control( Valve Feedback)': 'Cooling Coil Feedback'
}

export default function TemperatureChart({ chartType }: any) {
    const [data, setData] = useState<any[]>([]); // Stores all data
    const [liveData, setLiveData] = useState<any | null>(null); // Stores live data
    const { isChangesApplied } = useHvac()

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            const param = createParam('RA  temperature setpoint', null, null);
            const fetchedData = await getData(param);
            fetchedData.sort(
                (a: any, b: any) => new Date(a.data_received_on.replace(' UTC', '')).getTime() - new Date(b.data_received_on.replace(' UTC', '')).getTime()
            );
            console.log("RA  temperature setpoin", fetchedData);
            for (let i = 0; i < fetchedData.length; i++) {
                // Map the service_name to the corresponding seriesName
                fetchedData[i].service_name = seriesNameMap[fetchedData[i].service_name] || fetchedData[i].service_name;
            }
            setData(fetchedData);
            // setData([...fetchedData]);
            console.log("Fetched Data", fetchedData);
        };

        fetchData();
    }, []);

    // // Fetch live data
    // useEffect(() => {
    //     const fetchLiveData = () => {
    //         function updateLiveData(event: any) {
    //             if (event?.data) {
    //                 setLiveData(event.data); // Update state with new live data
    //             }
    //         }
    //         getLiveData(updateLiveData);
    //     };

    //     fetchLiveData();

    //     return () => {
    //     };
    // }, []);

    // Define the live data handler outside for reuse
    const updateLiveData = (event: any) => {
        if (event?.data) {
            // const clonedData = JSON.parse(JSON.stringify(event.data)); // deep clone
            // console.log("updateLiveData - new data incoming:", clonedData);
            // setLiveData({ ...event.data }); // create a new object reference
            setLiveData(event.data);
        }
    };

    // Fetch live data initially and on tab visibility change
    useEffect(() => {
        const fetchLiveData = () => {
            getLiveData(updateLiveData);
        };

        fetchLiveData();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchLiveData(); // re-subscribe to live data when tab becomes active
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Merge live data with existing data
    useEffect(() => {
        console.log("Live data useEffect triggered", liveData); // check if this logs
        if (liveData?.monitoring_data) {
            const { data_received_on, ip, monitoring_data: monitoringArray, client_id } = liveData;

            const baseDataPoint = {
                data_received_on: data_received_on || null,
                device_id: ip || "Unknown Device",
                client_id: client_id || "Unknown Client",
            };

            if (Array.isArray(monitoringArray)) {
                let tempArr: any[] = [];
                for (const item of monitoringArray) {

                    for (const seriesName in seriesNameMap) {
                        if (item.object_name === seriesName) {
                            let obj = {
                                ...baseDataPoint,
                                service_name: seriesNameMap[seriesName],
                                monitoring_data: item.present_value,
                            }
                            tempArr.push(obj);
                        }
                    }
                }
                setData((prevData) => [...prevData, ...tempArr]);
            } else {
                console.warn("Monitoring data is not an array:", monitoringArray);
            }
        }

    }, [liveData]);

    // Configuration Object
    const areaChartConfigurationObj: any = {
        version: 1,
        // title: "RA Temperature Setpoint",
        categoryKey: "data_received_on",
        showLegend: true,
        showCursor: true,
        showScrollx: false,
        showScrolly: false,
        zoomToIndex: true,
        zoomStartIndex: "0",
        zoomEndIndex: "100",
        showoverallTooltip: true,
        overallTooltip: "{b}: {c}",
        seriesCreationArrayofObj: [
            {
                seriesType: chartType,
                seriesName: 'Temperature Setpoint',
                emphasis: {
                    focus: 'series'
                },
                showSeriesTooltip: true,
            },
            {
                seriesType: chartType,
                seriesName: 'RA Temp',
                yAxisIndex: 1, // left y-axis
                emphasis: {
                    focus: 'series'
                },
                showSeriesTooltip: true,
            },
            {
                seriesType: chartType,
                seriesName: 'Cooling Coil Feedback',
                yAxisIndex: 2,
                emphasis: {
                    focus: 'series'
                },
                showSeriesTooltip: true,
            },
        ],
        yAxisParams: [
            {
                type: 'value',
                name: 'Temperature Setpoint',
                position: 'left',
                alignTicks: true,
                axisLine: {
                    show: true,
                    // lineStyle: {
                    //   color: colors[0]
                    // }
                },
                axisLabel: {
                    formatter: '{value} °C'
                }
            },
            {
                type: 'value',
                name: 'RA Temp',
                position: 'left',
                alignTicks: true,
                offset: 100,
                axisLine: {
                    show: true,
                    // lineStyle: {
                    //   color: colors[1]
                    // }
                },
                axisLabel: {
                    formatter: '{value} °C'
                }
            },
            {
                type: 'value',
                name: 'Cooling Coil Feedback',
                position: 'right',
                alignTicks: true,
                axisLine: {
                    show: true,
                    // lineStyle: {
                    //   color: colors[2]
                    // }
                },
                axisLabel: {
                    formatter: '{value} %'
                }
            }
        ],

    };
    return (
        <>
            {/* {data.length > 0 && <AreaChart chartData={data} configurationObj={areaChartConfigurationObj} />} */}
            {data.length > 0 ? (
                <AreaChart chartData={data} configurationObj={areaChartConfigurationObj} />
            ) : (
                <div className="w-full h-[300px] flex items-center justify-center">
                    <Skeleton className="w-full h-full rounded-md bg-gray-400" />
                </div>
            )}
        </>
    );
}
