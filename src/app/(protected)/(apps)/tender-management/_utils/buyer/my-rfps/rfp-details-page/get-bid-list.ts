import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export default async function getBidList(draftId: string):Promise<any[]>{ 
    const response : any[] = await getMyInstancesV2({
          //processName: "RFP Draft",
          processName : "Tender Management",
          predefinedFilters: { taskName: "View Tender" },
          processVariableFilters : { tenderId: draftId }
        });
          const bidData = response.map((bid) => bid.data);
    
        return bidData;

}

export async function getBidById(bidId: string): Promise<any> {
  const response: any[] = await getMyInstancesV2({
    //processName: "RFP Draft",
    processName: "Tender Management",
    predefinedFilters: { taskName: "View Tender" },
    processVariableFilters: { bidId: bidId },
  });
  const bidData = response.map((bid) => bid.data);

  return bidData.length>0 ? bidData[0] : {};
}
