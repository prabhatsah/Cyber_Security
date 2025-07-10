'use server'
import { getActiveAccountId } from "@/ikon/utils/actions/account";
import { getBaseSoftwareId } from "@/ikon/utils/actions/software";
import { getClientGroupsForUserV2, getSoftwareGroupsForUserV2 } from "@/ikon/utils/api/groupService";
import { getAllGroupForRoles } from "@/ikon/utils/api/roleService";

async function asynchronous_getGroupDetails({ currentUserId }: { currentUserId: string }) {
    const accountId = await getActiveAccountId();
    if (currentUserId) {
        const clientGroups_promise = await getClientGroupsForUserV2({
            accountId: accountId,
            userId: currentUserId
        })
        return clientGroups_promise;
    }
    return [];
}

async function sofwaterGroups_promise({ membershipDetails, selectedRoleIdForCurrentUsers }: {membershipDetails: Record<string, any>, selectedRoleIdForCurrentUsers: string[] }) {
    const seletectedRolesId: string[] = selectedRoleIdForCurrentUsers;
    const baseSoftwareId = await getBaseSoftwareId();
    membershipDetails.map((role: Record<string, string>) => {
        if (role.SOFTWARE_ID === baseSoftwareId) {
            seletectedRolesId.push(role.ROLE_ID)
        }
    })
    let allGroupRoles = []
    if (seletectedRolesId.length > 0) {
        allGroupRoles = await getAllGroupForRoles({
            roleIds: seletectedRolesId
        })
    }
    return allGroupRoles;
}

async function dynamicGroup_promise({ currentUserId }: { currentUserId: string }) {
    const accountId = await getActiveAccountId();
    if (currentUserId) {
        const softwareGroupForUser = await getSoftwareGroupsForUserV2({
            accountId: accountId,
            userId: currentUserId
        })
        const dynamicGroup = softwareGroupForUser?.filter((e: Record<string, any>) => e.GROUP_TYPE == "DYNAMIC")
        return dynamicGroup;
    }
    return [];
}

export default async function SaveUsersData({ currentUserId, membershipDetails, selectedRoleIdForCurrentUsers }: { currentUserId: string, membershipDetails: Record<string, any>, selectedRoleIdForCurrentUsers: string[] }) {

    const clientGroupForUser = await asynchronous_getGroupDetails({ currentUserId });
    const appGroupForUser = await sofwaterGroups_promise({ membershipDetails, selectedRoleIdForCurrentUsers });
    const dynamicGroupForUser = await dynamicGroup_promise({ currentUserId });
    const allGroupForUser = [...clientGroupForUser, ...appGroupForUser, ...dynamicGroupForUser]
    let membership: Record<string, any> = {};
    allGroupForUser.map((groupUser) => {
        membership[groupUser.GROUP_ID] = []
    })
    return membership;
}   
