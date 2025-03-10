'use server'
import ikonBaseApi from "@/ikon/utils/api/ikonBaseApi"
import { getAllRoleForSoftwaresV2Props } from "./type"

export const getAllRoleForSoftwaresV2 = async ({ softwareIds }: { softwareIds: string[] }): Promise<getAllRoleForSoftwaresV2Props> => {
    const result = await ikonBaseApi({
        service: "roleService",
        operation: "getAllRoleForSoftwares",
        arguments_: [softwareIds]
    })
    return result.data
}


export const getGroupForRole = async ({ roleId }: { roleId: string }): Promise<any> => {
    const result = await ikonBaseApi({
        service: "roleService",
        operation: "getGroupForRole",
        arguments_: [roleId]
    })
    return result.data
}

export const getAllUsersForRoleMembership = async ({ roleId, accountId }: { roleId: string, accountId: string }): Promise<any> => {
    const result = await ikonBaseApi({
        service: "roleService",
        operation: "getAllUsersForRoleMembership",
        arguments_: [roleId, accountId]
    })
    return result.data
}

export const saveMembershipForUsers = async ({ roleId, userIds, softwareId, accountId }: { roleId: string, userIds: string[], softwareId: string, accountId: string }): Promise<any> => {
    const result = await ikonBaseApi({
        service: "roleService",
        operation: "saveMembershipForUsers",
        arguments_: [roleId, userIds, softwareId, accountId]
    })
    return result.data
}

export const getAllGroupForRoles = async ({roleIds}: {roleIds: Record<string,any>}) : Promise<any> =>{
    const result = await ikonBaseApi({
        service: "roleService",
        operation: "getAllGroupForRoles",
        arguments_: [roleIds]
    })
    return result.data
}