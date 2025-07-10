import { invokeAction } from "@/ikon/utils/api/processRuntimeService";

export const invokeQuotation = async (finalData: Record<string, any>,taskId: string) => {
  try {
    const result = await invokeAction({
      taskId,
      transitionName: "Update Edit Quotation",
      data: finalData,
      processInstanceIdentifierField: "",
    });

    console.log("Quotation updated successfully:", result);
  } catch (error) {
    console.error("Failed to invoke action:", error);
    throw error;
  }
};
