import {
  getMyInstancesV2,
  getParameterizedDataForTaskId,
} from "@/ikon/utils/api/processRuntimeService";
import { getProfileData } from "@/ikon/utils/actions/auth";

// export const NotificationData: NotificationType[] = [
//     {
//         "archived": false,
//         "created_at": "2025-01-15T06:23:43.563+0000",
//         "created_by": "e58bf892-581f-4922-a890-34a15141d8c3",
//         "created_from": "cbfc7c21-af73-4844-9f42-d830480f874b",
//         "description": "Avatar is not selected",
//         "notification_id": "71259538-a5a2-488f-8049-192664ef77e1",
//         "notification_name": "User Profile",
//         "origin_url": "",
//         "priority": "medium",
//         "read": false,
//         "starred": false,
//         "type": "error"
//     },
//     {
//         "archived": false,
//         "created_at": "2025-01-13T12:04:05.959+0000",
//         "created_by": "e58bf892-581f-4922-a890-34a15141d8c3",
//         "created_from": "cbfc7c21-af73-4844-9f42-d830480f874b",
//         "description": "Avatar is not selected",
//         "notification_id": "e4cc6746-86e2-457a-9256-d0ed765b0515",
//         "notification_name": "User Profile",
//         "origin_url": "",
//         "priority": "medium",
//         "read": false,
//         "starred": false,
//         "type": "error"
//     },
//     {
//         "archived": false,
//         "created_at": "2025-01-13T09:18:10.960+0000",
//         "created_by": "e58bf892-581f-4922-a890-34a15141d8c3",
//         "created_from": "cbfc7c21-af73-4844-9f42-d830480f874b",
//         "description": "Avatar is not selected",
//         "notification_id": "d31320a4-390b-496d-87b6-8f8738ab614e",
//         "notification_name": "User Profile",
//         "origin_url": "",
//         "priority": "medium",
//         "read": true,
//         "starred": false,
//         "type": "error"
//     },
//     {
//         "archived": false,
//         "created_at": "2025-01-15T07:08:21.319+0000",
//         "created_by": "e58bf892-581f-4922-a890-34a15141d8c3",
//         "created_from": "cbfc7c21-af73-4844-9f42-d830480f874b",
//         "description": "Avatar is not selected",
//         "notification_id": "c99909e3-ae05-44d6-9210-66e32569da44",
//         "notification_name": "User Profile",
//         "origin_url": "#level1=openBaseAppPage('1718784118670')%3B%7C%7CSetting##level2=openBaseAppPage('1719471914363'%2C%20'NotificationTable'%2C%20'Account%20Settings'%2C'MLP'%2C'IkonMainContentDiv'%2C'notificationsMenu')%7C%7CNotifications",
//         "priority": "medium",
//         "read": false,
//         "starred": false,
//         "type": "error"
//     },
//     {
//         "archived": false,
//         "created_at": "2025-01-13T09:28:56.623+0000",
//         "created_by": "e58bf892-581f-4922-a890-34a15141d8c3",
//         "created_from": "cbfc7c21-af73-4844-9f42-d830480f874b",
//         "description": "Avatar is not selected",
//         "notification_id": "35604984-335a-45a5-aa97-c191207cf293",
//         "notification_name": "User Profile",
//         "origin_url": "#level1=openBaseAppPage('1718784118670')%3B%7C%7CSetting##level2=openBaseAppPage('1719471914363'%2C%20'NotificationTable'%2C%20'Account%20Settings'%2C'MLP'%2C'IkonMainContentDiv'%2C'notificationsMenu')%7C%7CNotifications",
//         "priority": "medium",
//         "read": false,
//         "starred": false,
//         "type": "error"
//     },
//     {
//         "archived": false,
//         "created_at": "2025-01-15T07:05:30.904+0000",
//         "created_by": "e58bf892-581f-4922-a890-34a15141d8c3",
//         "created_from": "cbfc7c21-af73-4844-9f42-d830480f874b",
//         "description": "Avatar is not selected",
//         "notification_id": "de771bc3-7647-42a8-a24e-fa919ce20f14",
//         "notification_name": "User Profile",
//         "origin_url": "#level1=openBaseAppPage('1718784118670')%3B%7C%7CSetting##level2=openBaseAppPage('1719471914363'%2C%20'NotificationTable'%2C%20'Account%20Settings'%2C'MLP'%2C'IkonMainContentDiv'%2C'notificationsMenu')%7C%7CNotifications",
//         "priority": "medium",
//         "read": false,
//         "starred": false,
//         "type": "error"
//     },
//     {
//         "archived": false,
//         "created_at": "2025-01-15T05:05:20.346+0000",
//         "created_by": "e58bf892-581f-4922-a890-34a15141d8c3",
//         "created_from": "cbfc7c21-af73-4844-9f42-d830480f874b",
//         "description": "Avatar is not selected",
//         "notification_id": "601ada41-0921-4a36-8c68-26301d72ba38",
//         "notification_name": "User Profile",
//         "origin_url": "",
//         "priority": "medium",
//         "read": false,
//         "starred": false,
//         "type": "error"
//     },
//     {
//         "archived": false,
//         "created_at": "2025-01-15T05:06:36.189+0000",
//         "created_by": "e58bf892-581f-4922-a890-34a15141d8c3",
//         "created_from": "cbfc7c21-af73-4844-9f42-d830480f874b",
//         "description": "Avatar is not selected",
//         "notification_id": "d918e46d-f863-4d1c-ae39-24e561463772",
//         "notification_name": "User Profile",
//         "origin_url": "",
//         "priority": "medium",
//         "read": false,
//         "starred": false,
//         "type": "error"
//     },
//     {
//         "archived": false,
//         "created_at": "2025-01-14T12:10:34.381+0000",
//         "created_by": "e58bf892-581f-4922-a890-34a15141d8c3",
//         "created_from": "cbfc7c21-af73-4844-9f42-d830480f874b",
//         "description": "Avatar is not selected",
//         "notification_id": "7234b28c-aa72-47a9-90dc-2c18cf78769f",
//         "notification_name": "User Profile",
//         "origin_url": "",
//         "priority": "medium",
//         "read": false,
//         "starred": false,
//         "type": "error"
//     },
//     {
//         "archived": false,
//         "created_at": "2025-01-15T06:30:42.788+0000",
//         "created_by": "e58bf892-581f-4922-a890-34a15141d8c3",
//         "created_from": "cbfc7c21-af73-4844-9f42-d830480f874b",
//         "description": "Avatar is not selected",
//         "notification_id": "57e103d9-ac17-427f-be67-6ebdc4f5075b",
//         "notification_name": "User Profile",
//         "origin_url": "#level1=openBaseAppPage('1718784118670')%3B%7C%7CSetting##level2=openBaseAppPage('1719471914363'%2C%20'NotificationTable'%2C%20'Account%20Settings'%2C'MLP'%2C'IkonMainContentDiv'%2C'notificationsMenu')%7C%7CNotifications",
//         "priority": "medium",
//         "read": false,
//         "starred": false,
//         "type": "error"
//     },
//     {
//         "archived": false,
//         "created_at": "2025-01-14T12:09:26.882+0000",
//         "created_by": "e58bf892-581f-4922-a890-34a15141d8c3",
//         "created_from": "cbfc7c21-af73-4844-9f42-d830480f874b",
//         "description": "Avatar is not selected",
//         "notification_id": "988b3222-bb15-4a70-8029-9b3c5ef2cc19",
//         "notification_name": "User Profile",
//         "origin_url": "",
//         "priority": "medium",
//         "read": false,
//         "starred": false,
//         "type": "error"
//     },
//     {
//         "archived": false,
//         "created_at": "2025-01-15T07:07:50.341+0000",
//         "created_by": "e58bf892-581f-4922-a890-34a15141d8c3",
//         "created_from": "cbfc7c21-af73-4844-9f42-d830480f874b",
//         "description": "Avatar is not selected",
//         "notification_id": "c0e69293-403b-4758-96f8-7c6a27ce24ee",
//         "notification_name": "User Profile",
//         "origin_url": "#level1=openBaseAppPage('1718784118670')%3B%7C%7CSetting##level2=openBaseAppPage('1719471914363'%2C%20'NotificationTable'%2C%20'Account%20Settings'%2C'MLP'%2C'IkonMainContentDiv'%2C'notificationsMenu')%7C%7CNotifications",
//         "priority": "medium",
//         "read": false,
//         "starred": false,
//         "type": "error"
//     }
// ]

export async function getNotifiactionData() {
  const profile = await getProfileData();
  const notificationInst = await getMyInstancesV2({
    processName: "Notification Data Management in Cassandra",
    predefinedFilters: { taskName: "Fetch_data" },
    projections: null,
  });
  const taskId = notificationInst?.[0]?.taskId;

  if (taskId) {
    const notificationData = await getParameterizedDataForTaskId({
      taskId: taskId,
      parameters: { user_id: profile.USER_ID },
    });
    return notificationData?.notificationsList || [];
  } else {
    return [];
  }
}

export async function updateNotifiactionData(parameters) {
  const profile = await getProfileData();
  const notificationInst = await getMyInstancesV2({
    processName: "Notification Data Management in Cassandra",
    predefinedFilters: { taskName: "Fetch_data" },
    projections: null,
  });
  const taskId = notificationInst?.[0]?.taskId;

  if (taskId) {
    const notificationData = await getParameterizedDataForTaskId({
      taskId: taskId,
      parameters: parameters,
    });
    return notificationData?.notificationsList || [];
  } else {
    return [];
  }
}
