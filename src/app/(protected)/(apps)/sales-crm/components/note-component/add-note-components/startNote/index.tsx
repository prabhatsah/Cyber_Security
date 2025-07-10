import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";

// const processId = await mapProcessName({processName:'Lead User Notes'})
// await startProcessV2 ({ processId, data:{},processIdentifierFields:""}) 

export const startLeadUserNotesProcess = async (newNote: Record<string, any>) => {
  try {
    const processId = await mapProcessName({processName: "Lead User Notes",});
    await startProcessV2({processId, data: newNote, processIdentifierFields: "newNote.id,newNote.userId,newNote.source",});

  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};
