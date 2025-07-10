import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";

export const startLeadData = async (newLead: Record<string, any>) => {
  try {
    const processId = await mapProcessName({processName: "Leads Pipeline",});
    await startProcessV2({processId, data: newLead, processIdentifierFields: "leadIdentifier"});

  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};
