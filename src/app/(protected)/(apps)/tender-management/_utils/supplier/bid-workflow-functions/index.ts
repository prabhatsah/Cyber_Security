import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { singleFileUpload } from "@/ikon/utils/api/file-upload";
import {
  getMyInstancesV2,
  invokeAction,
  mapProcessName,
  startProcessV2,
} from "@/ikon/utils/api/processRuntimeService";

export default async function startBiding({ tenderData }: { tenderData: any }) {
  const processId = await mapProcessName({ processName: "Tender Response" });
  console.log("processId", processId);
  console.log("tenderData", tenderData);
  await startProcessV2({
    processId,
    data: tenderData,
    processIdentifierFields: "bidId,tenderId,accountId",
  });
}

const invokeWorkflowAction = async (
  draftId: string,
  accountId: string,
  taskName: string,
  transitionName: string,
  data: any
) => {
  const softwareId = await getSoftwareIdByNameVersion("Tender Management", "1");
  try {
    const response = await getMyInstancesV2({
      processName: "Tender Response",
      predefinedFilters: { taskName: taskName },
      processVariableFilters: { tenderId: draftId, accountId: accountId },
    });

    if (response.length > 0) {
      const taskId = response[0].taskId;
      const taskData: any = response[0].data;
      await invokeAction({
        taskId: taskId,
        transitionName: transitionName,
        data: { ...taskData, ...data },
        processInstanceIdentifierField: "tenderId,accountId",
        softwareId: softwareId,
      });
    }
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

//Tender Analyzer

export const proceedToTempalteSelection = async (draftId: string, accountId: string) => {
  console.log("Proceeded to draft");
  console.log("Draft ID:", draftId);
  // Save selected card and draftId to the backend
  try {
    await invokeWorkflowAction(
      draftId,
      accountId,
      "Project Details",
      "edit project",
      {
        bidSteptracker: {
          "Bid Initialization": "COMPLETED",
          "Template Selection": "IN PROGRESS",
          Draft: "PENDING",
          Approve: "PENDING",
          "Tender Analyzer": "COMPLETED",
          "Bid Completion": "PENDING",
        },
      }
    );
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

export const backToTenderAnalyzer = async (draftId: string, accountId: string) => {
  console.log("Proceeded to draft");
  console.log("Draft ID:", draftId);
  // Save selected card and draftId to the backend
  try {
    await invokeWorkflowAction(
      draftId,
      accountId,
      "Project Details",
      "edit project",
      {
        bidSteptracker: {
          "Bid Initialization": "COMPLETED",
          "Template Selection": "PENDING",
          Draft: "PENDING",
          Approve: "PENDING",
          "Tender Analyzer": "IN PROGRESS",
          "Bid Completion": "PENDING",
        },
      }
    );
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

//template selection
export const proceedToDraft = async (draftId: string, accountId: string) => {
  console.log("Proceeded to draft");
  console.log("Draft ID:", draftId);
  // Save selected card and draftId to the backend
  try {
    await invokeWorkflowAction(
      draftId,
      accountId,
      "Template Selection",
      "template edit",
      {
        bidSteptracker: {
          "Bid Initialization": "COMPLETED",
          "Tender Analyzer": "COMPLETED",
          "Template Selection": "COMPLETED",
          Draft: "IN PROGRESS",
          Approve: "PENDING",
          "Bid Completion": "PENDING",
        },
      }
    );
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

export const saveDraftFinalizeData = async (
  textareaValue: string,
  draftId: string | undefined,
  accountId: string | undefined,
  file: File | null
) => {
  console.log("Draft ID:", draftId);
  const softwareId = await getSoftwareIdByNameVersion("Tender Management", "1");
  // Save selected card and draftId to the backend
  try {
    const response = await getMyInstancesV2({
      processName: "Tender Response",
      predefinedFilters: { taskName: "Draft" },
      processVariableFilters: { tenderId: draftId, accountId: accountId },
    });

    if (response.length > 0) {
      const taskId = response[0].taskId;
      const data: any = response[0].data;
      if (file) {
        const resourceData = await singleFileUpload(file);
        console.log("File upload result:", resourceData);
        await invokeAction({
          taskId: taskId,
          transitionName: "draft edit",
          data: {
            ...data,
            responseDraftResource: resourceData,
            responseDraftFinalized: true,
          },
          processInstanceIdentifierField: "tenderId,accountId",
          softwareId: softwareId,
        });
      } else {
        await invokeAction({
          taskId: taskId,
          transitionName: "draft edit",
          data: {
            ...data,
            responseDraftContent: textareaValue,
            responseDraftFinalized: true,
          },
          processInstanceIdentifierField: "tenderId,accountId",
          softwareId: softwareId,
        });
      }
    }
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

export const backToTemplateSelection = async (
  draftId: string,
  accountId: string
) => {
  try {
    await invokeWorkflowAction(draftId, accountId, "Draft", "draft edit", {
      bidSteptracker: {
        "Bid Initialization": "COMPLETED",
        "Tender Analyzer": "COMPLETED",
        "Template Selection": "IN PROGRESS",
        Draft: "PENDING",
        Approve: "PENDING",
        "Bid Completion": "PENDING",
      },
      responseDraftFinalized: false,
    });
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

export const proceedToApproval = async (
  draftId: string,
  accountId: string
) => {
  console.log("Proceeded to approval");
  try {
    //invoke template finalize and draft finalize one after another
    await invokeWorkflowAction(
      draftId,
      accountId,
      "Template Selection",
      "template finalized",
      {
        bidSteptracker: {
          "Bid Initialization": "COMPLETED",
          "Tender Analyzer": "COMPLETED",
          "Template Selection": "COMPLETED",
          Draft: "IN PROGRESS",
          Approve: "PENDING",
          "Bid Completion": "PENDING",
        },
      }
    );

    await invokeWorkflowAction(
      draftId,
      accountId,
      "Draft",
      "draft finalized",
      {
        bidSteptracker: {
          "Bid Initialization": "COMPLETED",
          "Tender Analyzer": "COMPLETED",
          "Template Selection": "COMPLETED",
          Draft: "COMPLETED",
          Approve: "IN PROGRESS",
          "Bid Completion": "PENDING",
        },
      }
    );
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

export const backToDraft = async (draftId: string, accountId: string) => {
  console.log("back to draft");
  try {
    await invokeWorkflowAction(
      draftId,
      accountId,
      "Draft Review",
      "back to config",
      {
        bidSteptracker: {
          "Bid Initialization": "COMPLETED",
          "Tender Analyzer": "COMPLETED",
          "Template Selection": "COMPLETED",
          Draft: "IN PROGRESS",
          Approve: "PENDING",
          "Bid Completion": "PENDING",
        },
      }
    );
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

export const rejectDraft = async (draftId: string, accountId: string) => {
  console.log("rejected draft");
  try {
    await invokeWorkflowAction(
      draftId,
      accountId,
      "Draft Review",
      "to reject",
      {
        bidSteptracker: {
          "Bid Initialization": "COMPLETED",
          "Tender Analyzer": "COMPLETED",
          "Template Selection": "COMPLETED",
          Draft: "COMPLETED",
          Approve: "REJECTED",
          "Bid Completion": "PENDING",
        },
        responseApprovalStatus: false,
      }
    );
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};
export const approveDraft = async (draftId: string, accountId: string) => {
  console.log("approved draft");
  try {
    await invokeWorkflowAction(
      draftId,
      accountId,
      "Draft Review",
      "to approve",
      {
        bidSteptracker: {
          "Bid Initialization": "COMPLETED",
          "Tender Analyzer": "COMPLETED",
          "Template Selection": "COMPLETED",
          Draft: "COMPLETED",
          Approve: "COMPLETED",
          "Bid Completion": "IN PROGRESS",
        },
        responseApprovalStatus: true,
      }
    );
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

export const completeBid = async (draftId: string, accountId: string) => {
  console.log("published draft");
  try {
    await invokeWorkflowAction(draftId, accountId, "Approved", "to publish", {
      bidSteptracker: {
        "Bid Initialization": "COMPLETED",
        "Tender Analyzer": "COMPLETED",
        "Template Selection": "COMPLETED",
        Draft: "COMPLETED",
        Approve: "COMPLETED",
        "Bid Completion": "COMPLETED",
      },
      bidPublishedStatus: "published",
      publishedTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

export const rejectBid = async (draftId: string, accountId: string) => {
  console.log("back to approval");
};
