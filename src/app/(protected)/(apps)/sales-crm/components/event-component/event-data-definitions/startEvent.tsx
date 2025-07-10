import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";

// const processId = await mapProcessName({processName:'Lead User Notes'})
// await startProcessV2 ({ processId, data:{},processIdentifierFields:""}) 

export const startEventProcess = async (eventData: Record<string, any>) => {
  try {
    const processId = await mapProcessName({processName: "Event Creation Process"});
    await startProcessV2({processId, data: eventData, processIdentifierFields: "",});

  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};
