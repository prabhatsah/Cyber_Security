"use server"
import { redirect } from "next/navigation";
import { GetLoggedInUserProfileDetailsReturnProps, GetLoggedInUserProfileReturnProps, LoginProps } from "@/ikon/utils/api/loginService/type";
import { getLoggedInUserProfile, getLoggedInUserProfileDetails, logout } from "@/ikon/utils/api/loginService";
import { clearAllCookieSession, getCookieSession, setCookieSession } from "@/ikon/utils/session/cookieSession";
import { cookies } from "next/headers";

export const setTicket = async (ticket: string) => {
    await setCookieSession("ticket", ticket)
};
export const getTicket = async (): Promise<string | undefined> => {
    return await getCookieSession("ticket")
};

export const getProfileData = async (): Promise<GetLoggedInUserProfileReturnProps & GetLoggedInUserProfileDetailsReturnProps> => {
    let data1: GetLoggedInUserProfileReturnProps = {} as GetLoggedInUserProfileReturnProps;
    try {
        data1 = await getLoggedInUserProfile();
    } catch (error) {
        console.error(error)
    }
    let data2: GetLoggedInUserProfileDetailsReturnProps = {} as GetLoggedInUserProfileDetailsReturnProps;
    try {
        data2 = await getLoggedInUserProfileDetails();
    } catch (error) {
        console.error(error)
    }
    return { ...data1, ...data2 };
}

export async function signOut() {
    try {
        await logout();
    } catch (error) {
        console.error(error)
    }
    await clearAllCookieSession()
    redirect("/login")
}

export const getCurrentUserId = async (): Promise<string> => {
    const currentUserId = await getCookieSession("currentUserId")
    return currentUserId || "";
};

export const setCurrentUserId = async (userId: string) => {
    await setCookieSession("currentUserId", userId)
};