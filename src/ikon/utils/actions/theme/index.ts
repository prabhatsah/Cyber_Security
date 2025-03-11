"use server"
import { getCookieSession, setCookieSession } from "@/ikon/utils/session/cookieSession";
import { AccountThemeProps, defaultAccountTheme, defaultUserTheme, UserThemeProps } from "./type";
import { cookies } from "next/headers";

export const getThemeSession = async (): Promise<string> => {
    return await getCookieSession("theme") || "dark";
};

export const setThemeSession = async (theme: string) => {
    await setCookieSession("theme", theme);
};


export const getAccountTheme = async (): Promise<AccountThemeProps | undefined> => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join("; "); // Convert to a valid Cookie header string

    // Fetch API with cookies
    const resp = await fetch(`${process.env.NEXT_BASE_PATH}/api/theme/account`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cookie": cookieHeader, // ✅ Send all cookies
        },
        cache: "force-cache",
        next: {
            revalidate: 600,
            tags: ["accountTheme"]
        }
    });
    return resp.json();
};

export const getCurrentUserTheme = async (): Promise<UserThemeProps | undefined> => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join("; "); // Convert to a valid Cookie header string

    // Fetch API with cookies
    const resp = await fetch(`${process.env.NEXT_BASE_PATH}/api/theme/user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cookie": cookieHeader, // ✅ Send all cookies
        },
        cache: "force-cache",
        next: {
            tags: ["userTheme"]
        }
    });

    return resp.json();
};


export async function getThemeData(): Promise<AccountThemeProps & UserThemeProps> {
    let fAccountTheme = null;
    let fUserTheme = null;
    try {
        fAccountTheme = await getAccountTheme();
        fUserTheme = await getCurrentUserTheme();
    } catch (error) {
        console.log("Error in fetching theme data", error);
    }

    const accountTheme = {
        light: {
            primary: fAccountTheme?.light?.primary || defaultAccountTheme.light.primary,
            secondary: fAccountTheme?.light?.secondary || defaultAccountTheme.light.secondary,
            tertiary: fAccountTheme?.light?.tertiary || defaultAccountTheme.light.tertiary,
        },
        dark: {
            primary: fAccountTheme?.dark?.primary || defaultAccountTheme.dark.primary,
            secondary: fAccountTheme?.dark?.secondary || defaultAccountTheme.dark.secondary,
            tertiary: fAccountTheme?.dark?.tertiary || defaultAccountTheme.dark.tertiary,
        }
    }

    const userTheme = {
        mode: fUserTheme?.mode || defaultUserTheme.mode,
        font: fUserTheme?.font || defaultUserTheme.font,
        radius: fUserTheme?.radius || defaultUserTheme.radius,
    }

    return { ...accountTheme, ...userTheme }
}