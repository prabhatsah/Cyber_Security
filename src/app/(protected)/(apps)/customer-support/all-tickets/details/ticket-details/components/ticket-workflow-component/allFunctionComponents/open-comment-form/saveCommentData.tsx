import { invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { TicketData, TicketDetails } from "@/app/(protected)/(apps)/customer-support/components/type";
import { invokeActionProps } from "@/ikon/utils/api/processRuntimeService/type";
import { getCommentRelatedAllDetails } from "../GetCommentRelatedDetails";
import { makeActivityLogsData } from "../../../ActivityLogs";

export const saveCommentData = async (ticketNo: string, uploadedResources: { inputControl: string; resourceId: string; resourceName: string | undefined; resourceType: string | undefined; fileName: any; resourceSize: any; fileType: any; uploadDate: Date; userName: string | null; userId: string; }[]) => {
  try {
    const ticketInstance = await getMyInstancesV2<TicketData>({
      processName: "Customer Support Desk Ticket",
      mongoWhereClause: `this.Data.ticketNo == "${ticketNo}"`,
      projections: ["Data"],
    });

    const taskId = ticketInstance[0].taskId;
    let ticketDetails = ticketInstance[0].data;
    let transition;

    if (ticketDetails.status === "Resolved") {
      transition = "Post Comment Resolve";
    } else if (ticketDetails.status === "Cancelled") {
      transition = "Post Comment Cancel";
    } else {
      transition = "Post Comment Update";
    }

    // Ensure activityLogsData is initialized
    if (!Array.isArray(ticketDetails.activityLogsData)) {
      ticketDetails.activityLogsData = [];
    }

    // Create postComment logs
    const postCommentLogs = await makeActivityLogsData({
      ticketNo,
      action: "postComment",
      argsList: [],
    });

    // Merge logs and remove duplicates
    const mergedLogs = [...ticketDetails.activityLogsData, ...postCommentLogs];
    const uniqueLogs = Array.from(
      new Map(mergedLogs.map((log) => [`${log.action}-${log.dateOfAction}`, log])).values()
    );

    ticketDetails.activityLogsData = uniqueLogs;

    // Add comment details
    const commentDetails = (await getCommentRelatedAllDetails({
      ticketNo,
      ticketDetails,
      commentDivId: "writeComment",
      uploadedResourceList: uploadedResources, // Pass uploaded resources
    })) as TicketDetails;

// Ensure uploadedResources is initialized if not already
if (!Array.isArray(ticketDetails.uploadedResources)) {
  ticketDetails.uploadedResources = [];
}

// Create a Set to track unique resourceIds
const existingResourceIds = new Set(
  ticketDetails.uploadedResources.map((resource) => resource.resourceId)
);

// Filter out already existing resources before merging
const newResourcesToAdd = uploadedResources.filter(
  (newResource) => !existingResourceIds.has(newResource.resourceId)
);

// Merge only the new, unique resources
ticketDetails.uploadedResources = [
  ...ticketDetails.uploadedResources,
  ...newResourcesToAdd,
];
    // Merge the commentDetails with the ticketDetails
    ticketDetails = { ...ticketDetails, ...commentDetails };

    const invokeActionArgs: invokeActionProps = {
      taskId: taskId,
      transitionName: transition,
      data: ticketDetails,
      processInstanceIdentifierField: "ticketNo",
    };

    await invokeAction(invokeActionArgs);

    console.log("Ticket status save comment form updated successfully");
  } catch (error) {
    console.error("Failed to update ticket status:", error);
  }
};
