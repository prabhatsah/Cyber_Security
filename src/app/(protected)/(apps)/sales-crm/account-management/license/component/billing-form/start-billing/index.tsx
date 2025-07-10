import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";

export const startBilling = async (finalData: Record<string, any>) => {
  try {
    console.log("finalData 000000 ", finalData);
    const processId = await mapProcessName({processName: "Billing Account",});
    await startProcessV2({processId, data: finalData, processIdentifierFields: "id,name,parentAccount,isParent,createdOn,updatedOn,isActive"});

  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};
