// "use server";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import {
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";
import { revalidatePath } from "next/cache";

export const getAllTemplates = async () => {
  const response = await getMyInstancesV2({
    processName: "RFP Template",
    predefinedFilters: { taskName: "View" },
  });
  const rfpTemplateData = Array.isArray(response)
    ? response.map((e: any) => e.data)
    : [];

  return rfpTemplateData;
};

export const saveTemplateSelectionData = async (
  selectedCard: string | null,
  textareaValue: string,
  draftId: string | undefined
) => {
  console.log("Selected Card:", selectedCard);
  console.log("Draft ID:", draftId);
  const softwareId = await getSoftwareIdByNameVersion("Tender Management", "1");
  // Save selected card and draftId to the backend
  try {
    const response = await getMyInstancesV2({
      processName: "RFP Draft",
      predefinedFilters: { taskName: "Template Selection" },
      processVariableFilters: { id: draftId },
    });

    console.log('response', response);

    if (response.length > 0) {
      const taskId = response[0].taskId;
      const data: any = response[0].data;
      await invokeAction({
        taskId: taskId,
        transitionName: "template edit",
        data: {
          ...data,
          selectedTemplate: selectedCard,
          draftContent: textareaValue,
        },
        processInstanceIdentifierField: "id",
        softwareId: softwareId,
      });
      console.log('revalidating path');
     // revalidatePath('/tender-management/buyer/my-rfps/' + draftId);
    }
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};
