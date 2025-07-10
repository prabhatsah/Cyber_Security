import React from 'react'
import { getProfileData } from '@/ikon/utils/actions/auth';
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import ProfileForm from './components/profile-form';



export default async function page() {
  let profileData = await getProfileData();
  try {
    const profileInstanceData = await getMyInstancesV2<any>({
      processName: "Profile",
      predefinedFilters: { taskName: "User Profile View" }
    })
    const data = profileInstanceData?.[0]?.data || {};
    profileData = { ...profileData, ...data }
  } catch (error) {
    console.error(error)
  }



  return (
    <>
      <ProfileForm profileData={profileData} />
    </>
  )
}
