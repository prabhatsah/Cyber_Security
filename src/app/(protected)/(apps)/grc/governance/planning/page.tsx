import React from 'react'
import { getGroupNameWiseUserDetailsMap, getUserDashboardPlatformUtilData, getUserIdWiseUserDetailsMap } from '@/ikon/utils/actions/users';
import PlanningDataTable from './ModalForm/planningDataTble';
import { getMyInstancesV2 } from '@/ikon/utils/api/processRuntimeService';
import { getActiveAccountId } from '@/ikon/utils/actions/account';
import { getAllSoftwareGroups, getAllUsersForGroupMembershipV2 } from '@/ikon/utils/api/groupService';
import { getCurrentUserId } from '@/ikon/utils/actions/auth';

async function getUserDetailMap() {
    const allUsers = await getUserIdWiseUserDetailsMap();
    console.log(allUsers);
    return allUsers;
}

export async function createUserMap() {
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

export const fetchAuditsData = async () => {
    try {
        const auditsData = await getMyInstancesV2({
            processName: "Audit",
            predefinedFilters: { taskName: "View Audit" },
        });
        const auditsDataDynamic = Array.isArray(auditsData)
            ? auditsData.map((e: any) => e.data)
            : [];
        return auditsDataDynamic;
    } catch (error) {
        console.error("Failed to fetch the process:", error);
        throw error;
    }
};

async function getUserForGrpName(groupName: string) {
    const userDetailsMap = await getUserDashboardPlatformUtilData({
        isGroupNameWiseUserDetailsMap :true,
        groupNames:[groupName]
      });
    return  userDetailsMap[groupName].users
}

export default async function AuditManagement() {
    const userIdNameMap: { value: string, label: string }[] = await createUserMap();
    //const allUsers = await getUserDetailMap();
    const auditsData = await fetchAuditsData();
    const selectedRole = "auditor"; // This should be set based on the user's selection in the RoleSelectorDialog
    const currUserId = await getCurrentUserId();
    const centralAdmingGrpMember = await getUserForGrpName('Central Admin Group');
    const auditManagerGrpMember = await getUserForGrpName('Audit Manager Group');
    const isCentralAdminUser = currUserId in centralAdmingGrpMember;
    const isAuditManagerUser = currUserId in auditManagerGrpMember;
    const isAllowedToCreateAudits = isCentralAdminUser || isAuditManagerUser;
    return (
        <>
            <div className="flex flex-col gap-3">
                {/* <PlanningDataTable userIdNameMap={userIdNameMap} tableData={auditsData} /> */}
                <PlanningDataTable userIdNameMap={userIdNameMap} tableData={auditsData} selectedRole={selectedRole} isAllowedToCreateAudits={isAllowedToCreateAudits}/>
            </div>
        </>
    )
}



