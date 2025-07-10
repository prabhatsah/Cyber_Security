import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";

export const startDealData = async (newDeal: Record<string, any>) => {
  try {
    const processId = await mapProcessName({processName: "Deal",});
    await startProcessV2({processId, data: newDeal, processIdentifierFields: "dealIdentifier,dealStatus,dealName,leadIdentifier,productIdentifier,productType,projectManager,productStatus,accountIdentifier"});

  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};
