import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";

export const sendForReview = async (supplierId: string | null) => {
  try {
    const response = await getMyInstancesV2({
      processName: "RFP Supplier",
      predefinedFilters: { taskName: "Register" },
      processVariableFilters: { supplierId: supplierId },
    });

    if (response.length > 0) {
      const taskId: string = response[0].taskId;
      const data: any = response[0].data;
      await invokeAction({
        taskId: taskId,
        transitionName: "to review",
        processInstanceIdentifierField: "supplierId",
        data: { ...data, status: "Review" },
      });
    }
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};
