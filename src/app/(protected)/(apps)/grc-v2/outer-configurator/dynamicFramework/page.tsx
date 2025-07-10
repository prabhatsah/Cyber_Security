import React from 'react';
import DynamicFrameworkContextProvider, { DynamicFieldConfigFormDataWithId } from './context/dynamicFieldFrameworkContext';
import OpenFrameworkModal from './components/openFrameworkModal';
import { getUserIdWiseUserDetailsMap } from '@/ikon/utils/actions/users';
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import DynamicFrameworkPage from './components/dynamicFrameworkPage';


type TaskEntry = {
  index: string;
  title: string;
  description: string;
  parentId: string | null;
  treatAsParent: boolean;
  id: string;
};

type ParentEntry = TaskEntry & {
  childrenArray: string[];
};

type Pricing = {
  type: 'free' | 'paid' | string; // extend as needed
};

export type Framework = {
  id: string;
  name: string;
  title: string;
  description: string;
  version: string;
  owners: string[]; // list of user IDs
  pricing: Pricing;
  entries: Record<string, string>[];
  parentEntries: ParentEntry[];
  category: string;
  score: number;
  status: 'draft' | 'published' | 'archived' | string; // extend as needed
  isFavorite: boolean;
  acronym: string;
  type: string;
  regulatoryAuthority: string;
  industry: string;
  effectiveDate: string | undefined;
  contactEmail: string;
  responsibilityMatrixExists: boolean;
  soaExists: boolean;
  activityLog: { createBy: string, createdAt: string, message: string }[];
  configureData: DynamicFieldConfigFormDataWithId[];
  identifierField: Record<string, string>;
};

export async function getUserDetailMap() {
  const allUsers = await getUserIdWiseUserDetailsMap();
  return allUsers;
}

export async function CreateUserMap() {
  const allUsers = await getUserDetailMap();
  const userIdNameMap: { value: string; label: string }[] = Object.values(allUsers)
    .map((user) => {
      if (user.userActive) {
        return {
          value: user.userId,
          label: user.userName
        };
      }
      return undefined;
    })
    .filter((user): user is { value: string; label: string } => user !== undefined);

  return userIdNameMap;
}

export async function getFrameworkDetails() {
  const frameworkProcessInstances = await getMyInstancesV2({
    processName: "Framework Processes",
    predefinedFilters: { taskName: "View Framework" }
  })
  const frameworkProcessDatas = frameworkProcessInstances.length > 0 ? frameworkProcessInstances.map((frameworkProcessInstance) => frameworkProcessInstance.data) as Framework[] : [];
  return frameworkProcessDatas;
}


export async function getFrameworkDetailsOfPublished() {
  const frameworkProcessInstances = await getMyInstancesV2({
    processName: "Framework Processes",
    predefinedFilters: { taskName: "Publish" }
  })
  const frameworkProcessDatas = frameworkProcessInstances.length > 0 ? frameworkProcessInstances.map((frameworkProcessInstance) => frameworkProcessInstance.data) as Framework[] : [];
  return frameworkProcessDatas;
}

export async function fetchFrameworkMappingData () {
  try {
    const frameworkMappingData = await getMyInstancesV2({
      processName: "Framework Mapping",
      predefinedFilters: { taskName: "Edit FrameworkMapping" },
    });
    console.log("Fetched frameworkMappingData-----", frameworkMappingData);

    // Process the data dynamically
    const frameworkMappingDataDynamic = Array.isArray(frameworkMappingData)
      ? frameworkMappingData.map((e: any) => e.data)
      : [];
    console.log("Processed frameworkMappingDataDynamic-----", frameworkMappingDataDynamic);
    return frameworkMappingDataDynamic; // Return processed data
  } catch (error) {
    console.error("Failed to fetch the process:", error);
    return []; // Return empty array in case of error
  }
};

export default async function NewFramework() {

  const allUsers = await CreateUserMap();
  const frameworkProcessDatas = await getFrameworkDetails();
  console.log(frameworkProcessDatas);
  const frameworks = [
    ...frameworkProcessDatas,
  ];

  console.log(frameworks);

  const frameworkMappingData = await fetchFrameworkMappingData(); 
  const frameworkDetailsDataOfPublished = await getFrameworkDetailsOfPublished();


  console.log("frameworkMappingData from page.tsx of dummy framework",frameworkMappingData)



  return (
    <>
      <DynamicFrameworkContextProvider>
        <div className="w-full pr-3">
          {/* <h1>New Framework</h1>
          <OpenFrameworkModal /> */}
          <DynamicFrameworkPage allUsers={allUsers} frameworks={frameworks} frameworkMappingData={frameworkMappingData} publishedFrameworkData = {frameworkDetailsDataOfPublished}/>
        </div>
      </DynamicFrameworkContextProvider>
    </>
  )
}