import {
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";

export const startAssignmentData = async (assignmentData: any) => {
  try {
    const processId = await mapProcessName({ processName: "Assignments" });
    await startProcessV2({
      processId,
      data: assignmentData,
      processIdentifierFields: "",
    });
    console.log("success in staring the process ankit");
  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};
