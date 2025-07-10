import { invokeAction } from "@/ikon/utils/api/processRuntimeService";

export async function editDealSubmit(data: any, taskId: any) {
  try {
    const result = await invokeAction({
      taskId: taskId,
      transitionName: "Update Edit",
      data: data,
      processInstanceIdentifierField:
        "dealIdentifier,dealStatus,dealName,leadIdentifier,productIdentifier,productType,projectManager,productStatus,accountIdentifier",
    });
    console.log(result);
  } catch (error) {
    console.error("Failed to invoke action:", error);
  }
}
