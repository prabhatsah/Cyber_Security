"use server"
import sha512 from 'crypto-js/sha512';
import ikonBaseApi from "@/ikon/utils/api/ikonBaseApi"
import { ForgotPasswordProps, GetLoggedInUserProfileDetailsReturnProps, GetLoggedInUserProfileReturnProps, LoginProps, UpdateUserProfileProps, ValidateOTPProps } from './type';
import { revalidateTag } from 'next/cache';

export const login = async ({ userName, password }: LoginProps) => {
    const result = await ikonBaseApi({
        service: "loginService",
        operation: "login",
        arguments_: [userName, sha512(password).toString()],
        isTicketRequried: false
    })
    return result.data
}

export const resetPassword = async ({ userName }: ForgotPasswordProps) => {
    const result = await ikonBaseApi({
        service: "loginService",
        operation: "resetPassword",
        arguments_: [userName],
        isTicketRequried: false
    })
    return result.data
}

export const validateOTP = async ({ temporaryTicket, otp }: ValidateOTPProps) => {
    const result = await ikonBaseApi({
        service: "loginService",
        operation: "validateOTP",
        arguments_: [temporaryTicket, otp],
        isTicketRequried: false
    })
    return result.data
}

export const logout = async () => {
    const result = await ikonBaseApi({
        service: "loginService",
        operation: "logout"
    })
    return result.data
}
export const getLoggedInUserProfile = async (): Promise<GetLoggedInUserProfileReturnProps> => {
    const result = await ikonBaseApi({
        service: "loginService",
        operation: "getLoggedInUserProfile"
    })
    return result.data
}

export const getLoggedInUserProfileDetails = async (): Promise<GetLoggedInUserProfileDetailsReturnProps> => {
    const result = await ikonBaseApi({
        service: "loginService",
        operation: "getLoggedInUserProfileDetails",
    })
    return result.data
}


export const updateUserProfile = async ({ userName, userPassword, userPhone, userEmail, userThumbnail }: UpdateUserProfileProps) => {
    const result = await ikonBaseApi({
        service: "loginService",
        operation: "updateUserProfile",
        arguments_: [userName, userPassword, userPhone, userEmail, userThumbnail]
    })
    revalidateTag("profile")
    return result.data
}