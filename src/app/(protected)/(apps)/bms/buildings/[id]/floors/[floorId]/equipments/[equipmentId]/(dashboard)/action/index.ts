import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";

export const getAlertData = async () => {
    console.log("Fetching alert data...");
    let processName = "Alert Rule";
    let predefinedFilters = { "taskName": "View Alert" };
    // let processVariableFilters = { "clientId": commonPreloader.globalSelectedClientId };
    let processVariableFilters = { "clientId": undefined };
    let projections = ["Data.id", "Data.clientId", "Data.notification_name", "Data.finalBreachCount", "Data.device_service_association", "Data.lastStateChangeTime", "Data.state", "Data.description", "Data.description", "Data.createdOn", "Data.lastEvaluatedOn", "Data.isAcknowledged", "Data.isNotificationDisabled", "Data.isMute", "Data.muteStartDate", "Data.muteEndDate", "Data.health", "Data.associatedCommandId"];
    //let projections = ["Data"];

    // for deos in dev
    // let accountId = '56b5c266-6a0f-437a-82b9-3715bb6f3d4c';

    // for deos in uat
    const alertData = await getMyInstancesV2({
        processName,
        projections,
        predefinedFilters
    });
    // console.log("Alert data fetched:", alertData);
    return alertData;
}