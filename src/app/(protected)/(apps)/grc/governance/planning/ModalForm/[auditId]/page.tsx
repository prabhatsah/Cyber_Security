import React from "react";
import AuditDetailComponent from "./AuditDetailComponent";
import { getMyInstancesV2 } from "@/ikon/utils/api/processRuntimeService";
import { getUserDetailMap } from "../../../../components/createUserMap";
import { getCurrentUserId, getProfileData } from "@/ikon/utils/actions/auth";
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import {
  getAllSoftwareGroups,
  getAllUsersForGroupMembershipV2,
} from "@/ikon/utils/api/groupService";
import {
  getUserDashboardPlatformUtilData,
  getUserIdWiseUserDetailsMap,
} from "@/ikon/utils/actions/users";

interface TimeEntry {
  date: Date;
  hours: number;
}

interface Action {
  description: string;
  assignedTo: string;
  dueDate: string;
  timeEntries: TimeEntry[];
  status: string;
}

interface FindingActionData {
  auditId: string;
  actionsId: string;
  controlId: number;
  controlName: string;
  controlObjId: string;
  controlObjective: string;
  findingId: string;
  lastUpdateOn: string;
  meetingId: string;
  observation: string[];
  owner: string;
  recommendation: string[];
  severity: string;
  actions: Action[];
}

type FlattenedAction = Action & Omit<FindingActionData, "actions">;

async function fetchAuditData(auditId: string): Promise<any[]> {
  try {
    const auditInsData = await getMyInstancesV2<any>({
      processName: "Audit",
      predefinedFilters: { taskName: "View Audit" },
      mongoWhereClause: `this.Data.auditId == "${auditId}"`,
    });
    return auditInsData.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching audit data:", error);
    return []; // Return an empty array in case of an error
  }
}

async function fetchProfileData(): Promise<any> {
  try {
    const profile = await getProfileData();
    return profile;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return null; // Return null in case of an error
  }
}

export async function fetchUserMap(): Promise<
  { value: string; label: string }[]
> {
  try {
    const allUsers = await getUserDetailMap();
    const userIdNameMap: { value: string; label: string }[] = Object.values(
      allUsers
    )
      .map((user) => {
        if (user.userActive) {
          return {
            value: user.userId,
            label: user.userName,
          };
        }
        return undefined;
      })
      .filter(
        (user): user is { value: string; label: string } => user !== undefined
      );

    return userIdNameMap; // Return the user map
  } catch (error) {
    console.error("Error fetching user map data:", error);
    return []; // Return an empty array in case of an error
  }
}

async function fetchMeetingData(auditId: string): Promise<any[]> {
  try {
    const meetingInsData = await getMyInstancesV2<any>({
      processName: "Schedule Meeting",
      predefinedFilters: { taskName: "View Meeting" },
      mongoWhereClause: `this.Data.auditId == "${auditId}"`,
    });
    return meetingInsData.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching meeting data:", error);
    return []; // Return an empty array in case of an error
  }
}

async function fetchFollowUpMeetingData(auditId: string): Promise<any[]> {
  try {
    const findInsData = await getMyInstancesV2<any>({
      processName: "FollowUp Meeting",
      predefinedFilters: { taskName: "View FollowUp Meeting" },
      mongoWhereClause: `this.Data.auditId == "${auditId}"`,
    });
    return findInsData.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching meeting data:", error);
    return []; // Return an empty array in case of an error
  }
}

async function fetchFindingData(auditId: string): Promise<any[]> {
  try {
    const findInsData = await getMyInstancesV2<any>({
      processName: "Meeting Findings",
      predefinedFilters: { taskName: "View Find" },
      mongoWhereClause: `this.Data.auditId == "${auditId}"`,
    });
    return findInsData.map((e: any) => e.data);
  } catch (error) {
    console.error("Error fetching meeting data:", error);
    return []; // Return an empty array in case of an error
  }
}

async function fetchFindingActionData(auditId: string) {
  console.log(auditId);
  const findingActionInstances = await getMyInstancesV2({
    processName: "Meeting Findings Actions",
    predefinedFilters: { taskName: "View Action" },
    mongoWhereClause: `this.Data.auditId == "${auditId}"`,
  });
  console.log(findingActionInstances);
  const findingActionDatas = findingActionInstances.map(
    (instance) => instance.data
  ) as FindingActionData[];

  console.log(findingActionDatas);
  // const dataFormatForActionTable: FlattenedAction[] = findingActionDatas.flatMap(
  //     (data) =>
  //         data?.actions.map((action) => ({
  //             ...action,
  //             editActionId: crypto.randomUUID(),
  // followUpMeetings: [
  //     {
  //         date: "2025-09-10",
  //         remark: "Set up initial monitoring tools",
  //         owner: "Chris Johnson",
  //     },
  //     {
  //         date: "2025-09-20",
  //         remark: "Analyzed traffic patterns",
  //         owner: "Jane Smith",
  //     },
  // ],
  //     auditId: data?.auditId,
  //     actionsId: data?.actionsId,
  //     controlId: data?.controlId,
  //     controlName: data?.controlName,
  //     controlObjId: data?.controlObjId,
  //     controlObjName: data?.controlObjective,
  //     findingId: data?.findingId,
  //     lastUpdateOn: data?.lastUpdateOn,
  //     meetingId: data?.meetingId,
  //     observation: data?.observation,
  //     owner: data?.owner,
  //     recommendation: data?.recommendation ,
  //     severity: data?.severity,
  // }))
  // );
  // console.log(dataFormatForActionTable);
  return findingActionDatas;
}

async function getUserForGrpName(groupName: string) {
  const userDetailsMap = await getUserDashboardPlatformUtilData({
    isGroupNameWiseUserDetailsMap: true,
    groupNames: [groupName],
  });
  console.log(userDetailsMap);
  return userDetailsMap[groupName].users;
}

export default async function ParticularAduitDetails({
  params,
}: {
  params: { auditId: string };
}) {
  console.log("Audit ID from URL:", params.auditId);
  const fullAuditId = params.auditId.split("_")[0];
  const role = params.auditId.split("_")[1];
  console.log(
    "Role from URL:###########################################",
    role
  );
  const auditData = await fetchAuditData(fullAuditId);

  const userIdNameMap = await fetchUserMap();
  const meetingData = await fetchMeetingData(fullAuditId);
  const findingsData = await fetchFindingData(fullAuditId);
  const findActionData = await fetchFindingActionData(fullAuditId);
  const profileData = await fetchProfileData();
  const followUpMeetingData = await fetchFollowUpMeetingData(fullAuditId);

  console.log("followUpMeetingData Data from page.tsx", followUpMeetingData);

  const currUserId = await getCurrentUserId();
  const centralAdmingGrpMember = await getUserForGrpName("Central Admin Group");
  const auditManagerGrpMember = await getUserForGrpName("Audit Manager Group");
  const auditDetails = auditData[0] || {};
  const auditorTeam = auditDetails.auditorTeam;
  const isCentralAdminUser = currUserId in centralAdmingGrpMember;
  const isAuditManagerUser = currUserId in auditManagerGrpMember;
  const isCurrentUserAuditor = auditorTeam.includes(currUserId);

  const isAllowedToScheduleMeeting =
    isCentralAdminUser || isAuditManagerUser || isCurrentUserAuditor;
  const isAllowedForFindingAndActions =
    isCentralAdminUser || isAuditManagerUser || isCurrentUserAuditor;
  return (
    <AuditDetailComponent
      auditData={auditData}
      userIdNameMap={userIdNameMap}
      meetingData={meetingData}
      findingsData={findingsData}
      findActionData={findActionData}
      role={role}
      profileData={profileData} // Pass the profile data to the component
      followUpMeetingData={followUpMeetingData}
      currentUserId={currUserId}
      isAllowedToScheduleMeeting={isAllowedToScheduleMeeting}
      isAllowedForFindingAndActions={isAllowedForFindingAndActions}
    />
  );
}
