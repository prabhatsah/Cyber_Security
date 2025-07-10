import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export const fetchControlsData = async () => {
  try {
    const controlsData = await getMyInstancesV2({
      processName: "Control Objectives",
      predefinedFilters: { taskName: "edit control objective" },
    });
    console.log("Fetched controlData-----", controlsData);

    // Process the data dynamically
    const controlsDataDynamic = Array.isArray(controlsData)
      ? controlsData.map((e: any) => e.data)
      : [];
    console.log("Processed controlsDataDynamic-----", controlsDataDynamic);
    return controlsDataDynamic; // Return processed data
  } catch (error) {
    console.error("Failed to fetch the process:", error);
    return []; // Return empty array in case of error
  }
};

export const fetchFrameworkMappingData = async () => {
    try {
      const frameworkMappingData = await getMyInstancesV2({
        processName: "Framework Mapping",
        predefinedFilters: { taskName: "Edit FrameworkMapping" },
      });
      console.log("Fetched frameworkMappingData-----", frameworkMappingData);
  
      // Process the data dynamically
      const frameworkMappingDataDynamic = Array.isArray(frameworkMappingData)
        ? frameworkMappingData.map((e: any) => e.data)
        : [];
      console.log("Processed frameworkMappingDataDynamic-----", frameworkMappingDataDynamic);
      return frameworkMappingDataDynamic; // Return processed data
    } catch (error) {
      console.error("Failed to fetch the process:", error);
      return []; // Return empty array in case of error
    }
  };