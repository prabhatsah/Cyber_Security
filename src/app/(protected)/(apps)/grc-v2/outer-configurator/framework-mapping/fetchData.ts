import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { Framework } from "../dynamicFramework/page";


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


export const getFrameworkDetails = async () => {
  const frameworkProcessInstances = await getMyInstancesV2({
    processName: "Framework Processes",
    predefinedFilters: { taskName: "Publish" }
  })
  const frameworkProcessDatas = frameworkProcessInstances.length > 0 ? frameworkProcessInstances.map((frameworkProcessInstance) => frameworkProcessInstance.data) as Framework[] : [];
  return frameworkProcessDatas;
}