
import { PricingTableData } from "@/app/(protected)/(apps)/sales-crm/components/type";
import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";

export async function InvokePricingData(
    productIdentifier : string,
    pricingData :  { [key: string]: PricingTableData }
) {
  

  try {
    console.log("productIdentifier",productIdentifier)
    const productInstanceData = await getMyInstancesV2<any>({
        processName: "Product",
        predefinedFilters: { taskName: "PS Quotation" },
        mongoWhereClause: `this.Data.productIdentifier == "${productIdentifier}"`,
      });
    console.log("productInstanceData",productInstanceData)
    let productData = productInstanceData[0]?.data || []; 
    productData.quotation = pricingData
    const taskId = productInstanceData[0]?.taskId || ""
    console.log("productData",productData)
    const result = await invokeAction({
      taskId: taskId,
      transitionName: "Update PS Quotation",
      data: productData,
      processInstanceIdentifierField: "productIdentifier,productType,productStatus,projectManager,dealStatus,dealIdentifier,dealName,leadIdentifier",
    });
    console.log(result)
} catch (error) {
    console.error("Failed to invoke action:", error);
  }
}
