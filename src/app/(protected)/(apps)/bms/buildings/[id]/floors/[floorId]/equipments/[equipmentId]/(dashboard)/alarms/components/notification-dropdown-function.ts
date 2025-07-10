import { getMyInstancesV2, invokeAction } from "@/ikon/utils/api/processRuntimeService";


export async function deactivateNotification(notificationId: string, isNotificationDisabled: boolean) {

  //console.log(`Deactivating notification with ID: ${notificationId}, Disabled: ${isNotificationDisabled}`);


const alertData = await getMyInstancesV2({
    processName: "Alert Rule",
    predefinedFilters: {
      taskName: "Edit Alert",
    },
    processVariableFilters: {
      "id": notificationId,
    },
  });
  if(isNotificationDisabled) {
    (alertData[0].data as { isNotificationDisabled: boolean }).isNotificationDisabled = false;
  } else {
    (alertData[0].data as { isNotificationDisabled: boolean }).isNotificationDisabled = true;
  }
  const taskId = alertData[0].taskId;
  console.log(alertData[0].data)
  await invokeAction({
    taskId: taskId,
    transitionName: "Update Edit Alert",
    data: alertData[0].data,
    processInstanceIdentifierField: "id",
  });
//console.log(`Notification with ID: ${notificationId} deactivated successfully.`);

}

export async function deleteNotification(notificationId: string) {

  // const args = await getMyInstancesV2({
  //   processName: "Alert Rule",
  //   predefinedFilters: {
  //     taskName: "Edit Alert",
  //   },
  //   processVariableFilters: {
  //     "id": notificationId,
  //   },
  // });
  //  const taskId = args[0].taskId;
  //  const processInstanceId = args[0].processInstanceId;
  //  const data = args[0].data;
   const process = await getMyInstancesV2({
    processName: "processInstaceDeleteProcess",
    predefinedFilters: {
      taskName: "process instance deleter",
    },
  });
    const processTaskId = process[0].taskId;
    const deleteData = {processName : "Alert Rule", taskName : "Edit Alert", processIdentifierFields : {"id" : notificationId} };
  await invokeAction({
    taskId: processTaskId,
    transitionName: "delete instance",
    data: deleteData,
    processInstanceIdentifierField: "id"
  });
  console.log(`Notification with ID: ${notificationId} deleted successfully.`);
}




export async function isMuted(notificationId: string,combinedStartDateTime: string, combinedEndDateTime: string) {
  const args = await getMyInstancesV2({
    processName: "Alert Rule",
    predefinedFilters: {
      taskName: "Edit Alert",
    },
    processVariableFilters: {
      "id": notificationId,
    },
  });
  const data = args[0].data as { isMute: boolean; muteStartDate: string; muteEndDate: string };
  const taskId = args[0].taskId;
  data.isMute = true;
  data.muteStartDate = combinedStartDateTime;
  data.muteEndDate = combinedEndDateTime;
 console.log("to be mute data",data)
  await invokeAction({
    taskId: taskId,
    transitionName: "Update Edit Alert",
    data: data,
    processInstanceIdentifierField: "id"
  });
  console.log(`Notification with ID: ${notificationId} muted successfully.`);

}