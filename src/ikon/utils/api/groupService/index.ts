import ikonBaseApi from "../ikonBaseApi";

export const getClientGroupsForUserV2 = async ({accountId, userId}: {accountId: string,userId: string}): Promise<any> =>{
    const result = await ikonBaseApi({
        service: "groupService",
        operation: "getClientGroupsForUser",
        arguments_: [accountId,userId]
    })
    return result.data;
}

export const getSoftwareGroupsForUserV2 = async ({ accountId, userId}: {accountId: string,userId: string}): Promise<any> =>{
    const result = await ikonBaseApi({
        service: "groupService",
        operation: "getSoftwareGroupsForUser",
        arguments_: [accountId,userId]
    })
    return result.data;
}

export const getAllSoftwareGroups = async ({accountId}: {accountId:string}): Promise<any> =>{
    const result = await ikonBaseApi({
        service: "groupService",
        operation: "getAllSoftwareGroups",
        arguments_: [accountId]
    })
    return result.data;
}

export const getAllUsersForGroupMembershipV2 = async ({groupId, accountId}: {groupId:string,accountId:string}): Promise<any> =>{
    const result = await ikonBaseApi({
        service: "groupService",
        operation: "getAllUsersForGroupMembership",
        arguments_: [groupId,accountId]
    })
    return result.data;
}