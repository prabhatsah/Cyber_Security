import { invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { TicketData } from "@/app/(protected)/(apps)/customer-support/components/type";
import { makeActivityLogsData } from "../../ActivityLogs";
import { getCommentRelatedAllDetails } from "./GetCommentRelatedDetails";
import { resetTicketPastStateList, setTicketUpdateUserDetails, TicketDetails } from "./setTicketUpdateUserDetails";
import { invokeActionProps } from "@/ikon/utils/api/processRuntimeService/type";

export const updateTicketStatus = async (ticketNo: string, args: string, comment: string) => {
  const [transition, state] = args.split(",");

  const getStatesWithLockRequired = (): string[] => {
    const ticketStatesMap = {
      "Ticket Created": ["Assign"],
      Assigned: ["In Progress", "Cancelled"],
      "In Progress": ["On Hold", "Restored", "Resolved", "Cancelled"],
      "On Hold": ["In Progress", "Cancelled"],
      Restoration: ["Resolved"],
      Resolved: ["Closed", "Reopen"],
      Cancelled: ["Closed"],
      "Ticket Closed": [],
    };

    let statesList = Object.keys(ticketStatesMap);

    if (statesList.length > 2) {
      statesList.splice(0, 2);
    }

    if (statesList.indexOf("Ticket Closed") > 0) {
      statesList.splice(statesList.indexOf("Ticket Closed"), 1);
    }

    return statesList;
  };

//   const commentId = `addComment`;
//   if (!comment) {
//     alert("Please add your comment!");
//     return;
//   }


  try {
    const ticketInstance = await getMyInstancesV2<TicketData>({
      processName: "Customer Support Desk Ticket",
      mongoWhereClause: `this.Data.ticketNo == "${ticketNo}"`,
      projections: ["Data"],
    });
    const taskId = ticketInstance[0].taskId;
    let ticketDetails = ticketInstance[0].data;


    
    const previousStatus = ticketDetails.status;
    const newStatus = state;

     // Ensure activityLogsData is initialized
     if (!Array.isArray(ticketDetails.activityLogsData)) {
      ticketDetails.activityLogsData = [];
    }

    // Create state change logs
    const stateChangeLogs = await makeActivityLogsData({
      ticketNo,
      action: "stateChange",
      argsList: [previousStatus, newStatus],
    });

    let mergedLogs = [...stateChangeLogs];

    // Create lock acquired logs if applicable
    if (previousStatus == "New" && newStatus == "In Progress") {
      const lockAcquiredLogs = await makeActivityLogsData({
        ticketNo: ticketNo,
        action: "lockAcquired",
        argsList: [ticketDetails["assigneeId"]],
      });
      mergedLogs = [...mergedLogs, ...lockAcquiredLogs];
    }

    // Remove duplicates using a Map
    const uniqueLogs = Array.from(
      new Map(mergedLogs.map(log => [`${log.action}-${log.dateOfAction}`, log])).values()
    );

    ticketDetails.activityLogsData = uniqueLogs;
    ticketDetails.previousStatus = previousStatus;
    ticketDetails.status = newStatus;
    ticketDetails.isStatusChange = true;
    ticketDetails.pastStateList = ticketDetails.pastStateList || [];
    ticketDetails.pastStateList.push(newStatus);

    const statesWithLock = getStatesWithLockRequired();
    if (statesWithLock.includes(newStatus)) {
      ticketDetails.assigneeLockStatus = "locked";
    }

      const commentDetails = (await getCommentRelatedAllDetails({
        ticketNo,
        ticketDetails,
        commentDivId: "addComment",
        uploadedResourceList: [],
      })) as TicketDetails; 

    ticketDetails = { ...ticketDetails, ...commentDetails };

    let updatedTicket = await setTicketUpdateUserDetails(state, ticketDetails);
    updatedTicket = await resetTicketPastStateList(transition, updatedTicket);

    const invokeActionArgs: invokeActionProps = {
        taskId: taskId,
        transitionName: "Update",
        data: updatedTicket,
        processInstanceIdentifierField: "ticketNo",
      };
      await invokeAction(invokeActionArgs);
      
    console.log("Ticket status updated successfully");
  } catch (error) {
    console.error("Failed to update ticket status:", error);
  }
};

