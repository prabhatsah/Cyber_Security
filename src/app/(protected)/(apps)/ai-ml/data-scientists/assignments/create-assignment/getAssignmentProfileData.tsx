import { getProfileData } from "@/ikon/utils/actions/auth";
import { profile } from "console";

export default async function getAssignmentProfileData() {
  const profileData = await getProfileData();

  return profileData;
}
