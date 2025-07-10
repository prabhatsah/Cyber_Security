import { format } from "date-fns";
interface IncomingDataItem{
    data_received_on: string;
    service_name: string;
    monitoring_data: string;
} 
interface ChartDataItem {
    time: Date;
    [key: string]: any; // Allows dynamic service name properties
}
export async function formatChartData(incomingData: IncomingDataItem[]): Promise<ChartDataItem[]> {
    if (!incomingData || !Array.isArray(incomingData)) {
        console.error("Invalid or empty incomingData provided");
        return [];
    }

    try {
        const chartData: ChartDataItem[] = [];
        const services: Record<string, ChartDataItem> = {};

        incomingData.forEach((item: IncomingDataItem) => {
            const fixedDateString = item.data_received_on.replace(' UTC', 'Z');
            const time = format(new Date(fixedDateString), "yyyy-MM-dd HH:mm:ss");
            const serviceName = item.service_name;
            const value = typeof item.monitoring_data === 'string' 
                ? parseFloat(item.monitoring_data) 
                : item.monitoring_data;

            if (!services[time.toString()]) {
                services[time.toString()] = { time };
            }
            services[time.toString()][serviceName] = value;
        });

        for (const timeKey in services) {
            chartData.push(services[timeKey]);
        }

        return chartData;
    } catch (error) {
        console.error("Error in formatChartData: ", error);
        return [];
    }
}