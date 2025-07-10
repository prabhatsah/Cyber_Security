import {
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";
import { format } from "date-fns";

export async function invokePOWorkflowTransition(
  taskName: string,
  transitionName: string,
  poStatus: string,
  podentifier: string
) {
  try {
    const PurchaseOrderData = await getMyInstancesV2<any>({
      processName: "Purchase Order",
      predefinedFilters: { taskName: taskName },
      mongoWhereClause: `this.Data.purchaseOrderId == "${podentifier}"`,
    });

    console.log(PurchaseOrderData);
    let poData = PurchaseOrderData[0]?.data || {};
    poData.purchaseOrderStatus = poStatus;

    if (poStatus === "Order Approved") {
      poData.approvalDate = format(new Date(), "yyyy-MM-dd");
    }

    const taskId = PurchaseOrderData[0]?.taskId || "";
    console.log(poData);

    const result = await invokeAction({
      taskId: taskId,
      transitionName: transitionName,
      data: poData,
      processInstanceIdentifierField: "",
    });
    console.log(result);
  } catch (error) {
    console.error("Failed to invoke action:", error);
    throw error;
  }
}
