import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import {
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";

const invokeWorkflowAction = async (
  bidId: string,
  taskName: string,
  transitionName: string,
  data: any
) => {
  const softwareId = await getSoftwareIdByNameVersion("Tender Management", "1");
  try {
    const response = await getMyInstancesV2({
      processName: "Tender Management",
      predefinedFilters: { taskName: taskName },
      processVariableFilters: { bidId: bidId },
    });

    console.log("response", response);

    if (response.length > 0) {
      const taskId = response[0].taskId;
      const taskData: any = response[0].data;
      await invokeAction({
        taskId: taskId,
        transitionName: transitionName,
        data: { ...taskData, ...data },
        processInstanceIdentifierField: "bidId",
        softwareId: softwareId,
      });
    }
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

export const proceedToContractFinalisation = async (bidId: any) => {
  try {
    await invokeWorkflowAction(
      bidId,
      "Bid Shortlisting and Negotiations",
      "Go to Contract Finalization",
      {
        tenderFlow: {
          "Awarded Tender": "PENDING",
          "Contract Finalisation": "IN PROGRESS",
          "Supplier Negotiation": "COMPLETED",
          "Supplier Shortlisted": "COMPLETED",
        },
      }
    );
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

export const proceedToAwardedTender = async (bidId: any) => {
  try {
    await invokeWorkflowAction(
      bidId,
      "Contract Finalization",
      "Go to Project Win",
      {
        tenderFlow: {
          "Awarded Tender": "IN PROGRESS",
          "Contract Finalisation": "COMPLETED",
          "Supplier Negotiation": "COMPLETED",
          "Supplier Shortlisted": "COMPLETED",
        },
      }
    );
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};

export const completeAwardedTender = async (bidId: any) => {
  try {
    await invokeWorkflowAction(bidId, "Project Win", "Update Project Win", {
      tenderFlow: {
        "Awarded Tender": "COMPLETED",
        "Contract Finalisation": "COMPLETED",
        "Supplier Negotiation": "COMPLETED",
        "Supplier Shortlisted": "COMPLETED",
      },
    });
  } catch (error) {
    console.error("Failed to edit data:", error);
    throw error;
  }
};
