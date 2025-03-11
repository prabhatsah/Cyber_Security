'use server'
import { revalidatePath, revalidateTag } from "next/cache"
import ikonBaseApi from "../ikonBaseApi"
import { RevalidateProps } from "../../actions/common/type"

export const deactivateUser = async ({ userId }: { userId: string }) => {
    await ikonBaseApi({
        service: "userService",
        operation: "deactivateUser",
        arguments_: [userId]
    })
    revalidateTag("userMap")
}

export const activateUser = async ({ userId }: { userId: string }) => {
    await ikonBaseApi({
        service: "userService",
        operation: "activateUser",
        arguments_: [userId]
    })
    revalidateTag("userMap")
}

export const getUserGroupMembershipV2 = async ({ userId }: { userId: string }): Promise<any> => {
    const result = await ikonBaseApi({
        service: "userService",
        operation: "getUserGroupMembership",
        arguments_: [userId]
    })
    return result.data
}

export const getAllRoleMembershipForUser = async ({ userId, accountId }: { userId: string, accountId: string }): Promise<any> => {
    const result = await ikonBaseApi({
        service: "userService",
        operation: "getAllRoleMembershipForUser",
        arguments_: [userId, accountId]
    })
    return result.data
}

export const editUser = async ({
    userId,
    userName,
    userPassword,
    userPhone,
    userEmail,
    userThumbnail,
    chargeable,
    membershipMap,
}: { userId: string, userName: string, userPassword: string, userPhone: string, userEmail: string, userThumbnail: string | null, chargeable: boolean, membershipMap: Record<string, any> }) => {
    const result = await ikonBaseApi({
        service: "userService",
        operation: "editUser",
        arguments_: [userId, userName, userPassword, userPhone, userEmail, userThumbnail, chargeable, membershipMap]
    })
    revalidateTag("userMap")
    revalidatePath("/setting/user")
    return result.data
}

export const createUserV2 = async ({
    userName,
    userLogin,
    userPassword,
    userPhone,
    userEmail,
    userThumbnail,
    userType,
    chargeable,
    accountId,
    membershipMap,
    emailSubject,
    emailContent,
}: { userName: string, userLogin: string, userPassword: string, userPhone: string, userEmail: string, userThumbnail: string | null, userType: string, chargeable: boolean, accountId: string, membershipMap: Record<string, any>, emailSubject: string, emailContent: any }) => {
    const result = await ikonBaseApi({
        service: "userService",
        operation: "createUserV2",
        arguments_: [userName, userLogin, userPassword, userPhone, userEmail, userThumbnail, userType, chargeable, accountId, membershipMap, emailSubject, emailContent]
    })
    return result.data;
}

export const postSignupRequest = async ({ userDetails }: { userDetails: Record<string, string>[] }) => {
    await ikonBaseApi({
        service: "userService",
        operation: "postSignupRequest",
        arguments_: [userDetails]
    })
}

export const checkExistingUser = async ({ userLogin }: { userLogin: string }): Promise<boolean> => {
    const result = await ikonBaseApi({
        service: "userService",
        operation: "checkExistingUser",
        arguments_: [userLogin]
    })
    return result.data
}