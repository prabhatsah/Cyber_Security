import { getBaseSoftwareId } from "@/ikon/utils/actions/software";
import { getDataForTaskId, getMyInstancesV2, getParameterizedDataForTaskId, invokeTaskScript, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import { probleIdMapType } from "../deviceList/types";
import { componentWebsocketMap, openConnectionForViewComponent, subscribeToProcessEvents, unsubscribeProcessEvents } from "@/ikon/utils/api/sockets";
import { get } from "http";
import { v4 } from "uuid";
import { getActiveAccountId } from "@/ikon/utils/actions/account";

const ref_2006 = {
    allProbeDetailsMap: <probleIdMapType>{},
    activeProbeDetailsMap: <probleIdMapType>{},
};

export async function getAllProbesDetails() {
    const processName = 'Get All Probe Details for Current Account';
    const predefinedFilters = { "taskName": 'Dashboard Query Activity' };
    const projections = ['Data.PROBE_ID', 'Data.PROBE_NAME'];


    // @ts-expect-error: ignore this line
    const onSuccess = async function (data) {
        console.log("Inside getMyInstances Success Function.");
        //console.log('data : ', data);

        const taskId = data[0].taskId;

        // @ts-expect-error: ignore this line
        const onSuccess = function (data) {
            console.log('Inside getDataForTaskId Success Function.')
            console.log('data : ', data);

            const allProbeDetails = data.probeDetails;

            for (let i = 0, probeCount = allProbeDetails.length; i < probeCount; i++) {
                if (allProbeDetails[i].ACTIVE) {
                    ref_2006.activeProbeDetailsMap[allProbeDetails[i].PROBE_ID] = allProbeDetails[i].PROBE_NAME;
                }
                ref_2006.allProbeDetailsMap[allProbeDetails[i].PROBE_ID] = allProbeDetails[i].PROBE_NAME; 
            }

            return ref_2006;
        }

        const onFailure = function () {
            console.log(processName + ' data could not be loaded.');
        }

        try {
            //run post processing script for the mentioned task
            const resultingData = await getDataForTaskId({ taskId });

            return onSuccess(resultingData);
        }
        catch (err) {
            onFailure();
            console.error(err);
        }

    }

    const onFailure = function () {
        console.log(processName + ' could not be fetched.')
    }

    try{
       
        const baseSoftareId = await getBaseSoftwareId()
        const resultingData = await getMyInstancesV2({ processName, predefinedFilters, projections, softwareId: baseSoftareId });

        return onSuccess(resultingData);
        return onSuccess(resultingData);
    }
    catch (err) {
        onFailure();
        console.error(err);
    }

}
export async function startDryRunMetrics(
    accountId_: string,
    softwareId_: string,
    initiator: string,
    scriptType: string,
    deviceId: string,
    clientId: string,
    metricesName: string,
    metricesUid: Object,
    script: string | Object,
    isSNMPService: boolean,
    //probeId:string,
    startRunMetricsType: string,
    executionTarget: string,
    apiCredential: string,
    errorCallBack: Function,
    successCallback: Function
) {
    debugger



    getMyInstancesV2({
        processName: 'Configuration Item',
        predefinedFilters: {
            taskName: "View CI Activity",
        },
        processVariableFilters: {
            deviceId: deviceId,
            clientId: clientId
        }
    }).then((response) => {
        const deviceDetails = response[0].data
        //subscribe to process Events and get logs 
        SubscribeToGetProbeDryRunLogs(
            accountId_,
            softwareId_,
            deviceDetails.probeId,
            metricesName,
            isSNMPService,
            errorCallBack,
            successCallback

        )

        if (executionTarget === 'probeDevice')
            PostDryRunInstruction(
                initiator,
                scriptType,
                clientId,
                metricesName,
                metricesUid,
                script,
                startRunMetricsType,
                executionTarget,
                apiCredential,
                //probeId,
                isSNMPService,
                deviceDetails,
                deviceDetails.deviceCredentialID)
        else {
            switch (deviceDetails.osType) {
                case 'Windows':
                    getMyInstancesV2({
                        processName: 'Windows Credential Directory',
                        predefinedFilters: {
                            taskName: "View credential",
                        },
                        processVariableFilters: {
                            credentialId: deviceDetails.deviceCredentialID
                        }
                    }).then((res) => {
                        PostDryRunInstruction(
                            initiator,
                            scriptType,
                            clientId,
                            metricesName,
                            metricesUid,
                            script,
                            startRunMetricsType,
                            executionTarget,
                            apiCredential,
                            // probeId,
                            isSNMPService,
                            deviceDetails,
                            res[0].data)
                    })
                    break;

                case 'Ssh':
                    getMyInstancesV2({
                        processName: 'SSH Credential Directory',
                        predefinedFilters: {
                            taskName: "View credential",
                        },
                        processVariableFilters: {
                            credentialId: deviceDetails.deviceCredentialID
                        }
                    }).then((res) => {
                        PostDryRunInstruction(
                            initiator,
                            scriptType,
                            clientId,
                            metricesName,
                            metricesUid,
                            script,
                            startRunMetricsType,
                            executionTarget,
                            apiCredential,
                            probeId,
                            isSNMPService,
                            deviceDetails,
                            res[0].data)
                    })

                    break;
                default:
                    getMyInstancesV2({
                        processName: 'SNMP Community Credential Directory',
                        predefinedFilters: {
                            taskName: "View credential",
                        },
                        processVariableFilters: {
                            credentialId: deviceDetails.deviceCredentialID
                        }
                    }).then((res) => {
                        PostDryRunInstruction(
                            initiator,
                            scriptType,
                            clientId,
                            metricesName,
                            metricesUid,
                            script,
                            startRunMetricsType,
                            executionTarget,
                            apiCredential,
                            probeId,
                            isSNMPService,
                            deviceDetails,
                            res[0].data)
                    })



            }
        }

    }).catch()

}

export async function PostDryRunInstruction(
    initiator: string,
    scriptType: string,
    clientId: string,
    metricsName: string,
    metricsUid: string,
    script: string,
    startRunMetricsType: string,
    executionTarget: string,
    apiCredential: string,
    //probeId:string,
    isSnmpService: boolean,
    deviceDetails: Object,
    devicecredential: string) {
    // deviceDetails.credential = devicecredential;

    const monitoringData = {
        serviceScriptDetails: {
            scriptName: metricsName,
            script: script,

            serviceId: metricsUid,
            scriptType: scriptType,
            startRunMetricsType: startRunMetricsType,
            executionTarget: executionTarget,
        },
        apiId: apiCredential ?? '',
        deviceDetail: deviceDetails,
        probeId: deviceDetails.probeId,
        id: metricsUid,

    };


    if (isSnmpService) {
        monitoringData.serviceScriptDetails.oid = script.oid;
        monitoringData.serviceScriptDetails.filedName = script.fieldName;
    }

    monitoringData.initiatorUserId = initiator;



    mapProcessName({
        processName: 'Device Service Dry Run'
    }).then((processId_) => {
        debugger
        startProcessV2({
            processId: processId_,
            data: monitoringData,
            processIdentifierFields: 'id'
        }).then(() => {
            toast({
                title: 'Success!!',
                description: 'Dry Run Started'
            })
        }).catch((e) => {
            console.log(e)
            console.log(`failure in startProcess`)
        })
    }).catch(() => {
        console.log(`failure in mapProcess`)
    })
}

export async function SubscribeToGetProbeDryRunLogs(accountId_: string, softwareId_: string, probeId: string, serviceName: string, isSNMPService: boolean, errorCallback: Function, resultCallBack: Function) {
    //getting error logs if any
    const InterValId = setInterval(() => {
        getMyInstancesV2({
            processName: 'Get Probe Logs',
            predefinedFilters: { taskName: "Probe Log Activity" }
        }).then((response) => {
            getParameterizedDataForTaskId({
                taskId: response[0].taskId,
                parameters: { probeId: probeId, serviceName: serviceName },
            }).then((args) => {
                debugger
                if (args.errorLogs && args.errorLogs.length > 0) {
                    clearInterval(InterValId)
                    errorCallback(args.errorLogs)
                }

            })
        })
    }, 1000)
    //automatically stop the interval after 30 seconds
    setTimeout(() => {
        clearInterval(InterValId)
    }, 30000)

    //getting dry run reult 
    mapProcessName({
        processName: 'Device Service Dry Run'
    }).then(processId_ => {
        debugger

        subscribeToProcessEvents({
            viewComponentId: 'dryRunLogs',
            softwareId: softwareId_,
            accountId: accountId_,
            processId: processId_,
            eventCallbackFunction: (response) => {

                const result = response.data
                if (result && result.isValue && result.dryRunLogs.result) {
                    debugger
                    clearInterval(InterValId)
                    result.dryRunLogs.dryRunStatus === 'Success' ? clearInterval(InterValId) : 'n/a'
                    resultCallBack(Object.values(result.dryRunLogs.result)[0]) // getting result
                }

            }
        })
    })
}
export async function executePrompt(promptId: string, QueryParams: Object, callbackFn: Function) {

    getMyInstancesV2({
        processName: 'Text Parameterized OpenAI Prompt Dashboard Item',
        predefinedFilters: {
            taskName: "View Dashboard Item Activity"
        },
        mongoWhereClause: `this.Data != null && this.Data.dashboardItemId == '${promptId}'`

    }).then((response) => {
        debugger
        getParameterizedDataForTaskId({
            taskId: response[0].taskId,
            parameters: QueryParams,
        }).then((args) => {
            debugger
            callbackFn(args.queryResponse.choices[0]['message'].content)
        }).catch((err) => {
            console.log('error : ', err);
        })
    }).catch((err) => {
        console.log('error : ', err);
    })
}

export async function checkProbeInfo(probeId: string,successCallback:Function) {
    const accountId_ = await getActiveAccountId()
    getBaseSoftwareId().then((baseSoftwareId) => {
        debugger
        mapProcessName({
            processName: "SSD Connector Probe Configuration",
            softwareId: baseSoftwareId
        }).then((processId_) => {
            debugger
            getMyInstancesV2({
                processName: "SSD Connector Probe Configuration",
                predefinedFilters: {
                    taskName: "View Probe Configuration"
                },
                softwareId: baseSoftwareId,

            }).then((response) => {
                debugger
                const processInstanceId = response[0].processInstanceId;
                const taskId = response[0].taskId;
                const instructionId_ = v4()
                postOnceOnlySocketInstructionForProcessInstance(
                    accountId_,
                    baseSoftwareId || "",
                    instructionId_,
                    processId_,
                    processInstanceId,
                    response[0].taskId,
                    (data) => {
                        debugger
                        console.log('data : ', data);
                        successCallback(data.response)
                        
                        

                    },
                    (socketUid:string) => {
                        console.log('Connection Opened');
                        subscribeToProcessEvents({
                            viewComponentId:`SsdConnectorSocketInstruction_${socketUid}`,
                            accountId:accountId_,
                            softwareId:baseSoftwareId,
                            processId:processId_,
                            processInstanceId:processInstanceId,
                            eventCallbackFunction:()=>{
                                debugger
                            },

                        });
                        let parameters = {
                            action: "Test Probe",
                            actionParameters: {
                                instructionId: instructionId_,
                                probeId: probeId
                            }
                        };
                        invokeTaskScript({
                            taskId:taskId,
                            parameters:parameters,
                            
                        }
                        ).then((response) => { 
                            debugger
                            console.log('response : ', response);
                            if (response && response.data) {
                                console.log('data : ', response.data);
                            }
                        }).catch(()=>{
                            console.log("Error in invoking task script")
                        })
                    },
                    () => {
                        console.log('Connection Closed');
                    }
                )

            }).catch((err) => {
                console.log('error : ', err);
            })
        }).catch((err) => {
            console.log('error : ', err);
        })
    }).catch((err) => {

    })


}

export async function postOnceOnlySocketInstructionForProcessInstance(
    accountId: string,
    softwareId: string,
    instructionId: string,
    processId: string,
    processInstanceId: string,
    taskId: string,
    onDataReceive: Function,
    onConnectionOpen: Function,
    onConnectionClose: Function
) {
    debugger
    const socketUid = v4();
    openConnectionForViewComponent({
        viewComponentId: `SsdConnectorSocketInstruction_${socketUid}`,
        accountId: accountId,
        softwareId: softwareId,
        processId: processId,
        processInstanceId: processInstanceId,
        eventCallbackFunction: (event) => {
            debugger
            if (event.data) {
                let data = event.data;
                if (data && data.dataProcessingArguments && data.dataProcessingArguments.instructionId === instructionId) {
                    try {
                        debugger
                        if (onDataReceive) {
                            onDataReceive(data, socketUid);
                        }
                    } catch (e) {
                        console.error(e);
                    }
                    unsubscribeProcessEvents(
                        `SsdConnectorSocketInstruction_${socketUid}`,
                        accountId,
                        softwareId,
                        processId,
                        processInstanceId,
                        taskId
                    );

                    if (componentWebsocketMap[`SsdConnectorSocketInstruction_${socketUid}`]) {
                        componentWebsocketMap[`SsdConnectorSocketInstruction_${socketUid}`].close();
                    }
                }
            }
        },
        connectionOpenFunction: () => {
            debugger
            console.log('Connection Opened');
            if (onConnectionOpen) {
                onConnectionOpen(socketUid);
            }
        },
        connectionClosedFunction: () => {
            console.log('Connection Closed');
            if (onConnectionClose) {
                onConnectionClose();
            }
        }
    }).then(() => {

    }).catch((err) => {
        console.log('error : ', err);
    })

}

export function formatDateToCustomISO(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const padMs = (n: number) => n.toString().padStart(3, '0');

  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1); // months are 0-indexed
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  const millis = padMs(date.getUTCMilliseconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${millis}+0000`;
}
