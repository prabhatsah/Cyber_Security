import React from 'react'
import GrcHeader from './new-components/grcHeader'
// import FrameworkContextProvider, { frameworkProps, subscribeProps } from './components/context/frameworkContext'
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import { getProfileData } from '@/ikon/utils/actions/auth';
import { getUserIdWiseUserDetailsMap } from '@/ikon/utils/actions/users';
import NewFrameworkContextProvider, { frameworkProps, subscribeProps } from './new-components/context/newFrameworkContext';

interface FilteredFrameworks {
  subscribedList: frameworkProps[];
  availableList: frameworkProps[];
}

// export const clientDetails = [
//   { id: '95254903-82c5-42da-bb0f-0f834de3cebf', name: 'Client 1' },  //Susmita
//   { id: 'a3544940-dc6a-44f1-8e59-ed0644e0b0ad', name: 'Client 2' },  //Prity
//   { id: '5b932638-29c6-4a0c-868c-11480b45abab', name: 'Client 3' },  //Antony
//   { id: 'e58bf892-581f-4922-a890-34a15141d8c3', name: 'Client 4' },  //Pritam
//   { id: '8f4707b7-5a53-416c-b127-7c7caacd538c', name: 'Client 5' }   //Ankit 
// ]

export const clientDetails = [
  { id: '4d2a1c61-464d-40b4-a168-f84d8dd2aefb', name: 'Client 1' },  //Michel
  { id: 'a6628e53-604e-46af-94a3-82bbe1e0e6c2', name: 'Client 2' },  // Craig
  { id: 'a317a0d3-ce9e-4ce0-a8c7-e35907657983', name: 'Client 3' },  // Farouk
  { id: '95254903-82c5-42da-bb0f-0f834de3cebf', name: 'Client 4' },  //Susmita
  { id: 'a3544940-dc6a-44f1-8e59-ed0644e0b0ad', name: 'Client 5' },  //Prity
  { id: '5b932638-29c6-4a0c-868c-11480b45abab', name: 'Client 6' },  //Antony
  { id: 'e58bf892-581f-4922-a890-34a15141d8c3', name: 'Client 7' },  //Pritam
  { id: '8f4707b7-5a53-416c-b127-7c7caacd538c', name: 'Client 8' },   //Ankit 
  { id: '80aeeb05-3d81-43d1-a90f-b1ee2d23efd7', name: 'Client_Test 2' },   //Test 2
  { id: '87f87cb4-ef75-4ec2-91f3-77edd32321f4', name: 'Client_Test 3' }   //Test 3
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

export default async function OpeningPage() {
  const profileData = await getProfileData();
  const allUsers = await CreateUserMap();

  return (
    <>
      <NewFrameworkContextProvider allUsers={allUsers}>
        <GrcHeader profileData={profileData.USER_ID}/>
      </NewFrameworkContextProvider>
    </>
  )
}
