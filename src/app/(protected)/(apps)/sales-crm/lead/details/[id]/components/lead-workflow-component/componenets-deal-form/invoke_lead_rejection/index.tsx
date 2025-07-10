import { LeadData } from "@/app/(protected)/(apps)/sales-crm/components/type";
import {
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";

export const  editLeadStatusForRejection = async (leadIdentifier: string) => {
  const leadsData = await getMyInstancesV2<LeadData>({
    processName: "Leads Pipeline",
    predefinedFilters: { taskName: "Opportunity" },
    processVariableFilters: { leadIdentifier: leadIdentifier },
  });

  console.log(leadsData)

  var taskId = leadsData[0].taskId;
  var data = leadsData[0].data
  data.leadStatus = "Rejected From Opportunity";

  console.log("update data ",data)

  try {
    const result = await invokeAction({
      taskId: taskId,
      transitionName: "Rejected From Opportunity",
      data: data,
      processInstanceIdentifierField: "leadIdentifier",
    });
    console.log(result);
  } catch (error) {
    console.error("Failed to invoke action:", error);
  }
};
