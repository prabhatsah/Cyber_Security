import {
  getMyInstancesV2,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";

export const startAuditData = async (auditData: any) => {
  try {
    const processId = await mapProcessName({
      processName: "Add Audit",
    });
    await startProcessV2({
      processId,
      data: auditData,
      processIdentifierFields: "",
    });
    console.log("success in staring the process ankit");
  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
  }
};
export const fetchFrameWorkData = async () => {
  try {
    const frameworkInsData = await getMyInstancesV2<any>({
      processName: "Add Framework",
      predefinedFilters: { taskName: "view framework" },
    });

    const frameworkData = Array.isArray(frameworkInsData)
      ? frameworkInsData.map((e: any) => e.data)
      : [];
    return frameworkData;
  } catch (error) {
    console.error("Error fetching framework data:", error);
  }
};
export const fetchControlObjectiveData = async () => {
  try {
    const controlObjectiveInsData = await getMyInstancesV2<any>({
      processName: "Control Objectives",
      predefinedFilters: { taskName: "view control objecitve" },
    });

    const controlObjectiveData = Array.isArray(controlObjectiveInsData)
      ? controlObjectiveInsData.map((e: any) => e.data)
      : [];
    return controlObjectiveData;
  } catch (error) {
    console.error("Error fetching control objective data:", error);
  }
};
