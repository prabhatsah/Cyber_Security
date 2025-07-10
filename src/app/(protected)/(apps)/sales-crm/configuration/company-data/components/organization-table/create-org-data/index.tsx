import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";

export const startOrgData = async (newOrg: Record<string, any>) => {
  try {
    const processId = await mapProcessName({processName: "HRMS - Organization",});
    await startProcessV2({processId, data: newOrg, processIdentifierFields: "",});

  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};
