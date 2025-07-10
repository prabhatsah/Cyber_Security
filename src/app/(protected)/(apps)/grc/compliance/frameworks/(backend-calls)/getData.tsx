import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export const fetchFrameworkData = async () => {
  try {
    const frameworkData = await getMyInstancesV2({
      processName: "Add Framework",
      predefinedFilters: { taskName: "framework details" },
    });
    console.log("frameworkData-----", frameworkData);
    const frameworkDataDynamic = Array.isArray(frameworkData)
      ? frameworkData.map((e: any) => e.data)
      : [];
    console.log("frameworkDataDynamic-----", frameworkDataDynamic);
    return frameworkDataDynamic;
  } catch (error) {
    console.error("Failed to fetch the process:", error);
    throw error;
  }
};

export const fetchControlsData = async () => {
  try {
    const controlsData = await getMyInstancesV2({
      processName: "Control Objective",
      predefinedFilters: { taskName: "edit control objective" },
    });
    console.log("controlData-----", controlsData);
    const controlsDataDynamic = Array.isArray(controlsData)
      ? controlsData.map((e: any) => e.data)
      : [];
    console.log("controlsDataDynamic-----", controlsDataDynamic);
    return controlsDataDynamic;
  } catch (error) {
    console.error("Failed to fetch the process:", error);
    throw error;
  }
};
