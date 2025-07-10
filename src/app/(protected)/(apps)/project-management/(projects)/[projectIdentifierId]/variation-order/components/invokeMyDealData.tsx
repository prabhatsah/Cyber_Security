import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";

export const InvokeMyDealData = async (newDeal: Record<string, any>) => {
  try {

    const processId = await mapProcessName({processName: "Deal",softwareId: await getSoftwareIdByNameVersion("Sales CRM", "1.0")});
    await startProcessV2({processId, data: newDeal, softwareId: await getSoftwareIdByNameVersion("Sales CRM", "1.0"), processIdentifierFields: "dealIdentifier,dealStatus,dealName,leadIdentifier,productIdentifier,productType,projectManager,productStatus,accountIdentifier"});

  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};
