import { invokeAction, getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export const invokeProductProcess = async (updatedProductData: Record<string, any>) => {
  try {
    const productData = await getMyInstancesV2<any>({
        processName: "Product",
        predefinedFilters: { taskName: "Edit State" },
        mongoWhereClause: `this.Data.productIdentifier == "${updatedProductData.productIdentifier}"`,
    });

    if (!productData || productData.length === 0) {
      throw new Error("No task data found for the given product.");
    }

    // Perform the action to update the product
    const result = await invokeAction({
      taskId: productData[0].taskId,
      transitionName: "Update Edit State",
      data: updatedProductData,
      processInstanceIdentifierField: "productIdentifier,productType,productStatus,projectManager,dealStatus,dealIdentifier,dealName,leadIdentifier",
    });

    console.log("Product updated successfully:", result);
  } catch (error) {
    console.error("Failed to invoke action:", error);
    throw error;
  }
};
