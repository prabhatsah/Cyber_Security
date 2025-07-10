// utils/fetchUserData.ts
import { getProfileData } from "@/ikon/utils/actions/auth";
import { getUsersByGroupName } from "@/ikon/utils/actions/users";

interface User {
  userId: string;
  userName: string | null; // userName can be null or undefined
}

interface UserGroup {
  [key: string]: User;
}

interface ProfileData {
  USER_ID: string;
  USER_NAME: string;
  USER_LOGIN: string;
  USER_EMAIL: string;
}

export const fetchProfileData = async (): Promise<ProfileData> => {
  const data = await getProfileData();
  return {
    USER_ID: data.USER_ID,
    USER_NAME: data.USER_NAME,
    USER_LOGIN: data.USER_LOGIN,
    USER_EMAIL: data.USER_EMAIL,
  };
};

export const fetchUsersByGroup = async (
  groupName: string
): Promise<{ value: string; label: string }[]> => {
  const data = await getUsersByGroupName(groupName);
  if (data?.users) {
    return Object.values(data.users).map((user) => ({
      value: user.userId,
      label: user.userName || "Unknown User", // Fallback to "Unknown User" if userName is null or undefined
    }));
  }
  return [];
};

export const fetchAllUserData = async () => {
  const profileData = await fetchProfileData();
  const level1Users = await fetchUsersByGroup("Customer Support Team Level 1 (NOC)");
  const level2Users = await fetchUsersByGroup("Customer Support Level 2 (PM)");
  const adminUsers = await fetchUsersByGroup("Customer Support Admin");

  return {
    profileData,
    level1Users,
    level2Users,
    adminUsers,
  };
};