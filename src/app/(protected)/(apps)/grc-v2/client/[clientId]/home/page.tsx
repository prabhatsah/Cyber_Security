import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from "@/ikon/utils/api/processRuntimeService";
import Home from "./homePage";
import { getProfileData } from "@/ikon/utils/actions/auth";

type UserRole = 'global_admin' | 'customer';

// getmyinstances v2 on client processes 

async function fetchMetadataRiskCategoryData(clientId: string): Promise<any[]> {
  try {
    const metaDataInstance = await getMyInstancesV2<any>({
      processName: "Metadata - Risk Category",
      predefinedFilters: { taskName: "View Config" },
      mongoWhereClause: `this.Data.clientId == "${clientId}"`,
    });
    //return metaDataInstance.map((e: any) => e.data);
    return metaDataInstance
  } catch (error) {
    console.error("Error fetching Metadata - Risk Category data:", error);
    return [];
  }
}

async function fetchTaskFrequencyData(clientId: string): Promise<any[]> {
  try {
    const taskFrquencyInstance = await getMyInstancesV2<any>({
      processName: "Task Frequency",
      predefinedFilters: { taskName: "View Task Frequency" },
      mongoWhereClause: `this.Data.clientId == "${clientId}"`,
    });
    return taskFrquencyInstance
  } catch (error) {
    console.error("Error fetching Task Frequency", error);
    return [];
  }
}

async function fetchMetadataDomainData(clientId: string): Promise<any[]> {
  try {
    const metaDataInstance = await getMyInstancesV2<any>({
      processName: "Metadata - Domain",
      predefinedFilters: { taskName: "View Domain" },
      mongoWhereClause: `this.Data.clientId == "${clientId}"`,
    });
    //return metaDataInstance.map((e: any) => e.data);
    return metaDataInstance
  } catch (error) {
    console.error("Error fetching Metadata - Domain data:", error);
    return [];
  }
}



// getmyinstances v2 on global processes

async function fetchGlobalMetadataRiskCategoryData(): Promise<any[]> {
  try {
    const metaDataInstance = await getMyInstancesV2<any>({
      processName: "Metadata - Risk Category - Global Account",
      predefinedFilters: { taskName: "View Risk Category" },
      projections: ["Data.riskCategory"],
    });
    return metaDataInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching Metadata - Risk Category - Global Account data:", error);
    return [];
  }
}

async function fetchGlobalMetaTaskFrequencyData(): Promise<any[]> {
  try {
    const taskFrquencyInstance = await getMyInstancesV2<any>({
      processName: "Metadata - Task Frequency - Global Account",
      predefinedFilters: { taskName: "View Frequency" },
      projections: ["Data.taskFrequency"]
    });
    return taskFrquencyInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching Task Frequency", error);
    return [];
  }
}


async function fetchGlobalMetaDomainData(): Promise<any[]> {
  try {
    const doaminInstance = await getMyInstancesV2<any>({
      processName: "Metadata - Domain - Global Account",
      predefinedFilters: { taskName: "View Domain" },
      projections: ["Data.domain"]
    });
    return doaminInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching Task Frequency", error);
    return [];
  }
}



export default async function Page({
  params,
}: {
  params: { framework: string; clientId: string };
}) {

  const { clientId } = params;
  let riskCategoryData = await fetchMetadataRiskCategoryData(clientId);
  const taskFrequencyData = await fetchTaskFrequencyData(clientId);
  const profileData = await getProfileData();
  const globalRiskCategoryData = await fetchGlobalMetadataRiskCategoryData();
  const globalTaskFrequencyData = await fetchGlobalMetaTaskFrequencyData();

  const domainData = await fetchMetadataDomainData(clientId);
  const globalDomainData = await fetchGlobalMetaDomainData();


  



  const copiedRiskCategoryData = structuredClone(riskCategoryData);

  // this one is for risk category from global to client 

  let taskId = null;
  if (riskCategoryData.length != 0) {
    taskId = riskCategoryData?.[0]?.taskId;
  }

  riskCategoryData = riskCategoryData.map((e: any) => e.data);
  const globalRiskCategoryDataObj = globalRiskCategoryData[0] ? globalRiskCategoryData[0].riskCategory : {};
  const riskCategoryDataObj = riskCategoryData[0] ? riskCategoryData[0].riskCategory : {};

  // Get all IDs from both objects
  const globalIds = Object.keys(globalRiskCategoryDataObj);
  const localIds = Object.keys(riskCategoryDataObj);

  // New Data: In global but not in local
  const newData = globalIds
    .filter(id => !localIds.includes(id))
    .map(id => globalRiskCategoryDataObj[id]);

  const newDataIds = newData.map(item => item.riskCategoryId);

  // Existing Data: In both global and local
  const existingData = localIds.map(id => riskCategoryDataObj[id]);

  // All Data: newData + existingData
  const allData = [...newData, ...existingData];

  const dataToSaveInClientRiskCategoryClient = allData.reduce((acc, curr) => {

    if (newDataIds.includes(curr.riskCategoryId)) {
      acc[curr.riskCategoryId] = {
        riskCategoryId: curr.riskCategoryId,
        riskCategory: curr.riskCategory,
        addedOn: new Date().toISOString(),
        addedFrom: 'globalAccount',
      };
    } else {
      acc[curr.riskCategoryId] = curr
    }

    return acc;
  }, {} as Record<string, { riskCategoryId: string; riskCategory: string; addedOn: string; addedBy: string }>);

  const dataToSaveInClientRiskCategoryClientWithActivityLog = {
    clientId: clientId,
    riskCategory: dataToSaveInClientRiskCategoryClient,
    lastUpdatedBy: profileData.USER_ID,
    lastUpdatedOn: new Date().toISOString(),
    activityLog: [
      {
        lastUpdatedBy: profileData.USER_ID,
        lastUpdatedOn: new Date().toISOString(),
        type: "Risk Category",
        addedIDs: Object.keys(dataToSaveInClientRiskCategoryClient)
      }
    ]
  };

  if (copiedRiskCategoryData.length === 0) {
    const processId = await mapProcessName({ processName: "Metadata - Risk Category" });
    console.log("processId", processId);
    try {
      await startProcessV2({
        processId: processId,
        data: dataToSaveInClientRiskCategoryClientWithActivityLog,
        processIdentifierFields: "",
      });
    } catch (error) {
      console.error("Error starting process:", error);
    }

  } else if (newData.length > 0) {
    try {
      const taskId = copiedRiskCategoryData?.[0]?.taskId;
      const taskData = copiedRiskCategoryData[0].data as Record<string, any>;
      const lastUpdatedBy = profileData.USER_ID;
      const lastUpdatedOn = new Date().toISOString();
      taskData.activityLog.push({
        lastUpdatedBy: lastUpdatedBy,
        lastUpdatedOn: lastUpdatedOn,
        type: "Risk Category",
        addedIDs: Object.keys(dataToSaveInClientRiskCategoryClient)
      });
      taskData.riskCategory = dataToSaveInClientRiskCategoryClient;
      taskData.lastUpdatedBy = lastUpdatedBy;
      taskData.lastUpdatedOn = lastUpdatedOn;
      console.log('updateddd data ===========>>>>')
      console.log(taskData);
      await invokeAction({
        taskId,
        data: taskData,
        transitionName: 'Update Edit Config',
        processInstanceIdentifierField: '',
      });
    } catch (error) {
      console.error("Error invoking process:", error);
    }

  } else {
    console.log("No new data to save in client risk category client");
  }

  // ---------------------- end of data saving in client risk category -----------------------

  // this one is for task frequency from global to client 

  // Prepare objects from your fetched data
  const globalTaskFrequencyDataObj = globalTaskFrequencyData[0] ? globalTaskFrequencyData[0].taskFrequency : {};
  const taskFrequencyDataObj = taskFrequencyData[0] ? taskFrequencyData[0].data.taskFrequency : {};

  // Get all IDs from both objects
  const globalTaskFrequencyIds = Object.keys(globalTaskFrequencyDataObj);
  const localTaskFrequencyIds = Object.keys(taskFrequencyDataObj);

  // New Data: In global but not in local
  const newTaskFrequencyData = globalTaskFrequencyIds
    .filter(id => !localTaskFrequencyIds.includes(id))
    .map(id => globalTaskFrequencyDataObj[id]);

  const newTaskFrequencyDataIds = newTaskFrequencyData.map(item => item.taskFrequencyId);

  // Existing Data: In both global and local
  const existingTaskFrequencyData = localTaskFrequencyIds.map(id => taskFrequencyDataObj[id]);

  // All Data: newData + existingData
  const allTaskFrequencyData = [...newTaskFrequencyData, ...existingTaskFrequencyData];

  const dataToSaveInClientTaskFrequencyClient = allTaskFrequencyData.reduce((acc, curr) => {
    if (newTaskFrequencyDataIds.includes(curr.taskFrequencyId)) {
      acc[curr.taskId] = {
        taskId: curr.taskId,
        order: curr.order,
        taskType: curr.taskType,
        addedOn: new Date().toISOString(),
        addedFrom: 'globalAccount',
      };
    } else {
      acc[curr.taskId] = curr;
    }
    return acc;
  }, {} as Record<string, { taskFrequencyId: string; taskFrequency: string; addedOn: string; addedFrom: string }>);

  const dataToSaveInClientTaskFrequencyClientWithActivityLog = {
    taskFrequency: dataToSaveInClientTaskFrequencyClient,
    lastUpdatedBy: profileData.USER_ID,
    lastUpdatedOn: new Date().toISOString(),
    clientId: clientId,
    activityLog: [
      {
        lastUpdatedBy: profileData.USER_ID,
        lastUpdatedOn: new Date().toISOString(),
        type: "Task Frequency",
        addedIDs: Object.keys(dataToSaveInClientTaskFrequencyClient)
      }
    ]
  };

  if (taskFrequencyData.length === 0) {
    const processId = await mapProcessName({ processName: "Task Frequency" });
    console.log("processId", processId);
    try {
      await startProcessV2({
        processId: processId,
        data: dataToSaveInClientTaskFrequencyClientWithActivityLog,
        processIdentifierFields: "",
      });
    } catch (error) {
      console.error("Error starting process for Task Frequency:", error);
    }
  } else if (newTaskFrequencyData.length > 0) {
    try {
      const taskId = taskFrequencyData?.[0]?.taskId;
      const taskData = taskFrequencyData[0].data as Record<string, any>;
      const lastUpdatedBy = profileData.USER_ID;
      const lastUpdatedOn = new Date().toISOString();
      taskData.activityLog.push({
        lastUpdatedBy: lastUpdatedBy,
        lastUpdatedOn: lastUpdatedOn,
        type: "Task Frequency",
        addedIDs: Object.keys(dataToSaveInClientTaskFrequencyClient)
      });
      taskData.taskFrequency = dataToSaveInClientTaskFrequencyClient;
      taskData.lastUpdatedBy = lastUpdatedBy;
      taskData.lastUpdatedOn = lastUpdatedOn;
      taskData.clientId = clientId;
      console.log('updateddd task frequency data ===========>>>>');
      console.log(taskData);
      await invokeAction({
        taskId,
        data: taskData,
        transitionName: 'Update Edit Task Frequency',
        processInstanceIdentifierField: '',
      });
    } catch (error) {
      console.error("Error invoking process for Task Frequency:", error);
    }
  } else {
    console.log("No new data to save in client task frequency client");
  }

  // --------------------------this is end for task frequency client data invokation ----------------------------






  // this one is for domain from global to client

  // Prepare objects from your fetched data
  const globalDomainDataObj = globalDomainData.length > 0 && globalDomainData[0]?.domain ? globalDomainData[0].domain : {};
  const domainDataObj = domainData.length > 0 && domainData[0]?.data?.domain ? domainData[0].data.domain : {};

  // Get all IDs from both objects
  const globalDomainIds = Object.keys(globalDomainDataObj);
  const localDomainIds = Object.keys(domainDataObj);

  // New Data: In global but not in local
  const newDomainData = globalDomainIds
    .filter(id => !localDomainIds.includes(id))
    .map(id => globalDomainDataObj[id]);

  const newDomainDataIds = newDomainData.map(item => item.domainId);

  // Existing Data: In both global and local
  const existingDomainData = localDomainIds.map(id => domainDataObj[id]);

  // All Data: newData + existingData
  const allDomainData = [...newDomainData, ...existingDomainData];

  const dataToSaveInClientDomainClient = allDomainData.reduce((acc, curr) => {
    if (newDomainDataIds.includes(curr.domainId)) {
      acc[curr.domainId] = {
        domainId: curr.domainId,
        domain: curr.domain,
        addedOn: new Date().toISOString(),
        addedFrom: 'globalAccount',
      };
    } else {
      acc[curr.domainId] = curr;
    }
    return acc;
  }, {} as Record<string, { domainId: string; domain: string; addedOn: string; addedFrom: string }>);

  const dataToSaveInClientDomainClientWithActivityLog = {
    domain: dataToSaveInClientDomainClient,
    lastUpdatedBy: profileData.USER_ID,
    lastUpdatedOn: new Date().toISOString(),
    clientId: clientId,
    activityLog: [
      {
        lastUpdatedBy: profileData.USER_ID,
        lastUpdatedOn: new Date().toISOString(),
        type: "Domain",
        addedIDs: Object.keys(dataToSaveInClientDomainClient)
      }
    ]
  };

  if (domainData.length === 0) {
    const processId = await mapProcessName({ processName: "Metadata - Domain" });
    console.log("processId", processId);
    try {
      await startProcessV2({
        processId: processId,
        data: dataToSaveInClientDomainClientWithActivityLog,
        processIdentifierFields: "",
      });
    } catch (error) {
      console.error("Error starting process for Domain:", error);
    }
  } else if (newDomainData.length > 0) {
    try {
      const taskId = domainData?.[0]?.taskId;
      const taskData = domainData[0].data as Record<string, any>;
      const lastUpdatedBy = profileData.USER_ID;
      const lastUpdatedOn = new Date().toISOString();
      if (!Array.isArray(taskData.activityLog)) {
        taskData.activityLog = [];
      }
      taskData.activityLog.push({
        lastUpdatedBy: lastUpdatedBy,
        lastUpdatedOn: lastUpdatedOn,
        type: "Domain",
        addedIDs: Object.keys(dataToSaveInClientDomainClient)
      });
      taskData.domain = dataToSaveInClientDomainClient;
      taskData.lastUpdatedBy = lastUpdatedBy;
      taskData.lastUpdatedOn = lastUpdatedOn;
      taskData.clientId = clientId;
      console.log('updated domain data ===========>>>>');
      console.log(taskData);
      await invokeAction({
        taskId,
        data: taskData,
        transitionName: 'update edit domain',
        processInstanceIdentifierField: '',
      });
    } catch (error) {
      console.error("Error invoking process for Domain:", error);
    }
  } else {
    console.log("No new data to save in client domain client");
  }


  // --------------------------this is end for domain client data invokation ----------------------------


  const userRole: UserRole = 'customer'; // or 'global_admin'

  return <Home userRole={userRole} />;
}