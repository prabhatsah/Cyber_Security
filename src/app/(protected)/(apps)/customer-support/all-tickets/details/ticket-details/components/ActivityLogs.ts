// utils/makeActivityLogsData.ts
import { getProfileData } from "@/ikon/utils/actions/auth";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

interface ActivityLog {
  action: string;
  userId: string;
  userName: string;
  dateOfAction: Date;
  actionString: string;
  assignedToId?: string;
  previousState?: string;
  newState?: string;
  previousPriority?: string;
  newPriority?: string;
  previousType?: string;
  newType?: string;
  lockAcquiredById?: string;
  recipientsName?: string[];
  creatorId?:string;
  name?:string;
}


interface TicketData {
  activityLogsData?: ActivityLog[];
  creatorId?: string;
  name?: string;
  dateCreated?: Date;
  [key: string]: any; // Allow other properties in TicketData
}

interface MakeActivityLogsDataParams {
  ticketNo: string;
  action: string;
  argsList: any[];
}

export const makeActivityLogsData = async ({
  ticketNo,
  action,
  argsList,
}: MakeActivityLogsDataParams): Promise<ActivityLog[]> => {
  // Fetch profile data
  
  const profileData = await getProfileData();
  const userId = profileData.USER_ID;
  const userName = profileData.USER_NAME;

  let actionString = "";
  if (action === "creation") {
    const creationActivity: ActivityLog = {
      action: "creation",
      userId,
      userName,
      dateOfAction: new Date(),
      actionString: "Ticket created",
    };
    
    console.log("Creation Activity:", creationActivity);
    return [creationActivity]; // Ensure array return
  }

  // Fetch ticket data using getMyInstancesV2
  const ticketInstance = await getMyInstancesV2<TicketData>({
    processName: "Customer Support Desk Ticket",
    mongoWhereClause: `this.Data.ticketNo == "${ticketNo}"`,
  });

  // Ensure ticket data is available
  if (!ticketInstance || ticketInstance.length === 0) {
    throw new Error(`No ticket found with ticketNo: ${ticketNo}`);
  }

  // Extract ticketData from the API response
  const ticketData = ticketInstance[0].data; // Assuming the ticket data is in the `data` property

  console.log("lets see the ticketdats--> " , ticketData)
  // Create the activity log object
  const eachActivityObj: ActivityLog = {
    action: action,
    userId: userId,
    userName: userName,
    dateOfAction: new Date(),  
    actionString: "",
  };

  // Determine the action string based on the action type

  if (action === "creation") {
    actionString = "Ticket created";
  } else if (action === "assignment") {
    eachActivityObj.assignedToId = argsList[0];
    actionString = `Assigned to ${argsList[1]}`;
  } else if (action === "stateChange") {
    eachActivityObj.previousState = argsList[0];
    eachActivityObj.newState = argsList[1];
    actionString = `Ticket state changed from ${argsList[0]} to ${argsList[1]}`;
  } else if (action === "priorityChange") {
    eachActivityObj.previousPriority = argsList[0];
    eachActivityObj.newPriority = argsList[1];
    actionString = `Ticket severity changed from ${argsList[0]} to ${argsList[1]}`;
  } else if (action === "typeChange") {
    eachActivityObj.previousType = argsList[0];
    eachActivityObj.newType = argsList[1];
    actionString = `Ticket type changed from ${argsList[0]} to ${argsList[1]}`;
  } else if (action === "lockAcquired") {
    eachActivityObj.lockAcquiredById = argsList[0];
    actionString = "Lock acquired";
  } else if (action === "lockReleased") {
    actionString = "Lock released";
  } else if (action === "postComment") {
    actionString = "Comment posted";
  } else if (action === "sendCustomizeMail") {
    eachActivityObj.recipientsName = argsList[0];
    const recipientsNameString = argsList[0].join(", ");
    actionString = `Mail sent to ${recipientsNameString}`;
  } else if (action === "ticketAccountUpdate") {
    actionString = `Ticket Account changed from ${argsList[0]} to ${argsList[1]}`;
  }

  eachActivityObj.actionString = actionString;

  // Initialize activityLogsData if it doesn't exist or is not an array
  if (!Array.isArray(ticketData.activityLogsData)) {
    ticketData.activityLogsData = [];
  }

  // If the activityLogsData array is empty, add a creation activity log
  const creationExists = ticketData.activityLogsData.some(log => log.action === "creation");

  if (!creationExists) {
    const creationActivity: ActivityLog = {
      action: "creation",
      userId: ticketData.creatorId ? ticketData.creatorId : ticketData.createdBy,
      userName: ticketData.name ? ticketData.name : ticketData.createdBy,
      dateOfAction: ticketData.dateCreated 
      ? new Date(ticketData.dateCreated)  // ✅ Converts string/Date to Date object
      : new Date(),  
      actionString: "Ticket created",
    };
    console.log(creationActivity.dateOfAction.toISOString());
    console.log("yooo brooo ---------->>>>>>>>>>>", creationActivity)
    ticketData.activityLogsData.push(creationActivity);
  }

  // Add the new activity log
  ticketData.activityLogsData.push(eachActivityObj);

  return ticketData.activityLogsData;
};