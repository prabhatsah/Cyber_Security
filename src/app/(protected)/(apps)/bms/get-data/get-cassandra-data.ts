import {
  getMyInstancesV2,
  getParameterizedDataForTaskId,
  mapProcessName,
} from "@/ikon/utils/api/processRuntimeService";
import { subscribeToProcessEvents } from "@/ikon/utils/api/sockets";

interface ParamType {
  limit?: number | null;
  service_name?: string | null;
  serviceNameList?: string[] | null;
  startDate?: string | null;
  endDate?: string | null;
  timePeriod?: number | null;
  dataCount?: number | null;
}

export async function getData(param: ParamType) {
  const data = await getMyInstancesV2({
    processName: "Test Dynamic Monitoring  Bacnet Live Service Dashboard",
    predefinedFilters: {
      taskName: "View Dashboard Item Activity",
    },
  });
  const taskId = data[0].taskId;

  const parameters: any = {
    limit: param.dataCount ? param.dataCount : null,
    service_name: param.service_name ? param.service_name : null,
    serviceNameList: param.serviceNameList ? param.serviceNameList : null,
    startDate: param.startDate ? param.startDate : null,
    endDate: param.endDate ? param.endDate : null,
    timePeriod: param.timePeriod ? param.timePeriod : null, //in seconds
  };

  const dataForTaskId: { queryResponse?: any } =
    await getParameterizedDataForTaskId({
      taskId,
      parameters,
    });

  return dataForTaskId.queryResponse ? dataForTaskId.queryResponse : [];
}

export async function getLiveData(callback: any) {
  // for deos in dev
  // let accountId = '56b5c266-6a0f-437a-82b9-3715bb6f3d4c';

  // for deos in uat
  const processId = await mapProcessName({
    // processName: "live Device Service Dry Run",
    processName: "bacnet objects Device Service Dry Run",
  });
  console.log(processId);
  const instance = await getMyInstancesV2({
    processName: "bacnet objects Device Service Dry Run",


  });
  console.log("getLiveData instance");
  console.log(instance);
  const processInstanceId = instance[0].processInstanceId;
  const socket = await subscribeToProcessEvents({
    processId: processId,
    processInstanceId: processInstanceId,
    viewComponentId: "componenetId",
    eventCallbackFunction: (event: any) => {
      callback(event);
    },
  });
  return socket;

}




export async function getLatestLiveBacnetDataTest(param: ParamType, callback: any) {
  const data = await getMyInstancesV2({
    processName: "Test Dynamic Monitoring  Bacnet Live Service Dashboard",
    predefinedFilters: {
      taskName: "View Dashboard Item Activity",
    }
  })
  const taskId = data[0].taskId;
  const parameters: any = {
    limit: param.dataCount ? param.dataCount : null,
    service_name: param.service_name ? param.service_name : null,
    serviceNameList: param.serviceNameList ? param.serviceNameList : null,
    startDate: param.startDate ? param.startDate : null,
    endDate: param.endDate ? param.endDate : null,
    timePeriod: param.timePeriod ? param.timePeriod : null, //in seconds
  };
  const dataForTaskId: { queryResponse?: any } =
    await getParameterizedDataForTaskId({
      taskId,
      parameters,
    });
  if (callback) {
    callback(dataForTaskId.queryResponse);
  } else {
    return dataForTaskId ? dataForTaskId : [];
  }

}


export async function getLatestAIAnalysis(params: { data: any; type: string }) {
  const data = await getMyInstancesV2({
    processName: "AI Monitoring  Live Service Dashboard",
    predefinedFilters: {
      taskName: "View Dashboard Item Activity",
    }
  });
  const taskId = data[0].taskId;
  
  const parameters: any = {
    "data" : JSON.stringify(params.data)
  };
  const dataForTaskId: { queryResponse?: any } =
    await getParameterizedDataForTaskId({
      taskId,
      parameters,
    });
  return dataForTaskId.queryResponse ? dataForTaskId.queryResponse : [];
}

export async function getDynamicMonitoringData(param: ParamType, callback?: any) {
  try {
    const data = await getMyInstancesV2({
      processName: "Bacnet Dynamic Monitoring  Live Service Dashboard",
      predefinedFilters: {
        taskName: "View Dashboard Item Activity",
      },
    });

    const taskId = data[0].taskId;

    const parameters: any = {
      limit: param ?.dataCount ? param.dataCount : null,
    };

    const dataForTaskId: { queryResponse?: any } =
      await getParameterizedDataForTaskId({
        taskId,
        parameters,
      });

    const list = dataForTaskId.queryResponse ? dataForTaskId.queryResponse : [];

    if (callback) {
      callback(list);
    } else {
      console.log("list", list);
      return list;
    }
  } catch (error) {
    console.error("Error fetching dynamic monitoring data:", error);
    throw error;
  }
}







