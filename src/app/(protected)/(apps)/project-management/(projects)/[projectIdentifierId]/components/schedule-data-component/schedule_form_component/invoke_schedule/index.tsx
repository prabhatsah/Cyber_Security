import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";


export const invokeProductData = async (
  updatedProductData: Record<string, any>,
  productIdentifier: string
) => {

  const productInsData = await getMyInstancesV2({
    processName: "Product",
    predefinedFilters: { taskName: "Schedule" },
    mongoWhereClause: `this.Data.productIdentifier == "${productIdentifier}"`,
    projections: ["Data"],
  });
  var taskId = productInsData[0]?.taskId
  try {
    const result = await invokeAction({
      taskId: taskId,
      transitionName: "Update Schedule",
      data: updatedProductData,
      processInstanceIdentifierField: "",
    });
    console.log(result);
  } catch (error) {
    console.error("Failed to invoke action:", error);
  }
};