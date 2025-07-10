import { getProfileData } from "@/ikon/utils/actions/auth";

export default async function getAssignmentProfileData() {
  const profileData = await getProfileData();

  return profileData;
}
