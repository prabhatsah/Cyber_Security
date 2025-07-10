import { getMyInstancesV2, getParameterizedDataForTaskId } from "@/ikon/utils/api/processRuntimeService";

interface NotificationData {
  taskId: string;
}
interface paramType {
  timePeriod: number;
  startDate : string;
  endDate : string;
}

export async function getLatestNotificationData(notificationId: string,parameters: paramType) {
  const notificationInstance = await getMyInstancesV2({
    processName: "Notification Query Dashboard",
    predefinedFilters: {
      taskName: "View Dashboard Item Activity",
    },

  });
  console.log("notificationInstance", notificationInstance);
 const param = {
    timePeriod: parameters.timePeriod ? parameters.timePeriod : null,
    startDate: parameters.startDate ? parameters.startDate : null,
    endDate: parameters.endDate ? parameters.endDate : null,
  }

  const taskId = notificationInstance[0].taskId;
  console.log("taskId", taskId);
  const notificationData = await getParameterizedDataForTaskId({
    taskId,
    parameters: param,
  });
  return notificationData;
}
