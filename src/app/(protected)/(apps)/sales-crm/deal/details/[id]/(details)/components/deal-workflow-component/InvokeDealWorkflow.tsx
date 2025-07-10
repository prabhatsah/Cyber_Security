import { DealData } from "@/app/(protected)/(apps)/sales-crm/components/type";
import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";

export async function invokeDealWorkflowTransition(
    taskName : string,
    transitionName : string,
    dealStatus : string,
    dealIdentifier : string
) {
  

  try {
    const dealInstanceData = await getMyInstancesV2<DealData>({
        processName: "Deal",
        predefinedFilters: { taskName: taskName },
        mongoWhereClause: `this.Data.dealIdentifier == "${dealIdentifier}"`,
      });
    console.log(dealInstanceData)
    let dealData = dealInstanceData[0]?.data || []; 
    dealData.dealStatus = dealStatus
    const taskId = dealInstanceData[0]?.taskId || ""
    console.log(dealData)
    const result = await invokeAction({
      taskId: taskId,
      transitionName: transitionName,
      data: dealData,
      processInstanceIdentifierField: "dealIdentifier",
    });
    console.log(result)
} catch (error) {
    console.error("Failed to invoke action:", error);
  }
}
