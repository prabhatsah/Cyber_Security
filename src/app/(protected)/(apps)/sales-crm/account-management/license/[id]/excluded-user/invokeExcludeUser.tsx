import { invokeAction, getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export const invokeExcludeUser = async (finalData: Record<string, any>) => {
  try {
    const ExculdeUserData = await getMyInstancesV2<any>({
      processName: "Billing Users Excluder",
      predefinedFilters: { taskName: "Exclude Billing Users" },
      mongoWhereClause: `this.Data.accountId == "${finalData.accountId}"`,
    });

    if (!ExculdeUserData || ExculdeUserData.length === 0) {
      throw new Error("No task data found for the given mark admin.");
    }

    const result = await invokeAction({
      taskId: ExculdeUserData[0].taskId,
      transitionName: "Update Exclude Billing Users",
      data: finalData,
      processInstanceIdentifierField: 'accountId,accountName,createdOn,updatedOn',
    });

    console.log("Exclude User updated successfully:", result);
  } catch (error) {
    console.error("Failed to invoke action:", error);
    throw error;
  }
};