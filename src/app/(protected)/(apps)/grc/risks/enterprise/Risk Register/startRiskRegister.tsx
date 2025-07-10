import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";

export const startRegisterProcess = async (newRegister: Record<string, any>) => {
  try {
    const processId = await mapProcessName({processName: "Add Risk Register",});
    await startProcessV2({processId, data: newRegister, processIdentifierFields: "riskRegisterId"});

  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};