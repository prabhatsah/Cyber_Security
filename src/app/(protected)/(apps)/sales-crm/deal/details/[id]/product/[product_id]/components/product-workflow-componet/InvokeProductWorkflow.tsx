import { DealData } from "@/app/(protected)/(apps)/sales-crm/components/type";
import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";

export async function InvokeProductWorkflowTransition(
    taskName : string,
    transitionName : string,
    productStatus : string,
    productIdentifier : string
) {
  

  try {
    const productInstanceData = await getMyInstancesV2<any>({
        processName: "Product",
        predefinedFilters: { taskName: taskName },
        mongoWhereClause: `this.Data.productIdentifier == "${productIdentifier}"`,
      });
    console.log("productInstanceData ----------- ",productInstanceData)
    let productData = productInstanceData[0]?.data || []; 
    productData.productStatus = productStatus
    const taskId = productInstanceData[0]?.taskId || ""
    console.log(productData)
    const result = await invokeAction({
      taskId: taskId,
      transitionName: transitionName,
      data: productData,
      processInstanceIdentifierField: "productIdentifier,productType,productStatus,projectManager,dealStatus,dealIdentifier,dealName,leadIdentifier",
    });
    console.log(result)
} catch (error) {
    console.error("Failed to invoke action:", error);
  }
}
