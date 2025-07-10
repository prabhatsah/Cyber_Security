import { invokeAction, getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export const invokeMarkAdmin = async (finalData: Record<string, any>) => {
  try {
    const MarkAdminData = await getMyInstancesV2<any>({
      processName: "Mark Admin Users",
      predefinedFilters: { taskName: "Mark Admin Users" },
      mongoWhereClause: `this.Data.accountId == "${finalData.accountId}"`,
    });

    if (!MarkAdminData || MarkAdminData.length === 0) {
      throw new Error("No task data found for the given mark admin.");
    }

    const result = await invokeAction({
      taskId: MarkAdminData[0].taskId,
      transitionName: "Update Mark Admin Users",
      data: finalData,
      processInstanceIdentifierField: 'accountId,accountName,createdOn,updatedOn',
    });

    console.log("Mark Admin updated successfully:", result);
  } catch (error) {
    console.error("Failed to invoke action:", error);
    throw error;
  }
};
