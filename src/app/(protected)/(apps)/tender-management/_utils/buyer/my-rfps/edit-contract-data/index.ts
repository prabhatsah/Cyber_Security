import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";


export const editContractData = async (bidId : string | null, data : any) => {
    try {
        const response = await getMyInstancesV2({
          processName: "Tender Management",
          predefinedFilters: { taskName: "Contract Finalization" },
          processVariableFilters: { bidId: bidId },
        });
    
          if(response.length > 0){
            const taskId = response[0].taskId;
            const existing : any = response[0].data;
            console.log('existing',existing);
            console.log('now',data);
            await invokeAction({
              taskId: taskId,
              transitionName: "Update Contract Finalization",
              data: {...existing ,...data},
              processInstanceIdentifierField: "bidId",
            });
          }
    
      } catch (error) {
        console.error("Failed to edit data:", error);
        throw error;
      }
}