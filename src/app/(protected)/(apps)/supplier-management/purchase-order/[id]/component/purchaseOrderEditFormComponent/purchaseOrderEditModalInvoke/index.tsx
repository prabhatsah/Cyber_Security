import { invokeAction, getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export const POEditFormInvoke = async (finalData: Record<string, any>) => {
  try {
    const PurchaseOrderData = await getMyInstancesV2<any>({
      processName: "Purchase Order",
      predefinedFilters: { taskName: "Edit Purchase Order" },
      mongoWhereClause: `this.Data.purchaseOrderId == "${finalData.purchaseOrderId}"`,
    });

    if (!PurchaseOrderData || PurchaseOrderData.length === 0) {
      throw new Error("No task data found.");
    }

    const result = await invokeAction({
      taskId: PurchaseOrderData[0].taskId,
      transitionName: "Update Purchase Order",
      data: finalData,
      processInstanceIdentifierField: "",
    });

    console.log("Purchase Order updated successfully:", result);
  } catch (error) {
    console.error("Failed to invoke action:", error);
    throw error;
  }
};
