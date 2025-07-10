'use client';
import React, { useState, useEffect } from 'react';
import ColumnLineChart from '@/ikon/components/charts/column-line-chart';
import { queryDataAndShowResourceForecastChart, showResourceForecastChart } from './summaryPage';


// const ResourceForecastPage: React.FC = () => {
//     const [chartData, setChartData] = useState<any[]>([]);
//     const [chartConfig, setChartConfig] = useState<any>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);

//     // Fetch and prepare chart data
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);
                
//                 // 1. Get the raw chart data
//                 const data = await queryDataAndShowResourceForecastChart();
//                 setChartData(data);
                
//                 // 2. Prepare the chart configuration
//                 await showResourceForecastChart(data, setChartConfig);
                
//                 setLoading(false);
//             } catch (err) {
//                 console.error('Failed to load chart data:', err);
//                 setError('Failed to load chart data');
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     if (loading) return <div>Loading chart...</div>;
//     if (error) return <div>Error: {error}</div>;
//     if (!chartConfig) return <div>No chart configuration available</div>;

//     // Transform the configuration to match your ColumnLineChart props
//     const columnLineChartConfig = {
//         categoryKey: "month",
//         seriesCreationArrayofObj: chartConfig.series.map((s: any) => ({
//             seriesName: s.name,
//             seriesType: s.type === 'bar' ? 'column' : 'line',
//             valueField: s.name,
//             showSeriesTooltip: true
//         })),
//         showLegend: chartConfig.showLegend,
//         showCursor: chartConfig.showCursor,
//         showScrollx: false, // Adjust based on your needs
//         showScrolly: false, // Adjust based on your needs
//         zoomToIndex: true,
//         zoomStartIndex: 0, // Adjust based on your needs
//         zoomEndIndex: 100, // Adjust based on your needs
//         showoverallTooltip: true,
//         overallTooltip: `
//             <b>{b}</b><br/>
//             Prospect FTE: {c0}<br/>
//             Project FTE: {c1}<br/>
//             Head Count: {c2}
//         `,
//         yAxisParams: chartConfig.yAxes
//     };

//     return (
//         <div style={{ width: '100%', height: '600px' }}>
//             <h2>Resource Forecast</h2>
//             <ColumnLineChart 
//                 chartData={chartData} 
//                 configurationObj={columnLineChartConfig} 
//             />
//         </div>
//     );
// };

// export default ResourceForecastPage;


// page.tsx
const ResourceForecastPage: React.FC = () => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [chartConfig, setChartConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // 1. Get raw data
                const rawData = await queryDataAndShowResourceForecastChart();
                if (!rawData || rawData.length === 0) {
                    throw new Error('No data returned from query');
                }
                setChartData(rawData);
                
                // 2. Prepare config
                await new Promise<void>((resolve) => {
                    showResourceForecastChart(rawData, (config) => {
                        if (!config?.series || config.series.length === 0) {
                            throw new Error('Invalid chart configuration');
                        }
                        setChartConfig(config);
                        resolve();
                    });
                });
                
            } catch (err) {
                console.error('Chart data error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading chart data...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!chartData.length) return <div>No data available</div>;
    if (!chartConfig) return <div>Chart configuration failed</div>;

    // Verify data structure
    console.log('First data item:', chartData[0]);
    console.log('Chart series config:', chartConfig.series);

    return (
        <div style={{ width: '100%', height: '600px' }}>
            <ColumnLineChart 
                chartData={chartData} 
                configurationObj={{
                    categoryKey: "month",
                    seriesCreationArrayofObj: [
                        {
                            seriesName: "Prospect FTE",
                            seriesType: "column",
                            valueField: "prospectFte",
                            stack: "total"
                        },
                        {
                            seriesName: "Project FTE",
                            seriesType: "column",
                            valueField: "projectFte",
                            stack: "total"
                        },
                        {
                            seriesName: "Head Count",
                            seriesType: "line",
                            valueField: "availableHeadCountNormalized",
                            bullet: { shape: "circle" }
                        }
                    ],
                    showLegend: true,
                    showCursor: true,
                    showoverallTooltip: true,
                    overallTooltip: `
                        <b>{b}</b><br/>
                        Prospect FTE: {c0}<br/>
                        Project FTE: {c1}<br/>
                        Head Count: {c2}
                    `,
                    yAxisParams: [{
                        type: "value",
                        name: "FTE",
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }]
                }} 
            />
        </div>
    );
};

export default ResourceForecastPage;