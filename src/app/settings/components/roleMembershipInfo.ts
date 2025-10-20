'use server'
import { getActiveAccountId } from '@/ikon/utils/actions/account';
import { getAllRoleMembershipForUser, getUserGroupMembershipV2 } from '@/ikon/utils/api/userService';


export default async function RoleMembershipInfo({ userId }: { userId: string }) {
    const currentAccountId = await getActiveAccountId();
    const responseGroupMembership = await getUserGroupMembershipV2({
        userId: userId
    })
    if (responseGroupMembership.length > 0) {
        const allRoleMembershipForUser = await getAllRoleMembershipForUser({
            userId: userId,
            accountId: currentAccountId
        })
        return allRoleMembershipForUser;
    }
    return null;
}
