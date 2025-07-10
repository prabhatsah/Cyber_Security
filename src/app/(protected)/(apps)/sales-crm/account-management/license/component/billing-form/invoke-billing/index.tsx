import { invokeAction, getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export const invokeBilling = async (finalData: Record<string, any>) => {
  try {
    const BillingData = await getMyInstancesV2<any>({
      processName: "Billing Account",
      predefinedFilters: { taskName: "Edit Billing Account Details" },
      mongoWhereClause: `this.Data.id == "${finalData.id}"`,
    });

    if (!BillingData || BillingData.length === 0) {
      throw new Error("No task data found for the given billing.");
    }

    const result = await invokeAction({
      taskId: BillingData[0].taskId,
      transitionName: "Update Billing Account Details",
      data: finalData,
      processInstanceIdentifierField: "id,name,parentAccount,isParent,createdOn,updatedOn,isActive",
    });

    console.log("Billing updated successfully:", result);
  } catch (error) {
    console.error("Failed to invoke action:", error);
    throw error;
  }
};
