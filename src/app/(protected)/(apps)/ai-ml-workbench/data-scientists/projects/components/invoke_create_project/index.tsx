import {
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";

export const startProjectData = async (newProject: any) => {
  try {
    const processId = await mapProcessName({ processName: "Alert Rule" });
    console.log("newProject from here start process-----------", newProject);
    await startProcessV2({
      processId,
      data: newProject,
      processIdentifierFields: "",
    });
  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};

// import {
//   mapProcessName,
//   startProcessV2,
// } from "@/ikon/utils/api/processRuntimeService";

// export const startAssignmentData = async (assignmentData: any) => {
//   try {
//     const processId = await mapProcessName({ processName: "Assignments" });
//     await startProcessV2({
//       processId,
//       data: assignmentData,
//       processIdentifierFields: "",
//     });
//     console.log("success in staring the process");
//   } catch (error) {
//     console.error("Failed to start the process:", error);
//     throw error;
//   }
// };
