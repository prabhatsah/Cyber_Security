import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";

export const startAssessmentProcess = async (newAssessment: Record<string, any>) => {
  try {
    const processId = await mapProcessName({processName: "Add Risk Assessment",});
    await startProcessV2({processId, data: newAssessment, processIdentifierFields: "riskId"});

  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};