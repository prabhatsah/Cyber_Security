
import React from 'react';
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/shadcn/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shadcn/ui/dialog';
import CategoryAddSchema from './CategoryAddSchema';
import { getMyInstancesV2, invokeAction, mapProcessName, startProcessV2 } from '@/ikon/utils/api/processRuntimeService';
import RiskImpactEdit from './RiskImpact/EditImpactModal';
import CardPage from './allCardSection';
import { getProfileData } from '@/ikon/utils/actions/auth';

async function fetchMetadataRiskCategoryData(): Promise<any[]> {
  try {
    const metaDataInstance = await getMyInstancesV2<any>({
      processName: "Metadata - Risk Category",
      predefinedFilters: { taskName: "View Config" }
    });
    //return metaDataInstance.map((e: any) => e.data);
    return metaDataInstance
  } catch (error) {
    console.error("Error fetching Metadata - Risk Category data:", error);
    return [];
  }
}

async function fetchMetadataRiskImpactData(): Promise<any[]> {
  try {
    const metaDataInstance = await getMyInstancesV2<any>({
      processName: "Metadata - Risk Impact and Weightage",
      predefinedFilters: { taskName: "View Impact" }
    });
    return metaDataInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching Metadata - Risk Impact data:", error);
    return [];
  }
}

async function fetchControlObjectivesData(): Promise<any[]> {
  try {
    const controlObjInstance = await getMyInstancesV2<any>({
      processName: "Control Objectives V2",
      predefinedFilters: { taskName: "view control objecitve" }
    });
    return controlObjInstance.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching Control Objectives V2", error);
    return [];
  }
}

async function fetchTaskFrequencyData(): Promise<any[]> {
  try {
    const taskFrquencyInstance = await getMyInstancesV2<any>({
      processName: "Task Frequency",
      predefinedFilters: { taskName: "View Task Frequency" }
    });
    return taskFrquencyInstance
  } catch (error) {
    console.error("Error fetching Task Frequency", error);
    return [];
  }
}

async function fetchGlobalMetadataRiskCategoryData(): Promise<any[]> {
  try {
    const metaDataInstance = await getMyInstancesV2<any>({
      processName: "Metadata - Risk Category - Global Account",
      predefinedFilters: { taskName: "View Risk Category" },
      projections: ["Data.riskCategory"]
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




export default async function ConfiguratorPage() {

  let riskCategoryData = await fetchMetadataRiskCategoryData();
  const riskImpactData = await fetchMetadataRiskImpactData();
  const controlObjectivesData = await fetchControlObjectivesData();
  const taskFrequencyData = await fetchTaskFrequencyData();
  const profileData = await getProfileData();
  const globalRiskCategoryData = await fetchGlobalMetadataRiskCategoryData();
  const globalTaskFrequencyData = await fetchGlobalMetaTaskFrequencyData();

  const copiedRiskCategoryData = structuredClone(riskCategoryData);

  console.log("Risk Category Data:", riskCategoryData);
  console.log("globalRiskCategoryData", globalRiskCategoryData);


  let taskId = null;
  if (riskCategoryData.length != 0) {
    taskId = riskCategoryData?.[0]?.taskId;
  }

  riskCategoryData = riskCategoryData.map((e: any) => e.data);
  console.log('riskCategoryData', riskCategoryData);

  const globalRiskCategoryDataObj = globalRiskCategoryData[0] ? globalRiskCategoryData[0].riskCategory : {};
  const riskCategoryDataObj = riskCategoryData[0] ? riskCategoryData[0].riskCategory : {};


  console.log("riskCategoryDataObj", riskCategoryDataObj);
  // Get all IDs from both objects
  const globalIds = Object.keys(globalRiskCategoryDataObj);
  const localIds = Object.keys(riskCategoryDataObj);

  console.log('globalIds', globalIds);
  console.log('localIds', localIds);

  // New Data: In global but not in local
  const newData = globalIds
    .filter(id => !localIds.includes(id))
    .map(id => globalRiskCategoryDataObj[id]);

  console.log("newData", newData);

  const newDataIds = newData.map(item => item.riskCategoryId);

  // Existing Data: In both global and local
  const existingData = localIds.map(id => riskCategoryDataObj[id]);

  // All Data: newData + existingData
  const allData = [...newData, ...existingData];

  // Example usage:
  console.log("newData", newData);
  console.log("existingData", existingData);
  console.log("allData", allData);

  const dataToSaveInClientRiskCategoryClient = allData.reduce((acc, curr) => {

    if (newDataIds.includes(curr.riskCategoryId)) {
      acc[curr.riskCategoryId] = {
        riskCategoryId: curr.riskCategoryId,
        riskCategory: curr.riskCategory,
        addedOn: new Date().toISOString(),
        addedFrom: 'globalAccount', // Assuming profileData is available in the scope
      };
    } else {
      acc[curr.riskCategoryId] = curr
    }

    return acc;
  }, {} as Record<string, { riskCategoryId: string; riskCategory: string; addedOn: string; addedBy: string }>);

  console.log("dataToSaveInClientRiskCategoryClient", dataToSaveInClientRiskCategoryClient);

  const dataToSaveInClientRiskCategoryClientWithActivityLog = {
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


  console.log("taskFrequencyData", taskFrequencyData);
  console.log("globalTaskFrequencyData", globalTaskFrequencyData);
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

  // Build the object to save
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

  console.log("dataToSaveInClientTaskFrequencyClient", dataToSaveInClientTaskFrequencyClient);

  const dataToSaveInClientTaskFrequencyClientWithActivityLog = {
    taskFrequency: dataToSaveInClientTaskFrequencyClient,
    lastUpdatedBy: profileData.USER_ID,
    lastUpdatedOn: new Date().toISOString(),
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

  return (
    <CardPage
      riskCategoryData={dataToSaveInClientRiskCategoryClient ? [dataToSaveInClientRiskCategoryClient] : []}
      riskImpactData={riskImpactData || []}
      controlObjectivesData={controlObjectivesData || []}
      taskFrequencyData={dataToSaveInClientTaskFrequencyClient ? [dataToSaveInClientTaskFrequencyClient] : []}
      profileData={profileData}
    />
  );
}