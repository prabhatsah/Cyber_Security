import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";

export async function invokeLeadsPipelineTransition(
    taskName : string,
    transitionName : string,
    leadStatus : string,
    leadIdentifier : string
) {
  

  try {
    const leadPipelineData = await getMyInstancesV2({
        processName: "Leads Pipeline",
        predefinedFilters: { taskName: taskName },
        mongoWhereClause: `this.Data.leadIdentifier == "${leadIdentifier}"`,
      });
    console.log(leadPipelineData)
    let leadData = leadPipelineData[0]?.data || []; 
    leadData.leadStatus = leadStatus
    const taskId = leadPipelineData[0]?.taskId || ""
    console.log(leadData)
    const result = await invokeAction({
      taskId: taskId,
      transitionName: transitionName,
      data: leadData,
      processInstanceIdentifierField: "leadIdentifier",
    });
    console.log(result)
} catch (error) {
    console.error("Failed to invoke action:", error);
  }
}
