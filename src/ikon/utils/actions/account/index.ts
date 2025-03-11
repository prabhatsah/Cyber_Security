"use server"
import { cache } from "react";
import { getAccountTree } from "@/ikon/utils/api/accountService";
import { getCookieSession, setCookieSession } from "@/ikon/utils/session/cookieSession";
import { AccountTreeProps } from "./type";

export const getAccount = cache(async (): Promise<AccountTreeProps> => {
    return await getAccountTree()
});

export const getActiveAccountId = async (): Promise<string> => {
    const activeAccountId = await getCookieSession("activeAccountId")
    return activeAccountId || "";
};


export const getOrSetActiveAccountId = async (): Promise<string> => {
    let activeAccountId = await getCookieSession("activeAccountId")
    if (!activeAccountId) {
        try {
            const account = await getAccount()
            activeAccountId = account.ACCOUNT_ID
            await setActiveAccountId(activeAccountId)
        } catch (error) {
            console.error(error)
        }
    }
    return activeAccountId || "";
};

export const setActiveAccountId = async (accountId: string) => {
    await setCookieSession("activeAccountId", accountId)
};