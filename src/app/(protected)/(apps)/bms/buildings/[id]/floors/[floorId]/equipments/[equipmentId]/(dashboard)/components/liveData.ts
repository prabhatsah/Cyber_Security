import { useEffect, useState } from "react";
import { getLatestLiveBacnetDataTest, getLiveData } from "@/app/(protected)/(apps)/bms/get-data/get-cassandra-data";

export function liveDatafunction(){
	const [liveData, setLiveData] = useState<any[]>([]);
     
  useEffect(() => {
    const fetchLiveData = async () => {
      function updateLiveData(event: any) {
        setLiveData(event);
       // console.log("liveData", event);
      }
    getLiveData(updateLiveData)
    };
    fetchLiveData();
 
}, []); 
console.log("liveData", liveData);
return liveData;
}

export async function energyUsageLiveDatafunction() {
  const parameters: any = {
    dataCount:  1,
    service_name: 'Fan Power meter (KW)',
    serviceNameList: null,
    startDate: null,
    endDate:  null,
    timePeriod: null, //in seconds
  };
  const liveData = await getLatestLiveBacnetDataTest(parameters, null);
  // console.log("liveDataFan", liveData);
  return liveData.queryResponse;

}
