import { getAccount } from '@/ikon/utils/actions/account';
import { getAllUsersForRoleMembership, getGroupForRole } from '@/ikon/utils/api/roleService';

export default async function ShowUserTableModal({roleId}: {roleId: string}) {

    try {
        const groupForRole = await getGroupForRole({ roleId });
        if (groupForRole.length > 0) {
            const { ACCOUNT_ID } = await getAccount();
            const userRoleFormMembership = await getAllUsersForRoleMembership({
                roleId: roleId,
                accountId: ACCOUNT_ID,
            });
            return userRoleFormMembership;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

