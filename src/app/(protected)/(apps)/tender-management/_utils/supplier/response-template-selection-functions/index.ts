import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import {
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";

export const getAllTemplates = async () => {
  const response = await getMyInstancesV2({
    processName: "Response Template",
    predefinedFilters: { taskName: "View" },
  });
  const responseTemplateData = Array.isArray(response)
    ? response.map((e: any) => e.data)
    : [];

  return responseTemplateData;
};

export const saveTemplateSelectionData = async (
  selectedCard: string | null,
  textareaValue: string,
  draftId: string | undefined,
  accountId: string | undefined
) => {
  console.log("Selected Card:", selectedCard);
  console.log("Draft ID:", draftId);
  const softwareId = await getSoftwareIdByNameVersion("Tender Management", "1");
  // Save selected card and draftId to the backend
  try {
    const response = await getMyInstancesV2({
      processName: "Tender Response",
      predefinedFilters: { taskName: "Template Selection" },
      processVariableFilters: { tenderId: draftId , accountId : accountId},
    });

    if (response.length > 0) {
      const taskId = response[0].taskId;
      const data: any = response[0].data;
      await invokeAction({
        taskId: taskId,
        transitionName: "template edit",
        data: {
          ...data,
          selectedResponseTemplate: selectedCard,
          responseDraftContent: textareaValue,
        },
        processInstanceIdentifierField: "id,accountId",
        softwareId: softwareId,
      });
    }
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};