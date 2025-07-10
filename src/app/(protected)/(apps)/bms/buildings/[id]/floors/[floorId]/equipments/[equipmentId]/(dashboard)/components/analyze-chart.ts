import { getData, getLatestAIAnalysis } from "@/app/(protected)/(apps)/bms/get-data/get-cassandra-data";

export async function analyzeChart(serviceNameList: string[]) {
    const param = {
        dataCount: 1000,
        service_name: null,
        serviceNameList: serviceNameList,
        startDate: null,
        endDate: null,
        timePeriod: null,
      };
      const data = await getData(param);
      console.log("Data fetched for analysis:", data);
      const parameters = {
        "data": data
      }
      const latestAnalysis = await getLatestAIAnalysis(parameters);
      return latestAnalysis;
}