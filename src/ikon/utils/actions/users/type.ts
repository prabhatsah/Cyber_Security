export interface UserDashboardPlatformUtilParamsProps {
    softwareId?: string;
    accountId?: string;
    userIds?: string[];
    activeUser?: boolean;
    userType?: string;
    isRoleIdWiseUserDetailsMap?: boolean;
    isRoleNameWiseUserDetailsMap?: boolean;
    roleIds?: string[];
    roleNames?: string[];
    isGroupNameWiseUserDetailsMap?: boolean;
    isGroupIdWiseUserDetailsMap?: boolean;
    groupNames?: string[];
    groupIds?: string[];
    userId?: string;
    isUserGroups?: boolean;
    isUserRoles?: boolean;
}
export interface UserDetailsProps {
    userId: string;
    userLogin: string;
    userName: string | null;
    userEmail: string | null;
    userPhone: string | null;
    userInvited: boolean;
    userActive: boolean;
}

export interface UserIdWiseUserDetailsMapProps {
    [key: string]: UserDetailsProps
}

export interface GroupDetailsProps {
    groupName: string;
    groupId: string;
    users: UserDetailsProps[];
}

export interface GroupWiseUserDetailsMapProps {
    [key: string]: GroupDetailsProps
}

export interface RoleDetailsProps {
    roleName: string;
    roleId: string;
    users: UserDetailsProps[];
}

export interface RoleWiseUserDetailsMapProps {
    [key: string]: RoleDetailsProps
}