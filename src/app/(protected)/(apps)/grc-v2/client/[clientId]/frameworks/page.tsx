import React from 'react'
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import { getProfileData } from '@/ikon/utils/actions/auth';
import { getUserIdWiseUserDetailsMap } from '@/ikon/utils/actions/users';
import CustomerDashboard from './CustomerDashboard';
import NewFrameworkContextProvider, { frameworkProps, subscribeProps } from '../../../(openingPage)/new-components/context/newFrameworkContext';

interface FilteredFrameworks {
  subscribedList: frameworkProps[];
  availableList: frameworkProps[];
}

export const clientDetails = [
  { id: '95254903-82c5-42da-bb0f-0f834de3cebf', name: 'Client 1' },  //Susmita
  { id: 'a3544940-dc6a-44f1-8e59-ed0644e0b0ad', name: 'Client 2' },  //Prity
  { id: '5b932638-29c6-4a0c-868c-11480b45abab', name: 'Client 3' },  //Antony
  { id: 'e58bf892-581f-4922-a890-34a15141d8c3', name: 'Client 4' },  //Pritam
  { id: '8f4707b7-5a53-416c-b127-7c7caacd538c', name: 'Client 5' }   //Ankit 
]

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

export async function frameworkData() {
  const status = "published";
  try {
    const frameworkInsData = await getMyInstancesV2<any>({
      processName: "Framework Processes",
      predefinedFilters: { taskName: "Publish" },
      mongoWhereClause: `this.Data.status == "${status}"`,
      projections: ["Data.title", "Data.score", "Data.id", "Data.description"]
    });
    const frameworkData = Array.isArray(frameworkInsData) ? frameworkInsData.map((e: any) => e.data) : [];
    return frameworkData;
  } catch (error) {
    console.error("Failed to fetch the process:", error);
    throw error;
  }
};

export async function subscribeFrameworkData() {
  try {
    const subsFrameworkInsData = await getMyInstancesV2<any>({
      processName: "Subscribed Frameworks",
      predefinedFilters: { taskName: "View Subscription" },
      projections: ["Data.frameworkId", "Data.clientId"]
    });
    const subsFrameworkData = Array.isArray(subsFrameworkInsData) ? subsFrameworkInsData.map((e: any) => e.data) : [];
    return subsFrameworkData;
  } catch (error) {
    console.error("Failed to fetch the process:", error);
    throw error;
  }
};

export function filterFrameworksForClient(userId: string, allFrameworks: frameworkProps[], allSubscriptions: subscribeProps[]): FilteredFrameworks {

  // 1. Find all framework IDs subscribed to by the specific userId
  const subscribedFrameworkIdsForUser = new Set(
    allSubscriptions
      .filter(sub => sub.clientId === userId)
      .map(sub => sub.frameworkId)
  );

  // console.log(`Filtering for User ID: ${userId}`);
  // console.log(`This user has subscribed to ${subscribedFrameworkIdsForUser.size} frameworks.`);

  // 2. Separate the master framework list based on the user's subscriptions
  const subscribedList = allFrameworks.filter(fw =>subscribedFrameworkIdsForUser.has(fw.id || ''));
  const availableList = allFrameworks.filter(fw =>!subscribedFrameworkIdsForUser.has(fw.id || ''));

  return { subscribedList, availableList };
}


export async function fetchAssetsData(userId:string): Promise<any[]> {
  try {
    const findInsData = await getMyInstancesV2<any>({
      processName: "Assets",
      predefinedFilters: { taskName: "View Asset" },
      mongoWhereClause: `this.Data.clientId == "${userId}"`,
    });
    return findInsData.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching risk library data:", error);
    return [];
  }
}

export default async function Frameworks({ params }: { params: { clientId: string } }) {
  const frameworksData = await frameworkData();
  const subscribesData = await subscribeFrameworkData();
  const profileData = await getProfileData();

  const userId = profileData.USER_ID;
  const { subscribedList, availableList } = filterFrameworksForClient(params.clientId, frameworksData, subscribesData);
  const allUsers = await CreateUserMap();


  const assetsData = await fetchAssetsData(userId);

  return (
    <>
      <NewFrameworkContextProvider allUsers={allUsers}>
        <CustomerDashboard clientId={params.clientId} availableList={availableList} subscribedList={subscribedList} assetsData={assetsData} allUsers={allUsers} profileData={profileData.USER_ID}/>
      </NewFrameworkContextProvider>
    </>
  )
}