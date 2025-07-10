"use server";
import { cache } from "react";
import {
  getMyInstancesV2,
  getParameterizedDataForTaskId,
} from "../../api/processRuntimeService";
import {
  GroupDetailsProps,
  GroupWiseUserDetailsMapProps,
  RoleDetailsProps,
  RoleWiseUserDetailsMapProps,
  UserDashboardPlatformUtilParamsProps,
  UserIdWiseUserDetailsMapProps,
} from "./type";
import { getBaseSoftwareId, getCurrentSoftwareId } from "../software";
import { getCurrentUserId, getProfileData } from "../auth";
import { cookies } from "next/headers";

export const getUserDashboardPlatformUtilData = async (
  parameters: UserDashboardPlatformUtilParamsProps, isServerApi?: boolean
): Promise<any> => {
  const baseSoftwareId = await getBaseSoftwareId();
  const utilInstances = await getMyInstancesV2({
    processName: "User Dashboard Platform Util - All For Next",
    projections: null,
    softwareId: baseSoftwareId,
  }, isServerApi);
  const taskId = utilInstances[0].taskId;
  const userDetailsMap = await getParameterizedDataForTaskId<any>({
    taskId,
    parameters,
  });
  return userDetailsMap;
};

export const getUserIdWiseUserDetailsMap =
  async (): Promise<UserIdWiseUserDetailsMapProps> => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; "); // Convert to a valid Cookie header string

    // Fetch API with cookies
    const resp = await fetch(`${process.env.NEXT_BASE_PATH_URL}/api/user/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: cookieHeader, // ✅ Send all cookies
      },
      cache: "force-cache",
      next: {
        revalidate: 600,
        tags: ["userMap"],
      },
    });

    if (!resp.ok) throw new Error("Failed to fetch users");

    return resp.json();
  };

export const getGroupNameWiseUserDetailsMap = async (
  groupNames?: string[]
): Promise<GroupWiseUserDetailsMapProps> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; "); // Convert to a valid Cookie header string

    console.log("groupNames",groupNames)
  // Fetch API with cookies
  const resp = await fetch(`${process.env.NEXT_BASE_PATH_URL}/api/user/groups`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: cookieHeader, // ✅ Send all cookies
    },
    //cache: "force-cache",
    body: JSON.stringify({groupNames:groupNames}),
    // next: {
    //   revalidate: 600,
    // },
  });

  if (!resp.ok) throw new Error("Failed to fetch roles");

  return resp.json();
};

export const getGroupIdWiseUserDetailsMap = async (
  groupIds?: string[]
): Promise<GroupWiseUserDetailsMapProps> => {
  const softwareId = await getCurrentSoftwareId();
  const userDetailsMap = await getUserDashboardPlatformUtilData({
    softwareId,
    isGroupIdWiseUserDetailsMap: true,
    groupIds,
  });
  return userDetailsMap;
};

export const getUsersByGroupName = async (
  groupName: string
): Promise<GroupDetailsProps> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; "); // Convert to a valid Cookie header string

  // Fetch API with cookies
  const resp = await fetch(
    `${process.env.NEXT_BASE_PATH_URL}/api/user/group/${groupName}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: cookieHeader, // ✅ Send all cookies
      },
      cache: "force-cache",
      next: {
        revalidate: 600,
      },
    }
  );

  if (!resp.ok) throw new Error("Failed to fetch groups");

  return resp.json();
};

export const getUsersByGroupId = cache(
  async (groupId: string): Promise<GroupDetailsProps> => {
    const softwareId = await getCurrentSoftwareId();
    const userDetailsMap = await getUserDashboardPlatformUtilData({
      softwareId,
      isGroupIdWiseUserDetailsMap: true,
      groupIds: [groupId],
    });
    return userDetailsMap && Object.values(userDetailsMap)?.[0];
  }
);

export const getRoleNameWiseUserDetailsMap = async (
  roleNames?: string[]
): Promise<RoleWiseUserDetailsMapProps> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; "); // Convert to a valid Cookie header string

  // Fetch API with cookies
  const resp = await fetch(`${process.env.NEXT_BASE_PATH_URL}/api/user/roles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Cookie: cookieHeader, // ✅ Send all cookies
    },
    cache: "force-cache",
    body: JSON.stringify(roleNames),
    next: {
      revalidate: 600,
    },
  });

  if (!resp.ok) throw new Error("Failed to fetch roles");

  return resp.json();
};

export const getRoleIdWiseUserDetailsMap = cache(
  async (roleIds?: string[]): Promise<RoleWiseUserDetailsMapProps> => {
    const softwareId = await getCurrentSoftwareId();
    const userDetailsMap = await getUserDashboardPlatformUtilData({
      softwareId,
      isRoleIdWiseUserDetailsMap: true,
      roleIds,
    });
    return userDetailsMap;
  }
);

export const getUsersByRoleName = async (
  roleName: string
): Promise<RoleDetailsProps> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; "); // Convert to a valid Cookie header string

  // Fetch API with cookies
  const resp = await fetch(
    `${process.env.NEXT_BASE_PATH_URL}/api/user/role/${roleName}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: cookieHeader, // ✅ Send all cookies
      },
      cache: "force-cache",
      next: {
        revalidate: 600,
      },
    }
  );

  if (!resp.ok) throw new Error("Failed to fetch roles");

  return resp.json();
};

export const getUsersByRoleId = cache(
  async (roleId: string): Promise<RoleDetailsProps> => {
    const softwareId = await getCurrentSoftwareId();
    const userDetailsMap = await getUserDashboardPlatformUtilData({
      softwareId,
      isRoleIdWiseUserDetailsMap: true,
      roleIds: [roleId],
    });
    return userDetailsMap && Object.values(userDetailsMap)?.[0];
  }
);

export const getUserRoles = async (userId?: string): Promise<any> => {
  userId = userId || (await getProfileData()).USER_ID;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; "); // Convert to a valid Cookie header string

  // Fetch API with cookies
  const resp = await fetch(
    `${process.env.NEXT_BASE_PATH_URL}/api/user/${userId}/roles`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: cookieHeader, // ✅ Send all cookies
      },
      cache: "force-cache",
      next: {
        revalidate: 600,
      },
    }
  );

  if (!resp.ok) throw new Error("Failed to fetch roles");

  return resp.json();
};

export const getUserGroups = async (userId?: string): Promise<any> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; "); // Convert to a valid Cookie header string

  // Fetch API with cookies
  const resp = await fetch(
    `${process.env.NEXT_BASE_PATH_URL}/api/user/${userId}/groups`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Cookie: cookieHeader, // ✅ Send all cookies
      },
      //SANJIB WILL CHECK THIS BEFORE MERGING
      // cache: "force-cache",
      // next: {
      //   revalidate: 600,
      //   tags: ["userGroups"],
      // },
    }
  );

  if (!resp.ok) throw new Error("Failed to fetch groups");

  return resp.json();
};

export const getCurrentUserAccountGroups = async (
  userId?: string
): Promise<any> => {
  userId = userId ?? (await getCurrentUserId());
  const userDetailsMap = await getUserDashboardPlatformUtilData({
    isUserGroups: true,
    userId: userId,
  });
  console.log("userDetailsMap", userDetailsMap);
  const groups = userDetailsMap.groups.map((group) => group.groupName);
  return groups;
};