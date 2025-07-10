import { getMyInstancesV2, getParameterizedDataForTaskId, getDataForTaskId, invokeAction } from "@/ikon/utils/api/processRuntimeService";
import { mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getProfileData } from "@/ikon/utils/actions/auth";
import { v4 } from "uuid";
import { toast } from "sonner";
import { getAllSubscribedSoftwaresForClient } from "@/ikon/utils/api/softwareService";

export const getAlertNotificationData = async () => {

    const processName = "Alert Rule";
    const predefinedFilters = { "taskName": "View Alert" };
    const projections = ["Data.id", "Data.clientId", "Data.notification_name", "Data.finalBreachCount", "Data.device_service_association", "Data.lastStateChangeTime", "Data.state", "Data.description", "Data.description", "Data.createdOn", "Data.lastEvaluatedOn", "Data.isAcknowledged", "Data.isNotificationDisabled", "Data.isMute", "Data.muteStartDate", "Data.muteEndDate", "Data.health", "Data.associatedCommandId"];
    const alertNotificationData: any = await getMyInstancesV2({
        processName,
        predefinedFilters,
        projections
    });
    return alertNotificationData;
}

export const getDetailsForDropdowns = async () => {
    let deviceIdWiseDetails = {};
    let serviceIdWiseDetails = {};
    const processName = "Configuration Item";
    const predefinedFilters = { "taskName": "View CI Activity" };
    const projections = ["Data"];
    const args: any = await getMyInstancesV2({
        processName,
        predefinedFilters,
        projections
    });
    deviceIdWiseDetails = args.reduce((accumulator: any, ele: any) => {
        accumulator[ele.data.deviceId] = ele.data;
        return accumulator;
    }, {});

    await getCatalogDetails(null, (args: any) => {
        serviceIdWiseDetails = args.reduce((accumulator: any, ele: any) => {
            accumulator[ele.data.serviceId] = ele.data;
            return accumulator;
        }, {});

        // resolve("Successfully data found");

    }, () => {
        // reject("Data not recieved Successfully");
    })
    return { deviceIdWiseDetails, serviceIdWiseDetails };
}

const getCatalogDetails = async (params: any, successCallb: any, failureCallb: any) => {

    const requiredParams = params ? params : null;
    const processName = "Catalog Wrapper";
    const predefinedFilters = { "taskName": "Catalog Wrapper" };
    const projections = ["Data"];
    const args: any = await getMyInstancesV2({
        processName,
        predefinedFilters,
        projections
    });
    try {
        const tasId = args[0].taskId;
        const data: any = await getParameterizedDataForTaskId({
            taskId: tasId,
            parameters: requiredParams
        });
        const catalogList = data?.catalogList ? data.catalogList : [];
        if (successCallb) {
            successCallb(catalogList);
        }
    }
    catch (error) {
        const data = await getParameterizedDataForTaskId({
            taskId: args[0].taskId,
            parameters: requiredParams
        })
        if (failureCallb) {
            failureCallb();
        }
    }
}

export const selectDeviceChange = async (deviceIp: string, deviceIdWiseDetails: any[]) => {


    const deviceId = Object.values(deviceIdWiseDetails).find(e => e.hostIp == deviceIp)?.deviceId;;
    const accountId = await getActiveAccountId();
    if (deviceId) {
        const processName = "Device-Service Association";
        const predefinedFilters = { "taskName": "View association details" };
        const processVariableFilters = { "clientId": accountId, "deviceId": deviceId };
        const projections = ["Data"];
        const deviceIdWiseServices: any = await getMyInstancesV2({
            processName,
            predefinedFilters,
            processVariableFilters,
            projections
        });
        const serviceList = (deviceIdWiseServices as { data: { serviceId: string } }[]).map(key => key.data.serviceId);
        return serviceList;
    }
}
export const notificationInstanceSubmit = async (data: any, expData: any[], conditionExpData: any[]) => {
    let extractionObj = await getDataForExtraction(data, expData, conditionExpData);
    console.log("extractionObj", extractionObj);

    const processId = await mapProcessName({ processName: "Alert Rule" });
    await startProcessV2({
        processId,
        data: extractionObj,
        processIdentifierFields: "id,clientId,notification_name,threshold_breach_count,frequency_of_occurence",
    });
    toast.success("Notification Created Successfully", {
        description: "Notification Created Successfully",
        duration: 2000,
    })
}
export const editNotificationInstanceSubmit = async (data: any, expData: any[], conditionExpData: any[]) => {
    let extractionObj = await getDataForExtraction(data, expData, conditionExpData);
    console.log("extractionObj", extractionObj);

    const alertData = await getMyInstancesV2({
        processName: "Alert Rule",
        predefinedFilters: {
            taskName: "Edit Alert",
        },
        processVariableFilters: {
            "id": data.id,
        },
    });
    const taskId = alertData[0].taskId;
    // console.log(alertData[0].data)
    await invokeAction({
        taskId: taskId,
        transitionName: "Update Edit Alert",
        data: extractionObj,
        processInstanceIdentifierField: "id,clientId,notification_name,threshold_breach_count,frequency_of_occurence",
    });
    toast.success("Notification Edited Successfully", {
        description: "Notification Edited Successfully",
        duration: 2000,
    })
}

const getDataForExtraction = async function (data: any, expData: any[], conditionExpData: any[]) {
    const profileData = await getProfileData();
    const userId = profileData.USER_ID;
    let exprList: { [key: string]: any } = getExprList(expData);
    let conditionExpObj: { [key: string]: any } = getConditionExpObj(conditionExpData);
    let arr = [];
    let extractionObj = {};

    // if(ref.isEdit){
    //     ref.extractionObj = JSON.parse(JSON.stringify(ref.extractObj));
    //     var obj = ref.extractionObj;
    //     let str = $(".notification-alert.selected").attr("id").split("setCondition_")[1];
    //     if(str.localeCompare(ref.extractObj['finalReviewCondition']) || JSON.stringify(ref.exprList).localeCompare(JSON.stringify(ref.extractObj['data_Exp'])) || JSON.stringify(ref.conditionExpObj).localeCompare(JSON.stringify(ref.extractObj['condition_Gen']))){
    //         obj["expressionAndConditionEvaluationCount"] = {};

    //         if(!obj["expressionConditionHistory"]){
    //             obj["expressionConditionHistory"] = [];
    //         }

    //         obj["expressionConditionHistory"].push({
    //             "finalReviewCondition" : ref.extractObj['finalReviewCondition'],
    //             "data_Exp" : ref.extractObj['data_Exp'],
    //             "condition_Gen" : ref.extractObj['condition_Gen'],
    //             "data_received_on" : new Date()
    //         })

    //     }

    //     //for undoing Acknowledged Notification
    //     if(ref.extractObj['isAcknowledged']){
    //         obj["isAcknowledged"] =  false;	
    //         obj["invokeReason"] = "isUnacknowledged";
    //         obj["unacknowledge_details"] = {};
    //         obj["unacknowledge_details"]["acknowledgeRemarks"] = "Notification Configuration Changed";
    //         obj["unacknowledge_details"]["acknowledgdeBy"] = Globals.profile.value.USER_ID.value;
    //         obj["unacknowledge_details"]["acknowledgedByName"] = Globals.profile.value.USER_NAME.value;
    //         obj["unacknowledge_details"]["acknowledgedOn"] = new Date();
    //     }


    // }
    // else{
    let obj: any = extractionObj;
    obj["id"] = data.id;
    obj["clientId"] = await getActiveAccountId();
    obj["health"] = "ok";
    obj["state"] = "normal";
    obj["lastStateChangeTime"] = [];
    obj["createdOn"] = new Date();
    obj["createdBy"] = userId;
    // }


    //Added to execute command catalog
    if (data.commandActionType == "commandActionYes") {
        let commandAndCredentialData = await fetchCommandCatalogData();
        let commandCatalogData = commandAndCredentialData.commandCatalogData;
        let commandIdWiseCommandDetails: any = new Object();
        for (let i = 0; i < commandCatalogData.length; i++) {
            let commandId = commandCatalogData[i].commandId;
            let commandDetails = commandCatalogData[i];
            if (commandIdWiseCommandDetails[commandId] != undefined) {
                commandIdWiseCommandDetails[commandId] = commandDetails;
            } else {
                commandIdWiseCommandDetails[commandId] = new Object();
                commandIdWiseCommandDetails[commandId] = commandDetails;
            }
        }
        let apiIdWiseAPICredentialsDetails: any = new Object();
        let credentialDirectoryMongodata = commandAndCredentialData.credentialDirectoryMongodata;
        for (let j = 0; j < credentialDirectoryMongodata.length; j++) {
            let credentialId = credentialDirectoryMongodata[j].credentialId;
            let crdentialDetails = credentialDirectoryMongodata[j];
            if (apiIdWiseAPICredentialsDetails[credentialId] != undefined) {
                apiIdWiseAPICredentialsDetails[credentialId] = crdentialDetails;
            } else {
                apiIdWiseAPICredentialsDetails[credentialId] = new Object();
                apiIdWiseAPICredentialsDetails[credentialId] = crdentialDetails;
            }
        }
        obj["associatedCommandId"] = data.associatedCommandId ? data.associatedCommandId : "";
        obj["selectedCommandDetails"] = commandIdWiseCommandDetails[data.associatedCommandId] ? commandIdWiseCommandDetails[data.associatedCommandId] : {};
        let tokensNecessary = commandIdWiseCommandDetails[data.associatedCommandId].tokensNecessary;
        if (tokensNecessary) {
            obj["apiId"] = data.apiId ? data.apiId : "";
            obj["selectedAPIDetails"] = apiIdWiseAPICredentialsDetails[data.apiId] ? apiIdWiseAPICredentialsDetails[data.apiId] : {};
        }
    }


    //End to execute command from CCC	

    obj["notification_name"] = data.notification_name;

    obj["threshold_breach_count"] = data.threshold_breach_count;
    obj["frequency_of_occurence"] = data.frequency_of_occurence;
    obj["notification_evaluation_interval"] = data.notification_evaluation_interval;
    obj["invokeReason"] = "configure notification interval";
    obj["description"] = data.description;
    obj["data_Exp"] = exprList;
    // obj["finalReviewCondition"] = $(".notification-alert.selected").attr("id").split("setCondition_")[1];
    obj["finalReviewCondition"] = conditionExpData[0].id;



    for (var key in exprList) {
        arr.push(exprList[key].device + '_' + exprList[key].service);
    }

    obj["device_service_association"] = arr;

    obj["condition_Gen"] = conditionExpObj;

    obj["alertActionType"] = data.alertActionType;

    //Alert action part re-written
    let alertActionType = data.alertActionType;
    if (alertActionType == "radioEmail" || alertActionType == "radioBoth") {
        obj["email_details"] = {};
        obj["email_details"]["subject"] = data.alertSubject;
        obj["email_details"]["recieptGrp"] = data.recipientGroup;

        obj["email_details"]["userNames"] = data.userSelected;;
        obj["email_details"]["externalAddress"] = data.alertAddress;
        obj["email_details"]["content"] = data.alertEmailBody;
    }

    // if (alertActionType == "radioTicket" || alertActionType == "radioBoth") {
    //     obj["ticket_details"] = {};
    //     obj["ticket_details"]["subject"] = $("#alertTicketSubject").val();
    //     obj["ticket_details"]["supportMessage"] = $("#alertTicketBody").val();
    //     obj["ticket_details"]["companyId"] = Globals.GlobalAPI.PreLoader1681900077296.globalSelectedClientId;
    //     obj["ticket_details"]["companyName"] = Globals.GlobalAPI.PreLoader1681900077296.globalClientIdDetailObj[Globals.GlobalAPI.PreLoader1681900077296.globalSelectedClientId].clientName;
    //     obj["ticket_details"]["application"] = "Ticket generated notification";
    //     obj["ticket_details"]["priority"] = "Critical";
    //     obj["ticket_details"]["type"] = "incident";
    //     obj["ticket_details"]["status"] = "New";
    //     obj["ticket_details"]["requestedFrom"] = url.href;
    // }

    // if (alertActionType == "radioBoth") {
    //     obj["email_details"]["emailThresholdCount"] = $("#emailThresholdCount").val();
    //     obj["ticket_details"]["ticketThresholdCount"] = $("#ticketThresholdCount").val();
    // }
    return obj;
}
const getExprList = (expData: any[]) => {
    let exprList: { [key: string]: object } = {};
    for (let i = 0; i < expData.length; i++) {
        let id = expData[i].id;
        exprList[id] = {
            "device": expData[i].device,
            "service": expData[i].service,
            "expName": expData[i].expName,
            "expType": expData[i].expType,
            "operand": expData[i].operand,
            "id": expData[i].id,
            "serviceProperty": expData[i].serviceProperty,
            "subService": expData[i].subService,
            "value": expData[i].value,
        }
    }
    return exprList;
}
const getConditionExpObj = (conditionExpData: any[]) => {
    let exprList: { [key: string]: object } = {};
    for (let i = 0; i < conditionExpData.length; i++) {
        let id = conditionExpData[i].id;
        exprList[id] = {
            "conditionName": conditionExpData[i].conditionName,
            "conditionOperand1": conditionExpData[i].conditionOperand1,
            "conditionOperand2": conditionExpData[i].conditionOperand2,
            "conditionOperator": conditionExpData[i].conditionOperator,
            "id": conditionExpData[i].id,
            "order": conditionExpData[i].order,
            "thresholdCountAlertOperand1": conditionExpData[i].thresholdCountAlertOperand1,
            "thresholdCountAlertOperand2": conditionExpData[i].thresholdCountAlertOperand2,
        }
    }
    return exprList;
}

export const getDataForCreateNotification = async function (notificationId: string) {

    const processName = "Alert Rule";
    const predefinedFilters = { "taskName": "Edit Alert" };
    const processVariableFilters = { "id": notificationId };
    const projections = ["Data"];
    const data: any = await getMyInstancesV2({
        processName,
        predefinedFilters,
        processVariableFilters,
        projections
    });
    console.log("data", data);
    return data[0].data;
}

export const getFilterData = function (data: any) {
    let filterData: any = {
        "id": data?.id,
        "associatedCommandId": data?.associatedCommandId,
        "apiId": data?.apiId,
        "notification_name": data.notification_name,
        "threshold_breach_count": data.threshold_breach_count,
        "frequency_of_occurence": data.frequency_of_occurence,
        "notification_evaluation_interval": data.notification_evaluation_interval,
        "description": data.description,
        "alertActionType": data.alertActionType,
        "commandActionType": data.commandActionType,
        "alertSubject": data.email_details.subject,
        "alertAddress": data.email_details.externalAddress,
        "alertEmailBody": data.email_details.content,
        "userSelected": data.email_details.userNames,
        "recipientGroup": data.email_details.recieptGrp,
    }
    return filterData;
}
export async function SubscribedSoftwareNameMap() {
    const accountId = await getActiveAccountId();
    return getAllSubscribedSoftwaresForClient({ accountId }) || []; // Ensure it's always an array
}
export const fetchCommandCatalogData = async function () {

    const processName = "Get Commands Data from CCC";
    const params: any = await getMyInstancesV2({
        processName,
    });
    let taskId = params[0].taskId;
    const commandAndCredentialData: any = await getDataForTaskId({ taskId });
    // let commandCatalogData = commandAndCredentialData.commandCatalogData;
    // let credentialDirectoryMongodata = commandAndCredentialData.credentialDirectoryMongodata;
    // let val = getCommandData(commandCatalogData, credentialDirectoryMongodata);
    return commandAndCredentialData;
}

export const getCommandData = function (commandCatalogData: any[], credentialDirectoryMongodata: any[]) {
    let commandIdWiseCommandDetails: any = new Object();
    for (let i = 0; i < commandCatalogData.length; i++) {
        let commandId = commandCatalogData[i].commandId;
        let commandDetails = commandCatalogData[i];
        if (commandIdWiseCommandDetails[commandId] != undefined) {
            commandIdWiseCommandDetails[commandId] = commandDetails;
        } else {
            commandIdWiseCommandDetails[commandId] = new Object();
            commandIdWiseCommandDetails[commandId] = commandDetails;
        }
    }


    let apiIdWiseAPICredentialsDetails: any = new Object();
    for (let j = 0; j < credentialDirectoryMongodata.length; j++) {
        let credentialId = credentialDirectoryMongodata[j].credentialId;
        let crdentialDetails = credentialDirectoryMongodata[j];
        if (apiIdWiseAPICredentialsDetails[credentialId] != undefined) {
            apiIdWiseAPICredentialsDetails[credentialId] = crdentialDetails;
        } else {
            apiIdWiseAPICredentialsDetails[credentialId] = new Object();
            apiIdWiseAPICredentialsDetails[credentialId] = crdentialDetails;
        }
    }
    let commandCatalogConfig: any[] = new Array();
    for (var i = 0; i < commandCatalogData.length; i++) {
        // $("#commandCatalog").append("<option value ='"+ commandCatalogData[i].commandId +"'>" + commandCatalogData[i].commandName + "</option>");
        commandCatalogConfig.push({ label: commandCatalogData[i].commandName, value: commandCatalogData[i].commandId });
    }
    return commandCatalogConfig;
    // setAPICredential();	
}

export const setAPICredential = function (selectedCommandId: string, commandCatalogData: any[], credentialDirectoryMongodata: any[]) {
    let commandIdWiseCommandDetails: any = new Object();
    let apiCredentialConfig: any[] = new Array();
    for (let i = 0; i < commandCatalogData.length; i++) {
        let commandId = commandCatalogData[i].commandId;
        let commandDetails = commandCatalogData[i];
        if (commandIdWiseCommandDetails[commandId] != undefined) {
            commandIdWiseCommandDetails[commandId] = commandDetails;
        } else {
            commandIdWiseCommandDetails[commandId] = new Object();
            commandIdWiseCommandDetails[commandId] = commandDetails;
        }
    }
    let tokensNecessary = commandIdWiseCommandDetails[selectedCommandId].tokensNecessary;
    //let filteredDataForAPI = ref.credentialDirectoryMongodata.filter(e=>e.associatedMetrics.includes(selectedCommandId)) ;
    let filteredDataForAPI = credentialDirectoryMongodata.filter(e => Array.isArray(e.associatedMetrics) && e.associatedMetrics.includes(selectedCommandId));
    if (tokensNecessary) {
        if (filteredDataForAPI.length != 0) {
            for (var i = 0; i < filteredDataForAPI.length; i++) {
                // $("#apiCredential").append("<option value ='" + filteredDataForAPI[i].credentialId + "'>" + filteredDataForAPI[i].credentialName + "</option>");
                apiCredentialConfig.push({ label: filteredDataForAPI[i].credentialName, value: filteredDataForAPI[i].credentialId });
            }
        }
    }
    return apiCredentialConfig;
}

