import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";

export const startPurchaseOrderData = async (purchaseData: Record<string, any>) => {
  try {
    const processId = await mapProcessName({processName: "Purchase Order",});
    await startProcessV2({processId, data: purchaseData, processIdentifierFields: "purchaseOrderId,purchaseOrderIdentifier"});

  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};
