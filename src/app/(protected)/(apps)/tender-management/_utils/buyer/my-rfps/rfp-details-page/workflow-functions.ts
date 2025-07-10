import { useDialog } from "@/ikon/components/alert-dialog/dialog-context";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import {
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";

const invokeWorkflowAction = async (
  draftId: string,
  taskName: string,
  transitionName: string,
  data: any
) => {
  const softwareId = await getSoftwareIdByNameVersion("Tender Management", "1");
  try {
    const response = await getMyInstancesV2({
      processName: "RFP Draft",
      predefinedFilters: { taskName: taskName },
      processVariableFilters: { id: draftId },
    });

    if (response.length > 0) {
      const taskId = response[0].taskId;
      const taskData: any = response[0].data;
      await invokeAction({
        taskId: taskId,
        transitionName: transitionName,
        data: { ...taskData, ...data },
        processInstanceIdentifierField: "id",
        softwareId: softwareId,
      });
    }
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

//template selection
export const proceedToDraft = async (draftId: string) => {
  console.log("Proceeded to draft");
  console.log("Draft ID:", draftId);
  // Save selected card and draftId to the backend
  try {
    await invokeWorkflowAction(draftId, "Template Selection", "template edit", {
      stepTracker: {
        "Draft Creation": "COMPLETED",
        "Template Selection": "COMPLETED",
        Draft: "IN PROGRESS",
        Approval: "PENDING",
        Publish: "PENDING",
      },
    });
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

//draft
export const proceedToApproval = async (draftId: string) => {
  console.log("Proceeded to approval");
  try {
   
    //invoke template finalize and draft finalize one after another
    await invokeWorkflowAction(draftId, "Template Selection", "template finalized", {
      stepTracker: {
        "Draft Creation": "COMPLETED",
        "Template Selection": "COMPLETED",
        Draft: "IN PROGRESS",
        Approval: "PENDING",
        Publish: "PENDING",
      },
    });


    await invokeWorkflowAction(draftId, "Draft", "draft finalized", {
      stepTracker: {
        "Draft Creation": "COMPLETED",
        "Template Selection": "COMPLETED",
        Draft: "COMPLETED",
        Approval: "IN PROGRESS",
        Publish: "PENDING",
      },
    });
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

export const backToTemplateSelection = async (draftId: string) => {
  try {
    await invokeWorkflowAction(draftId, "Draft", "draft edit", {
      stepTracker: {
        "Draft Creation": "COMPLETED",
        "Template Selection": "IN PROGRESS",
        Draft: "PENDING",
        Approval: "PENDING",
        Publish: "PENDING",
      },
      draftFinalized : false
    });
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

//approval
export const approveDraft = async (draftId: string) => {
  console.log("approved draft");
  try {
    await invokeWorkflowAction(draftId, "Draft Review", "to approve", {
      stepTracker: {
        "Draft Creation": "COMPLETED",
        "Template Selection": "COMPLETED",
        Draft: "COMPLETED",
        Approval: "COMPLETED",
        Publish: "IN PROGRESS",
      },
      approvalStatus : true
    });
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

export const rejectDraft = async (draftId: string) => {
  console.log("rejected draft");
  try {
    await invokeWorkflowAction(draftId, "Draft Review", "to reject", {
      stepTracker: {
        "Draft Creation": "COMPLETED",
        "Template Selection": "COMPLETED",
        Draft: "COMPLETED",
        Approval: "REJECTED",
        Publish: "REJECTED",
      },
      approvalStatus : false
    });
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

export const backToDraft = async (draftId: string) => {
  console.log("back to draft");
  try {
    await invokeWorkflowAction(draftId, "Draft Review", "back to config", {
      stepTracker: {
        "Draft Creation": "COMPLETED",
        "Template Selection": "COMPLETED",
        Draft: "IN PROGRESS",
        Approval: "PENDING",
        Publish: "PENDING",
      },
    });
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

//publish
export const publishDraft = async (draftId: string) => {
  console.log("published draft");
   try {
     await invokeWorkflowAction(draftId, "Approved", "to publish", {
       stepTracker: {
         "Draft Creation": "COMPLETED",
         "Template Selection": "COMPLETED",
         Draft: "COMPLETED",
         Approval: "COMPLETED",
         Publish: "COMPLETED",
       },
       publishedStatus : 'published',
       publishedTime : new Date().toISOString()
     });
   } catch (error) {
     console.error("Failed to edit data:", error);
     throw error;
   }
};

export const rejectBid = async (draftId: string) => {
  console.log("back to approval");
};
