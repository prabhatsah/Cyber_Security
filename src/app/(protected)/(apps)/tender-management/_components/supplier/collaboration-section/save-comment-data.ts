import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { invokeAction } from "@/ikon/utils/api/processRuntimeService";

export const saveCommentData = async (draftId : string ,supplierId : string, commentData : any) => {
console.log("Draft ID:", draftId);
console.log("Comment Data:", commentData);
const softwareId = await getSoftwareIdByNameVersion("Tender Management", "1");
// Save comment data to the backend
const response = await getMyInstancesV2({
      processName: "Tender Response",
      predefinedFilters: { taskName: "Project Details" },
      processVariableFilters: { id: draftId}
 },
    );

    console.log("Response:", response);

    if (response.length > 0) {

    
      const taskId = response[0].taskId;
      const data: any = response[0].data;
      data.responseChatMessages = (data.responseChatMessages && data.responseChatMessages.length > 0) 
  ? [...data.responseChatMessages, commentData] 
  : [commentData];

      await invokeAction({
        taskId: taskId,
        transitionName: "edit project",
        data: data,
        processInstanceIdentifierField: "id,supplierId",
        softwareId: softwareId,
      });
    }
}