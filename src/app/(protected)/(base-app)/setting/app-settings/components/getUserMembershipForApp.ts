'use server'

import { getAccount } from "@/ikon/utils/actions/account";
import { getAllUsersForRoleMembership, getGroupForRole } from "@/ikon/utils/api/roleService";

export async function GetUserMembershipForApp({ roleId }: { roleId: string }) {
    const groupForRole = await getGroupForRole({ roleId });
    if (groupForRole.length > 0) {
        const { ACCOUNT_ID } = await getAccount();
        const userRoleFormMembership = await getAllUsersForRoleMembership({
            roleId: roleId,
            accountId: ACCOUNT_ID,
        });
        const userMember = userRoleFormMembership?.filter((userMember: Record<any, any>) => (
            userMember.MEMBER === "member"
        ))
        .map((userMemberId: Record<any, any>) => (
            userMemberId.USER_ID
        ))
        return userMember;        
    }
    
}