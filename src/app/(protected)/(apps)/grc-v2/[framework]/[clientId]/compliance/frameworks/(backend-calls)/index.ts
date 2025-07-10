import {
  getMyInstancesV2,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";
// import { useRouter } from "next/router";
export const fetchControlObjectiveData = async () => {
  try {
    const controlObjectiveInsData = await getMyInstancesV2<any>({
      processName: "Control Objectives V2",
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
export const startUploadData = async (uploadData: any, frameworkId: string) => {
  try {
    const processId = await mapProcessName({
      processName: "Control Objectives V2",
    });
    await startProcessV2({
      processId,
      data: uploadData,
      processIdentifierFields: "",
    });
    console.log("success in staring the process ankit");
  } catch (error) {
    console.error("Failed to start the process:", error);
    throw error;
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
    console.log(
      "Processed frameworkMappingDataDynamic-----",
      frameworkMappingDataDynamic
    );
    return frameworkMappingDataDynamic; // Return processed data
  } catch (error) {
    console.error("Failed to fetch the process:", error);
    return []; // Return empty array in case of error
  }
};
