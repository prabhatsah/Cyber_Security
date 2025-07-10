import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { getSoftwareIdByNameVersion } from "@/ikon/utils/actions/software";
import { getUsersByGroupName } from "@/ikon/utils/actions/users";
import {
  getMyInstancesV2,
  invokeAction,
} from "@/ikon/utils/api/processRuntimeService";
import { useToast } from "@/shadcn/hooks/use-toast";
import { toast } from "sonner";
const moment = require("moment");

// Server function to fetch assignment details
interface AssignmentDetails {
  assignmentId: string;
  assignmentName: string;
  assignmentDescription: string;
  goalsArray: any[];
  datasetArray: any[];
  pastProjectStatus: string;
  projectCreatedDate: string;
  pastStatusList: string[];
  lockStatus: string;

  assignHistory: {
    assigneeId: string;
    assigneeName: string;
    assigneeTime: string;
    assignedBy: string;
  }[];

  activityLogsData: {
    action: string;
    actionString: string;
    dateOfAction: string;
    userId: string;
    userName: string;
    assignedToId?: string;
    assignedToName?: string;
  }[];

  createdOn: string;
  assignedToId: string;
  assignedToName: string;
  assignedTime: string;
}

export const invokeAssignmentProcessAssigneeForm = async (
  assignmentId: string
) => {
  try {
    // Fetch necessary IDs
    const softwareId = "d88395f6-b32a-41ed-ba51-9414a846da54";
    const accountId = await getActiveAccountId();

    const instances = await getMyInstancesV2({
      //   softwareId: softwareId,
      processName: "Assignments",
      //   accountId: accountId,
      predefinedFilters: { taskName: "Assignment Update Activity" },
    });

    // const assignmentsDataDynamic = Array.isArray(instances)
    //   ? instances.map((e: any) => e.data)
    //   : [];
    console.log("assignment data from ankit update-----", instances);
    if (!instances || instances.length === 0) {
      throw new Error("No task data found for the given assignment.");
    }

    const users = await getUsersByGroupName("Data Scientist");
    console.log("users-----------------------------------", users);
    const assignees = Object.values(users.users).map((user) => ({
      id: user.userId,
      name: user.userName,
    }));

    console.log("assignees-----", assignees);

    // Extract assignment details
    const assignmentDetails = instances[0].data;
    //@ts-ignore
    // const lockedFlag = Object.values(instances[0].data?.lockStatus).some(
    //   (status: any) => status.loggedInUserId
    // );
    const lockedFlag = false;

    //@ts-ignore
    // const lockedBy = lockedFlag
    //   ? //@ts-ignore
    //     Object.values(instances[0].data?.lockStatus).find(
    //       (status: any) => status.loggedInUserId
    //       //@ts-ignore
    //     )?.loggedInUserName
    //   : "";

    const lockedBy = "";
    // Return the required data
    return {
      assignmentId,
      //@ts-ignore
      assignmentName: assignmentDetails.assignmentName,
      assignmentDetails,
      assignees,
      lockedBy,
      lockedFlag,
    };
  } catch (error) {
    console.error("Failed to invoke action:", error);
    throw error;
  }
};

export const invokeUpdateAssignee = async (
  assignmentId: string,
  assignedTo: string
) => {
  const softwareId = "d88395f6-b32a-41ed-ba51-9414a846da54";
  const accountId = await getActiveAccountId();

  const instances = await getMyInstancesV2({
    processName: "Assignments",
    predefinedFilters: { taskName: "Assignment Update Activity" },
    mongoWhereClause: `this.Data.assignmentId == ${assignmentId}`,
  });
  if (!instances || instances.length === 0) {
    throw new Error("No task data found for the given assignment.");
  }
  // Extract assignment details
  let assignmentDetails = instances[0].data;
  let selectedAssignmentTaskId = instances[0].taskId;

  console.log("assignmentDetails from invoke button----", assignmentDetails);

  const users = await getUsersByGroupName("Data Scientist");
  console.log("users-----------------------------------", users);
  const assignees = Object.values(users.users).map((user) => ({
    id: user.userId,
    name: user.userName,
  }));

  let nameOfAssignee = assignees.filter((a) => a.id == assignedTo)[0].name;

  const userId: string = (await getProfileData()).USER_ID;
  const userName: string = (await getProfileData()).USER_NAME;
  const actionString = "Assigned to " + nameOfAssignee;
  const activityLogsObj = {
    action: "assignment",
    userId: userId,
    userName: userName,
    dateOfAction: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
    assignedToId: assignedTo,
    actionString: actionString,
  };

  const assigneeHistoryObj = {
    assigneeId: assignedTo,
    assigneeName: nameOfAssignee,
    assigneeTime: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
    assignedBy: userId,
  };

  assignmentDetails["assignedBy"] = userId;
  assignmentDetails["assigneeName"] = nameOfAssignee;
  assignmentDetails["assigneeId"] = assignedTo;
  assignmentDetails["assigneeTime"] = moment().format(
    "YYYY-MM-DDTHH:mm:ss.SSSZ"
  );

  if (!assignmentDetails["activityLogsData"]) {
    assignmentDetails["activityLogsData"] = [];
  }
  assignmentDetails["activityLogsData"].push(activityLogsObj);

  if (!assignmentDetails["assignHistory"]) {
    assignmentDetails["assignHistory"] = [];
  }
  assignmentDetails["assignHistory"].push(assigneeHistoryObj);

  if (!assignmentDetails["pastStateList"]) {
    assignmentDetails["pastStateList"] = [];
  }

  if (
    assignmentDetails["pastStateList"][
      assignmentDetails["pastStateList"].length - 1
    ] != "Assigned"
  ) {
    assignmentDetails["pastStateList"].push("Assigned");
  }

  assignmentDetails["status"] =
    assignmentDetails["status"] == "Project Created"
      ? "Project Created"
      : "Assigned";

  const result = await invokeAction({
    taskId: selectedAssignmentTaskId,
    transitionName: "Update Assignment",
    //@ts-ignore
    data: assignmentDetails,
    processInstanceIdentifierField: "",
  });
};

export const deleteAssignment = async (assignmentId: string) => {
  try {
    const response = await getMyInstancesV2({
      processName: "processInstaceDeleteProcess",
      // predefinedFilters: { taskName: "Draft" },
      // processVariableFilters: { id: draftId },
    });

    if (response.length > 0) {
      console.log("response delete-----", response);
      const taskId = response[0].taskId;
      const data: any = response[0].data;

      var deleteIdentifier = {
        processName: "Assignments",
        taskName: "Assignment Update Activity",
        mongoWhereClause: `this.Data.assignmentId =="${assignmentId}"`,
      };

      await invokeAction({
        taskId: taskId,
        transitionName: "delete instance",
        data: deleteIdentifier,
        processInstanceIdentifierField: "",
      });
      console.log("SUCCESS IN INVOKE ACTION");
      // toast.success("Assignment deleted successfully!");
    }
  } catch (error) {
    debugger;
    toast.error("Failed in assignment deletion!");
    console.error("Failed to edit data:", error);
    throw error;
  }
};
