import { invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";


export const startProductData = async (
    productData: Record<string, any>, 
    updatedDealsData: Record<string, any>, 
    taskId: string
  ) => {
//   try {
//     const processId = await mapProcessName({processName: "Product",});
//     await startProcessV2({processId, data: productData, processIdentifierFields: ""});

//   } catch (error) {
//     console.error("Failed to start the process:", error);
//     throw error;
//   }

  try {
      const result = await invokeAction({
        taskId: taskId,
        transitionName: "Update Add New Product",
        data: updatedDealsData,
        processInstanceIdentifierField:
          "dealIdentifier,dealStatus,dealName,leadIdentifier,productIdentifier,productType,projectManager,productStatus,accountIdentifier",
      });
      console.log(result);
    } catch (error) {
      console.error("Failed to invoke action:", error);
    }
};
