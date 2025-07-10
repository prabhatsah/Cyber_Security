import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { singleFileUpload } from "@/ikon/utils/api/file-upload";
import {
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";

export const saveDraftFinalizeData = async (
  textareaValue: string,
  draftId: string | undefined,
  file : File | null
) => {
  console.log("Draft ID:", draftId);
  const softwareId = await getSoftwareIdByNameVersion("Tender Management", "1");
  // Save selected card and draftId to the backend
  try {
    const response = await getMyInstancesV2({
      processName: "RFP Draft",
      predefinedFilters: { taskName: "Draft" },
      processVariableFilters: { id: draftId },
    });

    if (response.length > 0) {
      const taskId = response[0].taskId;
      const data: any = response[0].data;
      if(file){
        const resourceData = await singleFileUpload(file);
        console.log("File upload result:", resourceData);
        await invokeAction({
          taskId: taskId,
          transitionName: "draft edit",
          data: { ...data, draftResource: resourceData, draftFinalized: true },
          processInstanceIdentifierField: "id",
          softwareId: softwareId,
        });
      }else{
        await invokeAction({
          taskId: taskId,
          transitionName: "draft edit",
          data: { ...data, draftContent: textareaValue, draftFinalized: true },
          processInstanceIdentifierField: "id",
          softwareId: softwareId,
        });
      }
    }
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};
